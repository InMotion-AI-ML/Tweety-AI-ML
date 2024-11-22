// NOT UTILIZED
import React, { useState } from 'react';
import SearchContainer from './SearchContainer';
import ResultsContainer from './ResultsContainer';

// I WANT THIS TO BE THE MAIN CONTAINER THAT HAS THE LOGO, SEARCH, AND RETURN IN DIFFERENT ELEMENTS FROM DIFFERENT MODULES
const MainContainer = () => {
  const [responseResults, setResponseResults] = useState([]); // sets state for responseResults to results of search from backend

  return (
    <div
      id='mainContainer'
      className='min-h-screen flex flex-col items-center pb-60'
    >
      {/* DISPLAYS THE SEARCH INPUT METHODS */}
      <SearchContainer setResponseResults={setResponseResults} />
      {/* DISPLAYS THE RETURNED EXERCISE RESULTS AS A UNORDERED LIST */}
      <ResultsContainer responseResults={responseResults} />
    </div>
  );
};

export default MainContainer;
