import React, { useState, useRef, useEffect } from 'react';

function SearchInput({ setResponseResults }) {
  const [muscle, setMuscle] = useState('');
  const [category, setCategory] = useState('');
  const [muscleOptions, setMuscleOptions] = useState([]); // state for muscle options
  const [categoryOptions, setCategoryOptions] = useState([]); // state for category options
  const searchInputRef = useRef(null); // searchInputRef, a mutable obj, assigned to the reference obejct of the input DOM element/text input field once rendered
  // no need to re-render the text box, so no need to set state, only want the text

  useEffect(() => {
    console.log('Muscle selected:', muscle); // log muscle selection
    console.log('Category selected:', category); // log category selection
  }, [muscle, category]); // Re-run this when either muscle or category changes

  useEffect(() => {
    // fetch muscle and category options from backend
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/unique-values');
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();

        const sortedMuscles = data.muscles.sort((a, b) => a.localeCompare(b)); // sort muscle options
        const sortedCategories = data.categories.sort((a, b) =>
          a.localeCompare(b)
        ); // sort category options

        setMuscleOptions(sortedMuscles); // set muscle options/state after sorting
        setCategoryOptions(sortedCategories); // set category options/state after sorting
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []); // empty dependency array means this effect runs once when the component mounts

  const exerciseSearch = async () => {
    const searchInput = searchInputRef.current.value.trim(); // get the search term
    const queryParams = {};

    // only add the parameters that are non-empty
    if (searchInput) queryParams.id = searchInput; // include the search term if provided
    if (muscle && muscle !== '') queryParams.muscle = muscle; // include muscle if selected
    if (category && category !== '') queryParams.category = category; // include category if selected

    if (Object.keys(queryParams).length === 0) {
      // if no filter or search term is provided, show an alert and stop the search
      alert('Please enter a search term or select a filter');
      return;
    }

    const query = new URLSearchParams(queryParams).toString(); // construct the query string using URLSearchParams

    try {
      const response = await fetch(`http://localhost:8080/api/search?${query}`);
      if (!response.ok) throw new Error('Failed to fetch data from the server');
      const data = await response.json();
      setResponseResults(data); // sets responseResults state with the search results
      searchInputRef.current.value = ''; // resets search box to an empty string after each search
    } catch (error) {
      console.error('Error: ', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='bg-black bg-opacity-80 p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto'>
      {/* SEARCH INPUT SECTION */}
      {/* A black container with opacity, padding, rounded corners, shadow, and centered horizontally */}

      {/* Flex container to align input, selectors, and button horizontally with spacing */}
      <div className='flex items-center space-x-4'>
        {/* SEARCH INPUT */}
        {/* Flex column for vertical alignment with width for even spacing */}
        <div className='flex flex-col w-1/3'>
          {/* Label for input with bottom margin */}
          <label htmlFor='searchId' className='block text-sm font-medium mb-2'>
            Search
          </label>
          {/* Input with full width, padding, border, focus effects, and black text */}
          <input
            type='text'
            id='searchId'
            placeholder='Search exercises'
            ref={searchInputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') exerciseSearch();
            }}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-black'
          />
        </div>

        {/* MUSCLE SELECTOR */}
        {/* Flex column for vertical alignment with reduced width */}
        <div className='flex flex-col w-1/4'>
          {/* Label for muscle selector */}
          <label htmlFor='muscle' className='block text-sm font-medium mb-2'>
            Muscle
          </label>
          {/* Dropdown with full width, padding, border, and focus effects */}
          <select
            id='muscle'
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-black'
          >
            <option value=''>Select Muscle</option>
            {muscleOptions.map((m, index) => (
              <option key={index} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORY SELECTOR */}
        {/* Flex column with width matching the muscle selector */}
        <div className='flex flex-col w-1/4'>
          {/* Label for category selector */}
          <label htmlFor='category' className='block text-sm font-medium mb-2'>
            Category
          </label>
          {/* Dropdown with similar styling as muscle selector */}
          <select
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-black'
          >
            <option value=''>Select Category</option>
            {categoryOptions.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* SEARCH BUTTON */}
        {/* Flex column with invisible label for alignment */}
        <div className='flex flex-col w-1/4'>
          {/* Invisible label to maintain spacing alignment */}
          <label className='block text-sm font-medium mb-2 invisible'>
            Button
          </label>
          {/* Button with full width, orange background, hover effects, and padding */}
          <button
            id='searchButton'
            onClick={exerciseSearch}
            className='w-full bg-orange-500 text-black py-2 rounded-lg font-bold hover:bg-orange-600 hover:text-white transition-colors'
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchInput;
