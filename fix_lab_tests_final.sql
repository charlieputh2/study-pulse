-- Check what exists and create the missing functions

-- First, let's check if our tables exist
SELECT 'Checking tables...' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'lab_test%';

-- Check if functions exist
SELECT 'Checking functions...' as status;
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE 'get_lab_test%';

-- If tables don't exist, create them first
CREATE TABLE IF NOT EXISTS lab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    test_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'pending', 'in_progress')),
    purity_result TEXT,
    test_method TEXT NOT NULL,
    product_id UUID,
    report_url TEXT,
    certificate_number TEXT UNIQUE,
    lab_name TEXT NOT NULL DEFAULT 'Study Pulse Certified Lab',
    technician_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lab_test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES lab_tests(id) ON DELETE CASCADE,
    parameter_name TEXT NOT NULL,
    parameter_value TEXT NOT NULL,
    unit TEXT,
    reference_range TEXT,
    status TEXT NOT NULL CHECK (status IN ('pass', 'fail', 'warning')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_results ENABLE ROW LEVEL SECURITY;

-- Add policies
DROP POLICY IF EXISTS "Public read access for lab_tests" ON lab_tests;
DROP POLICY IF EXISTS "Public read access for lab_test_results" ON lab_test_results;

CREATE POLICY "Public read access for lab_tests" ON lab_tests FOR SELECT USING (true);
CREATE POLICY "Public read access for lab_test_results" ON lab_test_results FOR SELECT USING (true);

-- Insert sample data if table is empty
INSERT INTO lab_tests (name, description, test_date, status, purity_result, test_method, report_url, certificate_number, lab_name, technician_name, notes) VALUES
('Tirzepatide Purity Analysis', 'Comprehensive HPLC analysis confirming pharmaceutical-grade purity', '2024-01-15', 'passed', '99.8%', 'HPLC-UV', 'https://studypulse.com/reports/tirzepatide-purity.pdf', 'SP-LAB-2024-001', 'Study Pulse Certified Lab', 'Dr. Sarah Chen', 'Batch meets specifications'),
('Semaglutide Potency Test', 'Bioassay testing for therapeutic potency verification', '2024-01-12', 'passed', '99.5%', 'Cell-based Bioassay', 'https://studypulse.com/reports/semaglutide-potency.pdf', 'SP-LAB-2024-002', 'Study Pulse Certified Lab', 'Dr. Michael Roberts', 'Potency within specification')
ON CONFLICT (certificate_number) DO NOTHING;

-- Now create the RPC functions
CREATE OR REPLACE FUNCTION get_lab_tests(
    search_query TEXT DEFAULT NULL,
    status_filter TEXT DEFAULT NULL,
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT NULL,
    limit_count INT DEFAULT 50,
    offset_count INT DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    test_date DATE,
    status TEXT,
    purity_result TEXT,
    test_method TEXT,
    product_id UUID,
    product_name TEXT,
    report_url TEXT,
    certificate_number TEXT,
    lab_name TEXT,
    technician_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    result_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lt.id,
        lt.name,
        lt.description,
        lt.test_date,
        lt.status,
        lt.purity_result,
        lt.test_method,
        lt.product_id,
        NULL::TEXT as product_name,
        lt.report_url,
        lt.certificate_number,
        lt.lab_name,
        lt.technician_name,
        lt.notes,
        lt.created_at,
        lt.updated_at,
        COUNT(ltr.id) as result_count
    FROM lab_tests lt
    LEFT JOIN lab_test_results ltr ON lt.id = ltr.test_id
    WHERE 
        (search_query IS NULL OR 
         lt.name ILIKE '%' || search_query || '%' OR
         lt.description ILIKE '%' || search_query || '%' OR
         lt.certificate_number ILIKE '%' || search_query || '%')
        AND (status_filter IS NULL OR lt.status = status_filter)
        AND (date_from IS NULL OR lt.test_date >= date_from)
        AND (date_to IS NULL OR lt.test_date <= date_to)
    GROUP BY lt.id
    ORDER BY lt.test_date DESC, lt.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

CREATE OR REPLACE FUNCTION get_lab_test_detail(test_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    test_date DATE,
    status TEXT,
    purity_result TEXT,
    test_method TEXT,
    product_id UUID,
    product_name TEXT,
    report_url TEXT,
    certificate_number TEXT,
    lab_name TEXT,
    technician_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    results JSONB,
    images JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lt.id,
        lt.name,
        lt.description,
        lt.test_date,
        lt.status,
        lt.purity_result,
        lt.test_method,
        lt.product_id,
        NULL::TEXT as product_name,
        lt.report_url,
        lt.certificate_number,
        lt.lab_name,
        lt.technician_name,
        lt.notes,
        lt.created_at,
        lt.updated_at,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', ltr.id,
                    'parameter_name', ltr.parameter_name,
                    'parameter_value', ltr.parameter_value,
                    'unit', ltr.unit,
                    'reference_range', ltr.reference_range,
                    'status', ltr.status,
                    'created_at', ltr.created_at
                )
            ) FILTER (WHERE ltr.id IS NOT NULL),
            '[]'::jsonb
        ) as results,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', lti.id,
                    'image_url', lti.image_url,
                    'image_type', lti.image_type,
                    'description', lti.description,
                    'created_at', lti.created_at
                )
            ) FILTER (WHERE lti.id IS NOT NULL),
            '[]'::jsonb
        ) as images
    FROM lab_tests lt
    LEFT JOIN lab_test_results ltr ON lt.id = ltr.test_id
    LEFT JOIN lab_test_images lti ON lt.id = lti.test_id
    WHERE lt.id = test_id
    GROUP BY lt.id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_lab_tests TO anon;
GRANT EXECUTE ON FUNCTION get_lab_test_detail TO anon;

-- Test the functions
SELECT 'Testing get_lab_tests...' as status;
SELECT * FROM get_lab_tests() LIMIT 1;

SELECT 'Functions created successfully!' as status;
SELECT COUNT(*) as total_lab_tests FROM lab_tests;
