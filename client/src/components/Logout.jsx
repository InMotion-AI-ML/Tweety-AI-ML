import React from 'react';
// import {useNavigate} from 'react-router-dom' // needs to be installed; then replace onClick handling

const Logout = () => {
  return (
    <div
      id='Logout'
      className='mb-2 pb-2 px-4 py-0.3 cursor-pointer bg-red-600 rounded-lg hover:bg-red-700'
    >
      <h1
        onClick={() =>
          (window.location.href = 'http://localhost:8080/api/logout')
        }
      >
        Logout
      </h1>
    </div>
  );
};

export default Logout;
