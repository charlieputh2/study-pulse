-- Create Lab Tests RPC Functions - Run this in Supabase SQL Editor

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

-- Grant execute permissions to public
GRANT EXECUTE ON FUNCTION get_lab_tests TO anon;
GRANT EXECUTE ON FUNCTION get_lab_test_detail TO anon;

-- Test the functions
SELECT 'Testing get_lab_tests function...' as status;
SELECT * FROM get_lab_tests() LIMIT 1;

SELECT 'Testing get_lab_test_detail function...' as status;
SELECT * FROM get_lab_test_detail(NULL) LIMIT 1;
