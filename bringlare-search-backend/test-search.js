const axios = require('axios');

async function testSearch() {
  try {
    console.log('Testing search API...');
    
    // Test search endpoint
    const response = await axios.get('http://localhost:3001/api/search', {
      params: {
        q: 'elon musk',
        page: 1,
        lang: 'en'
      }
    });
    
    console.log('Search Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('\nHealth Check Response:');
    console.log(JSON.stringify(healthResponse.data, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSearch();