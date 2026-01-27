const { createClient } = require('@supabase/supabase-js');

// Use your production credentials
const supabaseUrl = 'https://krdocvyhqttfyhbhcice.supabase.co';
const supabaseKey = 'sb_publishable_okjtlco2JXLny4ytO7ey4Q_dE8-tR-W';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createFunction() {
  const sql = `
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

    GRANT EXECUTE ON FUNCTION get_lab_tests TO public;
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
    
    if (error) {
      console.error('Error creating function:', error);
    } else {
      console.log('Function created successfully!');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

createFunction();
