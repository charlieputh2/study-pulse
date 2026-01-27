-- Quick Lab Tests Fix - Run this in Supabase SQL Editor

-- Step 1: Create the basic tables first
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

CREATE TABLE IF NOT EXISTS lab_test_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES lab_tests(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type TEXT NOT NULL CHECK (image_type IN ('report', 'certificate', 'chart', 'microscope')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_images ENABLE ROW LEVEL SECURITY;

-- Step 3: Add policies
DROP POLICY IF EXISTS "Public read access for lab_tests" ON lab_tests;
DROP POLICY IF EXISTS "Public read access for lab_test_results" ON lab_test_results;
DROP POLICY IF EXISTS "Public read access for lab_test_images" ON lab_test_images;

CREATE POLICY "Public read access for lab_tests" ON lab_tests FOR SELECT USING (true);
CREATE POLICY "Public read access for lab_test_results" ON lab_test_results FOR SELECT USING (true);
CREATE POLICY "Public read access for lab_test_images" ON lab_test_images FOR SELECT USING (true);

-- Step 4: Insert sample data
DELETE FROM lab_test_images;
DELETE FROM lab_test_results;
DELETE FROM lab_tests;

INSERT INTO lab_tests (name, description, test_date, status, purity_result, test_method, report_url, certificate_number, lab_name, technician_name, notes) VALUES
('Tirzepatide Purity Analysis', 'Comprehensive HPLC analysis confirming pharmaceutical-grade purity and identity verification', '2024-01-15', 'passed', '99.8%', 'HPLC-UV', 'https://studypulse.com/reports/tirzepatide-purity-2024-01-15.pdf', 'SP-LAB-2024-001', 'Study Pulse Certified Lab', 'Dr. Sarah Chen', 'Batch #TIR2401 meets all quality specifications'),
('Semaglutide Potency Test', 'Bioassay testing for therapeutic potency verification and activity confirmation', '2024-01-12', 'passed', '99.5%', 'Cell-based Bioassay', 'https://studypulse.com/reports/semaglutide-potency-2024-01-12.pdf', 'SP-LAB-2024-002', 'Study Pulse Certified Lab', 'Dr. Michael Roberts', 'Potency within 98-102% specification range'),
('Molecular Structure Verification', 'Mass spectrometry confirmation of molecular structure and molecular weight verification', '2024-01-10', 'passed', '100%', 'LC-MS/MS', 'https://studypulse.com/reports/tirzepatide-ms-2024-01-10.pdf', 'SP-LAB-2024-003', 'Study Pulse Certified Lab', 'Dr. Emily Watson', 'Molecular weight confirmed: 4753.6 Da'),
('Heavy Metals Screening', 'ICP-MS analysis for heavy metal contamination including lead, arsenic, cadmium, and mercury', '2024-01-08', 'passed', 'Safe', 'ICP-MS', 'https://studypulse.com/reports/heavy-metals-2024-01-08.pdf', 'SP-LAB-2024-004', 'Study Pulse Certified Lab', 'Dr. James Lee', 'All heavy metals below USP limits'),
('Microbial Contamination Test', 'Sterility testing for bacterial and fungal contamination using USP <61> methods', '2024-01-05', 'passed', 'Negative', 'USP <61> Sterility Test', 'https://studypulse.com/reports/microbial-2024-01-05.pdf', 'SP-LAB-2024-005', 'Study Pulse Certified Lab', 'Dr. Lisa Anderson', 'No microbial growth detected after 14 days'),
('Endotoxin Analysis', 'LAL assay for endotoxin level verification using USP <85> methods', '2024-01-03', 'passed', '<0.1 EU/mg', 'LAL Assay', 'https://studypulse.com/reports/endotoxin-2024-01-03.pdf', 'SP-LAB-2024-006', 'Study Pulse Certified Lab', 'Dr. Robert Taylor', 'Endotoxin levels well within specification'),
('Residual Solvent Analysis', 'GC-MS analysis for residual solvents according to ICH Q3C guidelines', '2024-01-01', 'passed', 'Compliant', 'GC-MS', 'https://studypulse.com/reports/solvents-2024-01-01.pdf', 'SP-LAB-2024-007', 'Study Pulse Certified Lab', 'Dr. Maria Garcia', 'All residual solvents below ICH limits'),
('pH and Stability Testing', 'pH measurement and accelerated stability testing under various conditions', '2023-12-28', 'passed', '7.4 ± 0.2', 'pH Meter & Stability Chamber', 'https://studypulse.com/reports/ph-stability-2023-12-28.pdf', 'SP-LAB-2024-008', 'Study Pulse Certified Lab', 'Dr. David Kim', 'Stable for 24 months at 25°C/60% RH'),
('Particle Size Analysis', 'Laser diffraction analysis for particle size distribution and morphology', '2023-12-25', 'passed', 'D50: 45.2 μm', 'Laser Diffraction', 'https://studypulse.com/reports/particle-size-2023-12-25.pdf', 'SP-LAB-2024-009', 'Study Pulse Certified Lab', 'Dr. Jennifer White', 'Particle size within specification range'),
('Water Content Analysis', 'Karl Fischer titration for water content determination', '2023-12-22', 'passed', '2.3%', 'Karl Fischer', 'https://studypulse.com/reports/water-content-2023-12-22.pdf', 'SP-LAB-2024-010', 'Study Pulse Certified Lab', 'Dr. Thomas Brown', 'Water content within specification');

-- Step 5: Insert test results
INSERT INTO lab_test_results (test_id, parameter_name, parameter_value, unit, reference_range, status)
SELECT 
    lt.id,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN 'Purity'
        WHEN lt.name LIKE '%Potency%' THEN 'Potency'
        WHEN lt.name LIKE '%Molecular%' THEN 'Molecular Weight'
        WHEN lt.name LIKE '%Heavy Metals%' THEN 'Lead'
        WHEN lt.name LIKE '%Microbial%' THEN 'Total Aerobic Count'
        WHEN lt.name LIKE '%Endotoxin%' THEN 'Endotoxin'
        WHEN lt.name LIKE '%Residual%' THEN 'Acetone'
        WHEN lt.name LIKE '%pH%' THEN 'pH'
        WHEN lt.name LIKE '%Particle%' THEN 'D50'
        WHEN lt.name LIKE '%Water%' THEN 'Water Content'
    END,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN '99.8'
        WHEN lt.name LIKE '%Potency%' THEN '99.5'
        WHEN lt.name LIKE '%Molecular%' THEN '4753.6'
        WHEN lt.name LIKE '%Heavy Metals%' THEN '<0.1'
        WHEN lt.name LIKE '%Microbial%' THEN '<1'
        WHEN lt.name LIKE '%Endotoxin%' THEN '0.08'
        WHEN lt.name LIKE '%Residual%' THEN '<50'
        WHEN lt.name LIKE '%pH%' THEN '7.4'
        WHEN lt.name LIKE '%Particle%' THEN '45.2'
        WHEN lt.name LIKE '%Water%' THEN '2.3'
    END,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN '%'
        WHEN lt.name LIKE '%Potency%' THEN '%'
        WHEN lt.name LIKE '%Molecular%' THEN 'Da'
        WHEN lt.name LIKE '%Heavy Metals%' THEN 'ppm'
        WHEN lt.name LIKE '%Microbial%' THEN 'CFU/g'
        WHEN lt.name LIKE '%Endotoxin%' THEN 'EU/mg'
        WHEN lt.name LIKE '%Residual%' THEN 'ppm'
        WHEN lt.name LIKE '%pH%' THEN 'pH'
        WHEN lt.name LIKE '%Particle%' THEN 'μm'
        WHEN lt.name LIKE '%Water%' THEN '%'
    END,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN '≥98.0%'
        WHEN lt.name LIKE '%Potency%' THEN '95-105%'
        WHEN lt.name LIKE '%Molecular%' THEN '4753.6 ± 1.0'
        WHEN lt.name LIKE '%Heavy Metals%' THEN '<10 ppm'
        WHEN lt.name LIKE '%Microbial%' THEN '<10 CFU/g'
        WHEN lt.name LIKE '%Endotoxin%' THEN '<0.5 EU/mg'
        WHEN lt.name LIKE '%Residual%' THEN '<500 ppm'
        WHEN lt.name LIKE '%pH%' THEN '7.0-8.0'
        WHEN lt.name LIKE '%Particle%' THEN '40-50 μm'
        WHEN lt.name LIKE '%Water%' THEN '<5%'
    END,
    'pass'
FROM lab_tests lt;

-- Step 6: Create the RPC functions
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

-- Step 7: Grant permissions
GRANT EXECUTE ON FUNCTION get_lab_tests TO anon;
GRANT EXECUTE ON FUNCTION get_lab_test_detail TO anon;

-- Step 8: Verify everything worked
SELECT 'Setup Complete!' as status;
SELECT COUNT(*) as lab_tests_count FROM lab_tests;
SELECT COUNT(*) as lab_test_results_count FROM lab_test_results;
