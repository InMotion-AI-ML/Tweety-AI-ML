import React from 'react'; // import React and useState (to manage state) and useRef (creates a reference) React hooks
import SearchInput from '../components/SearchInput';
import SearchAI from '../components/SearchAI';

const SearchContainer = ({ setResponseResults }) => {
  return (
    <div id='searchContainer' className=' flex flex-col items-center'>
      <div className="bg-black bg-opacity-80 p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto">
      <SearchInput setResponseResults={setResponseResults} />
      <SearchAI setResponseResults={setResponseResults} />
    </div>
    </div>
  );
};

export default SearchContainer;
