import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing connection...');
  const [error, setError] = useState<string | null>(null);

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
        
        setConnectionStatus('✅ Connection successful!');
        console.log('Auth session:', authData);
        console.log('Sample product data:', dbData);
      } catch (err) {
        setConnectionStatus('❌ Connection failed');
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Connection test failed:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '500px',
      margin: '20px auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>Supabase Connection Test</h2>
      <p>Status: <strong>{connectionStatus}</strong></p>
      {error && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px',
          color: '#c62828'
        }}>
          Error: {error}
        </div>
      )}
      <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
};

export default TestConnection;
