-- Create Lab Tests table
CREATE TABLE IF NOT EXISTS lab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    test_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'pending', 'in_progress')),
    purity_result TEXT,
    test_method TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    report_url TEXT,
    certificate_number TEXT UNIQUE,
    lab_name TEXT NOT NULL DEFAULT 'Study Pulse Certified Lab',
    technician_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Lab Test Results table for detailed metrics
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

-- Create Lab Test Images table for report scans
CREATE TABLE IF NOT EXISTS lab_test_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES lab_tests(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type TEXT NOT NULL CHECK (image_type IN ('report', 'certificate', 'chart', 'microscope')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_lab_tests_status ON lab_tests(status);
CREATE INDEX IF NOT EXISTS idx_lab_tests_test_date ON lab_tests(test_date);
CREATE INDEX IF NOT EXISTS idx_lab_tests_product_id ON lab_tests(product_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_results_test_id ON lab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_images_test_id ON lab_test_images(test_id);

-- Enable RLS
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lab_tests
CREATE POLICY "Public read access for lab_tests" ON lab_tests
    FOR SELECT USING (true);

CREATE POLICY "Admin insert access for lab_tests" ON lab_tests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin update access for lab_tests" ON lab_tests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for lab_test_results
CREATE POLICY "Public read access for lab_test_results" ON lab_test_results
    FOR SELECT USING (true);

CREATE POLICY "Admin full access for lab_test_results" ON lab_test_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for lab_test_images
CREATE POLICY "Public read access for lab_test_images" ON lab_test_images
    FOR SELECT USING (true);

CREATE POLICY "Admin full access for lab_test_images" ON lab_test_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Function to get lab tests with filtering
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
        p.name as product_name,
        lt.report_url,
        lt.certificate_number,
        lt.lab_name,
        lt.technician_name,
        lt.notes,
        lt.created_at,
        lt.updated_at,
        COUNT(ltr.id) as result_count
    FROM lab_tests lt
    LEFT JOIN products p ON lt.product_id = p.id
    LEFT JOIN lab_test_results ltr ON lt.id = ltr.test_id
    WHERE 
        (search_query IS NULL OR 
         lt.name ILIKE '%' || search_query || '%' OR
         lt.description ILIKE '%' || search_query || '%' OR
         lt.certificate_number ILIKE '%' || search_query || '%' OR
         p.name ILIKE '%' || search_query || '%')
        AND (status_filter IS NULL OR lt.status = status_filter)
        AND (date_from IS NULL OR lt.test_date >= date_from)
        AND (date_to IS NULL OR lt.test_date <= date_to)
    GROUP BY lt.id, p.name
    ORDER BY lt.test_date DESC, lt.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- Function to get detailed lab test with results
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
        p.name as product_name,
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
    LEFT JOIN products p ON lt.product_id = p.id
    LEFT JOIN lab_test_results ltr ON lt.id = ltr.test_id
    LEFT JOIN lab_test_images lti ON lt.id = lti.test_id
    WHERE lt.id = test_id
    GROUP BY lt.id, p.name;
END;
$$;

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lab_tests_updated_at 
    BEFORE UPDATE ON lab_tests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
