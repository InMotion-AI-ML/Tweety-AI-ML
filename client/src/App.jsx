/* eslint-disable jsx-a11y/img-redundant-alt */
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

import React, { useState, useRef, useEffect } from 'react'; // import React and useState (to manage state) and useRef (creates a reference) React hooks
import './App.css'; // import App.css/styling

function App() {
	// const [searchEntry, setSearchEntry] = useState(''); // sets state for searchEntry to user input text (ref: Unit6 TicTacToe)
	const [responseResults, setResponseResults] = useState([]); // sets state for responseResults to results of search from backend
	const [muscle, setMuscle] = useState('');
	const [category, setCategory] = useState('');
	const searchInputRef = useRef(null); // searchInputRef, a mutable obj, assigned to the reference obejct of the input DOM element/text input field once rendered
	// no need to re-render the text box, so no need to set state, only want the text

	const [muscleOptions, setMuscleOptions] = useState([]); // state for muscle options
	const [categoryOptions, setCategoryOptions] = useState([]); // state for category options
	const [expandedExerciseId, setExpandedExerciseId] = useState(null); // state to track expanded exercise on hover

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
    // Main container with gradient background and white text
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-500 via-yellow-400 to-black text-white">
      
      {/* LOGO SECTION */}
      {/* Flex container centers the logo horizontally with margin below */}
      <div className="flex justify-center mb-6">
        {/* Logo with fixed width/height and object-fit for proper scaling */}
        <img
          src="/Shirt Logo Draft.png"
          alt="Logo"
          className="w-36 h-36 object-contain"
        />
      </div>
  
      {/* SEARCH INPUT SECTION */}
      {/* A black container with opacity, padding, rounded corners, shadow, and centered horizontally */}
      <div className="bg-black bg-opacity-80 p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto">
        {/* Flex container to align input, selectors, and button horizontally with spacing */}
        <div className="flex items-center space-x-4">
  
          {/* SEARCH INPUT */}
          {/* Flex column for vertical alignment with width for even spacing */}
          <div className="flex flex-col w-1/3">
            {/* Label for input with bottom margin */}
            <label htmlFor="searchId" className="block text-sm font-medium mb-2">
              Search
            </label>
            {/* Input with full width, padding, border, focus effects, and black text */}
            <input
              type="text"
              id="searchId"
              placeholder="Search exercises"
              ref={searchInputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") exerciseSearch();
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
            />
          </div>
  
          {/* MUSCLE SELECTOR */}
          {/* Flex column for vertical alignment with reduced width */}
          <div className="flex flex-col w-1/4">
            {/* Label for muscle selector */}
            <label htmlFor="muscle" className="block text-sm font-medium mb-2">
              Muscle
            </label>
            {/* Dropdown with full width, padding, border, and focus effects */}
            <select
              id="muscle"
              value={muscle}
              onChange={(e) => setMuscle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
            >
              <option value="">Select Muscle</option>
              {muscleOptions.map((m, index) => (
                <option key={index} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
  
          {/* CATEGORY SELECTOR */}
          {/* Flex column with width matching the muscle selector */}
          <div className="flex flex-col w-1/4">
            {/* Label for category selector */}
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            {/* Dropdown with similar styling as muscle selector */}
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
  
          {/* SEARCH BUTTON */}
          {/* Flex column with invisible label for alignment */}
          <div className="flex flex-col w-1/4">
            {/* Invisible label to maintain spacing alignment */}
            <label className="block text-sm font-medium mb-2 invisible">
              Button
            </label>
            {/* Button with full width, orange background, hover effects, and padding */}
            <button
              id="searchButton"
              onClick={exerciseSearch}
              className="w-full bg-orange-500 text-black py-2 rounded-lg font-bold hover:bg-orange-600 hover:text-white transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
  
      {/* EXERCISES SECTION */}
      {/* Main flex container for exercises and details with space between columns */}
      <div
        id="exerciseContainer"
        className="flex flex-row mt-8 max-w-7xl w-full mx-auto space-x-6"
      >
        
        {/* LEFT COLUMN: Exercise list */}
        {/* Flex column for vertical stacking with scroll bar, max height, and background styling */}
        <div className="exerciseList flex flex-col w-1/3 space-y-4 overflow-y-scroll max-h-[400px] bg-black bg-opacity-80 p-4 rounded-lg shadow-md">
          {responseResults.length > 0 ? (
            <ul className="space-y-4">
              {responseResults.map((exercise) => (
                // Each list item with hover effects and border styling
                <li
                  key={exercise.id}
                  className="bg-black bg-opacity-80 text-white border border-orange-500 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                  onMouseEnter={() => setExpandedExerciseId(exercise.id)}
                >
                  {/* Exercise name */}
                  <h3 className="text-lg font-bold">{exercise.name}</h3>
                  {/* Exercise image or placeholder */}
                  {Array.isArray(exercise.images) ? (
                    <img
                      src={exercise.images[0]}
                      alt={exercise.name}
                      className="w-full h-20 object-cover rounded-md mt-2"
                    />
                  ) : (
                    <p className="text-gray-400">No image available</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-orange-500">No exercises found</p>
          )}
        </div>
  
        {/* RIGHT COLUMN: Exercise details */}
        {/* Flex container with grow to fill remaining space */}
        <div className="exerciseDetails flex-grow bg-black bg-opacity-80 p-6 rounded-lg shadow-md">
          {expandedExerciseId ? (
            responseResults.map((exercise) =>
              exercise.id === expandedExerciseId ? (
                <div key={exercise.id} className="text-left">
                  {/* Exercise name */}
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">
                    {exercise.name}
                  </h2>
                  {/* Images displayed in grid */}
                  {Array.isArray(exercise.images) ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {exercise.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Exercise ${exercise.name} - ${index + 1}`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No images available</p>
                  )}
                  {/* Exercise details */}
                  <p>
                    <strong>Force:</strong> {exercise.force}
                  </p>
                  <p>
                    <strong>Level:</strong> {exercise.level}
                  </p>
                  <p>
                    <strong>Mechanic:</strong> {exercise.mechanic}
                  </p>
                  <p>
                    <strong>Equipment:</strong> {exercise.equipment}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {exercise.instructions}
                  </p>
                </div>
              ) : null
            )
          ) : (
            <p className="text-center text-gray-400">Hover over an exercise</p>
          )}
        </div>
      </div>
    </div>
  );
  
  
}

export default App;
