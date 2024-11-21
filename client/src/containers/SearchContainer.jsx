import React from 'react'; // import React and useState (to manage state) and useRef (creates a reference) React hooks
import SearchInput from '../components/SearchInput';
import SearchAI from '../components/SearchAI';

const SearchContainer = ({ setResponseResults }) => {
  return (
    <div id='searchContainer' className=' flex flex-col items-center'>
      <SearchInput setResponseResults={setResponseResults} />
      <SearchAI setResponseResults={setResponseResults} />
    </div>
  );
};

export default SearchContainer;
