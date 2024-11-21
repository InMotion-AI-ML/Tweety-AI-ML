import React, { useState } from 'react';
import axios from 'axios';

const SearchAI = ({ setResponseResults }) => {
  const [searchAI, setSearchAI] = useState(''); // state for saving user's AI query

  const handleAISubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('searchAI: ', searchAI);
    fetchAIOptions();
  };

  // AXIOS REQUEST:
  // const fetchAIOptions = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:8080/api/aisearch', {
  //       searchAI, // The payload sent to the server
  //     });

  //     // Axios automatically parses JSON responses, no need for `response.json()`
  //     const data = response.data;
  //     // setResponseResults(data);
  //     console.log('Frontend - res.body: ', data); // Test Backend Response
  //   } catch (error) {
  //     console.error('Error while fetching AI search options:', error);

  //     // Optional: Log more detailed error information
  //     if (error.response) {
  //       console.error('Server responded with:', error.response.data);
  //     } else if (error.request) {
  //       console.error('Request made but no response received:', error.request);
  //     } else {
  //       console.error('Error setting up request:', error.message);
  //     }
  //   }
  // };

  // FETCH REQUEST
  const fetchAIOptions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/aisearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchAI }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch AI search options');
      }

      const data = await response.json();
      // setResponseResults(data);
      console.log('Frontend - res.body: ', data); // Test Backend Response
    } catch (error) {
      console.error('Error while fetching AI search options:', error);
    }
  };

  return (
    <div className='inputContainer'>
      <h1>Personal Trainer 'ChatPT' Search</h1>
      <label htmlFor='aiSearch'></label>
      <input
        type='text'
        id='aiSearch'
        value={searchAI}
        placeholder='What is your exercise goal?'
        onChange={(e) => setSearchAI(e.target.value)}
      />
      <button onClick={handleAISubmit}>Search</button>
    </div>
  );
};

export default SearchAI;
