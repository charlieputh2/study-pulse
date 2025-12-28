import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test authentication
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) throw authError;
        
        // Test database query
        const { data: dbData, error: dbError } = await supabase
          .from('products')
          .select('*')
          .limit(1);
          
        if (dbError) throw dbError;
        
        setStatus('✅ Connection successful!');
        setData({
          auth: authData,
          products: dbData
        });
      } catch (err) {
        setStatus('❌ Connection failed');
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Connection test failed:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="font-semibold">Status: {status}</p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
            Error: {error}
          </div>
        )}
      </div>
      
      {data && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Connection Details:</h2>
          <div className="bg-white p-4 rounded shadow">
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
};

export default TestConnection;
