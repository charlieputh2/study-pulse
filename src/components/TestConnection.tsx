import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Define the Product type based on your database schema
interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  // Add other product fields as needed
}

// Define the shape of the auth data
interface AuthData {
  session: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email?: string;
      // Add other user fields as needed
    };
  } | null;
}

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    auth: AuthData | null;
    products: Product[] | null;
  } | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('🔍 Testing authentication...');
        
        // Test authentication
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw new Error(`Authentication failed: ${authError.message}`);
        }

        setStatus('🔍 Testing database connection...');
        
        // Test database query
        const { data: dbData, error: dbError } = await supabase
          .from('products')
          .select('*')
          .limit(1);
          
        if (dbError) {
          throw new Error(`Database query failed: ${dbError.message}`);
        }

        setStatus('✅ Connection successful!');
        setData({
          auth: authData,
          products: dbData
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setStatus('❌ Connection failed');
        setError(errorMessage);
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
    </div>
  );
};

export default TestConnection;