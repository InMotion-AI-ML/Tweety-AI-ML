import React, { useState, useRef, useEffect } from 'react';

function SearchInput({
  setResponseResults,
  // searchInputRef,
  // muscleOptions,
  // categoryOptions,
  // muscle,
  // setMuscle,
  // category,
  // setCategory,
  // exerciseSearch,
}) {
  const [muscle, setMuscle] = useState('');
  const [category, setCategory] = useState('');
  const [muscleOptions, setMuscleOptions] = useState([]); // state for muscle options
  const [categoryOptions, setCategoryOptions] = useState([]); // state for category options
  // const [searchInput, setSearchInput] = useState('');
  // const [queryParams, setQueryParams] = useState({});
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

  // const exerciseSearch = async () => {
  //   setSearchInput(searchInputRef.current.value.trim()); // get the search term
  //   setQueryParams({});

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
    <div className='searchContainer'>
      <div className='inputContainer'>
        <h1>Exercise Search</h1>
        <input
          type='text'
          id='searchId'
          placeholder='Search exercises by name'
          ref={searchInputRef} // once this element is rendered, React assigns the input field to searchInputRef.current, allows direct interaction after
          onKeyDown={(e) => {
            // search triggers on pressing enter or with button click below
            if (e.key === 'Enter') exerciseSearch();
          }}
        />
        <select
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)} // update muscle state
          placeholder='Select Muscle'
        >
          <option value=''>Select Muscle</option>
          {muscleOptions.map((m, index) => (
            <option key={index} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)} // update category state
          placeholder='Select Category'
        >
          <option value=''>Select Category</option>
          {categoryOptions.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button id='searchButton' onClick={exerciseSearch}>
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchInput;
