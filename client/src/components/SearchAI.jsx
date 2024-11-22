import React, { useState } from 'react';
import axios from 'axios';

const SearchAI = ({ setResponseResults }) => {
  const [searchAI, setSearchAI] = useState(''); // state for saving user's AI query

  const handleAISubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('Test');
    console.log('searchAI: ', searchAI);
    fetchAIOptions();
    setSearchAI('');
  };

  // AXIOS REQUEST:
  const fetchAIOptions = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/aisearch', {
        searchAI, // The payload sent to the server
      });

      // Axios automatically parses JSON responses, no need for `response.json()`
      const data = response.data;
      setResponseResults(data.aiResponse);
      console.log('Frontend - res.body: ', data); // Test Backend Response
    } catch (error) {
      console.error('Error while fetching AI search options:', error);

      // Optional: Log more detailed error information
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  // FETCH REQUEST
  // const fetchAIOptions = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8080/api/aisearch', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ searchAI }),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch AI search options');
  //     }

  //     const data = await response.json();
  //     // setResponseResults(data);
  //     console.log('Frontend - res.body: ', data); // Test Backend Response
  //   } catch (error) {
  //     console.error('Error while fetching AI search options:', error);
  //   }
  // };

  return (
    <div className='flex items-center space-x-4 py-3'>
      {/* SEARCH INPUT SECTION */}
      {/* SEARCH INPUT */}
      <div className='flex flex-col w-3/4'>
        {/* Label for input */}
        <label htmlFor='aiSearch' className='block text-sm font-medium mb-2'>
          Personal Trainer "Chad-PT" Search
        </label>
        {/* Input field with styling */}
        <input
          type='text'
          id='aiSearch'
          value={searchAI}
          placeholder='What is your exercise goal?'
          onChange={(e) => setSearchAI(e.target.value)}
          className='w-fill px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-black'
        />
      </div>
      {/* SEARCH BUTTON */}
      <div className='flex flex-col items-end w-1/4'>
        {/* Invisible label to maintain spacing alignment */}
        <label className='block text-sm font-medium mb-2 invisible'>
          Button
        </label>
        {/* Button with full width, orange background, hover effects, and padding */}
        <button
          onClick={handleAISubmit}
          className='w-[200px] bg-orange-500 text-black py-2 rounded-lg font-bold hover:bg-orange-600 hover:text-white transition-colors'
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchAI;
