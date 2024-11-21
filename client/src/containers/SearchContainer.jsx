import React from 'react'; // import React and useState (to manage state) and useRef (creates a reference) React hooks
import SearchInput from '../components/SearchInput';
import SearchAI from '../components/SearchAI';

const SearchContainer = ({ setResponseResults }) => {
  return (
    <div className='searchContainer'>
      <SearchInput
        setResponseResults={setResponseResults}
        // searchInputRef={searchInputRef}
        // muscleOptions={muscleOptions}
        // categoryOptions={categoryOptions}
        // muscle={muscle}
        // setMuscle={setMuscle}
        // category={category}
        // setCategory={setCategory}
        // exerciseSearch={exerciseSearch}
      />
      <SearchAI setResponseResults={setResponseResults} />
    </div>
  );
};

export default SearchContainer;
