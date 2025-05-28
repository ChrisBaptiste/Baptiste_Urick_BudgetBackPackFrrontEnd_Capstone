// src/components/Debug/ApiTester.jsx

import React, { useState } from 'react';
import axios from 'axios';

const ApiTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testApi = async (apiType, params) => {
    setLoading(prev => ({ ...prev, [apiType]: true }));
    try {
      const response = await axios.get(`/api/search/${apiType}`, { params });
      setResults(prev => ({ 
        ...prev, 
        [apiType]: { 
          success: true, 
          data: response.data,
          count: Array.isArray(response.data) ? response.data.length : 'Not an array'
        }
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [apiType]: { 
          success: false, 
          error: error.response?.data || error.message 
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [apiType]: false }));
    }
  };

  const testFlights = () => testApi('flights', {
    origin: 'NYC',
    destination: 'LAX',
    departureDate: '2025-06-15',
    adults: '1'
  });

  const testAccommodations = () => testApi('accommodations', {
    destinationCity: 'Paris',
    checkInDate: '2025-06-15',
    checkOutDate: '2025-06-17',
    adults: '2'
  });

  const testEvents = () => testApi('events', {
    destinationCity: 'London',
    searchTerm: 'museums'
  });

  // Only show this component in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      margin: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    }}>
      <h3>🧪 API Tester (Development Only)</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Use this to test if your external APIs are working correctly.
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={testFlights} 
          disabled={loading.flights}
          style={{
            padding: '10px 15px',
            backgroundColor: loading.flights ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.flights ? 'not-allowed' : 'pointer'
          }}
        >
          {loading.flights ? 'Testing...' : 'Test Flights API'}
        </button>
        <button 
          onClick={testAccommodations} 
          disabled={loading.accommodations}
          style={{
            padding: '10px 15px',
            backgroundColor: loading.accommodations ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.accommodations ? 'not-allowed' : 'pointer'
          }}
        >
          {loading.accommodations ? 'Testing...' : 'Test Accommodations API'}
        </button>
        <button 
          onClick={testEvents} 
          disabled={loading.events}
          style={{
            padding: '10px 15px',
            backgroundColor: loading.events ? '#ccc' : '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.events ? 'not-allowed' : 'pointer'
          }}
        >
          {loading.events ? 'Testing...' : 'Test Events API'}
        </button>
      </div>

      {Object.entries(results).map(([apiType, result]) => (
        <div key={apiType} style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          border: `2px solid ${result.success ? '#28a745' : '#dc3545'}`,
          borderRadius: '8px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da'
        }}>
          <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase' }}>
            {result.success ? '✅' : '❌'} {apiType} API Result
          </h4>
          {result.success ? (
            <div>
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#155724' }}>
                Success! Retrieved {result.count} items
              </p>
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  View Raw Data (Click to expand)
                </summary>
                <pre style={{ 
                  fontSize: '12px', 
                  overflow: 'auto', 
                  maxHeight: '300px',
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div>
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#721c24' }}>
                Failed to fetch data
              </p>
              <pre style={{ 
                color: '#721c24', 
                fontSize: '12px',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                marginTop: '10px'
              }}>
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApiTester;