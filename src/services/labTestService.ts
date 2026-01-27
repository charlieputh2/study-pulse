import { supabase } from '../lib/supabase';

export interface LabTest {
  id: string;
  name: string;
  description: string;
  test_date: string;
  status: 'passed' | 'failed' | 'pending' | 'in_progress';
  purity_result: string;
  test_method: string;
  product_id?: string;
  product_name?: string;
  report_url?: string;
  certificate_number?: string;
  lab_name: string;
  technician_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  result_count: number;
}

export interface LabTestDetail extends LabTest {
  results: LabTestResult[];
  images: LabTestImage[];
}

export interface LabTestResult {
  id: string;
  parameter_name: string;
  parameter_value: string;
  unit?: string;
  reference_range?: string;
  status: 'pass' | 'fail' | 'warning';
  created_at: string;
}

export interface LabTestImage {
  id: string;
  image_url: string;
  image_type: 'report' | 'certificate' | 'chart' | 'microscope';
  description?: string;
  created_at: string;
}

export interface LabTestFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

class LabTestService {
  async getLabTests(filters: LabTestFilters = {}): Promise<{ data: LabTest[]; error: any }> {
    try {
      const { data, error } = await supabase.rpc('get_lab_tests', {
        search_query: filters.search || null,
        status_filter: filters.status || null,
        date_from: filters.dateFrom || null,
        date_to: filters.dateTo || null,
        limit_count: filters.limit || 50,
        offset_count: filters.offset || 0
      });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      return { data: [], error };
    }
  }

  async getLabTestDetail(testId: string): Promise<{ data: LabTestDetail | null; error: any }> {
    try {
      const { data, error } = await supabase.rpc('get_lab_test_detail', {
        test_id: testId
      });

      if (error) throw error;

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      console.error('Error fetching lab test detail:', error);
      return { data: null, error };
    }
  }

  async searchLabTests(query: string, filters: Omit<LabTestFilters, 'search'> = {}): Promise<{ data: LabTest[]; error: any }> {
    return this.getLabTests({ ...filters, search: query });
  }

  async filterLabTests(filters: LabTestFilters): Promise<{ data: LabTest[]; error: any }> {
    return this.getLabTests(filters);
  }

  async downloadReport(testId: string): Promise<{ url: string | null; error: any }> {
    try {
      // First get the test details to find the report URL
      const { data: testDetail, error } = await this.getLabTestDetail(testId);
      
      if (error) throw error;
      if (!testDetail?.report_url) throw new Error('No report URL available');

      // Create a download link
      const link = document.createElement('a');
      link.href = testDetail.report_url;
      link.download = `lab-test-${testDetail.certificate_number || testId}.pdf`;
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { url: testDetail.report_url, error: null };
    } catch (error) {
      console.error('Error downloading report:', error);
      return { url: null, error };
    }
  }

  async generatePDFReport(testId: string): Promise<{ url: string | null; error: any }> {
    try {
      // This would integrate with a PDF generation service
      // For now, we'll simulate it with a placeholder
      const { data: testDetail, error } = await this.getLabTestDetail(testId);
      
      if (error) throw error;
      if (!testDetail) throw new Error('Test not found');

      // In a real implementation, you would call your PDF generation API
      const pdfUrl = `https://api.studypulse.com/generate-pdf/${testId}`;
      
      return { url: pdfUrl, error: null };
    } catch (error) {
      console.error('Error generating PDF report:', error);
      return { url: null, error };
    }
  }

  async exportAllTests(filters: LabTestFilters = {}): Promise<{ url: string | null; error: any }> {
    try {
      // Get all tests matching the filters
      const { data: tests, error } = await this.getLabTests({ ...filters, limit: 1000 });
      
      if (error) throw error;

      // Create CSV content
      const headers = [
        'Certificate Number',
        'Test Name',
        'Product',
        'Test Date',
        'Status',
        'Purity Result',
        'Test Method',
        'Lab Name',
        'Technician'
      ];

      const csvContent = [
        headers.join(','),
        ...tests.map(test => [
          test.certificate_number || '',
          `"${test.name}"`,
          `"${test.product_name || ''}"`,
          test.test_date,
          test.status,
          test.purity_result,
          test.test_method,
          `"${test.lab_name}"`,
          `"${test.technician_name || ''}"`
        ].join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lab-tests-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { url: 'export-completed', error: null };
    } catch (error) {
      console.error('Error exporting tests:', error);
      return { url: null, error };
    }
  }

  async subscribeToLabTests(callback: (payload: any) => void) {
    return supabase
      .channel('lab_tests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_tests'
        },
        callback
      )
      .subscribe();
  }

  async unsubscribeFromLabTests(subscription: any) {
    return supabase.removeChannel(subscription);
  }
}

export const labTestService = new LabTestService();
