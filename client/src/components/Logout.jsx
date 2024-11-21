import React from 'react';
// import {useNavigate} from 'react-router-dom' // needs to be installed; then replace onClick handling

const Logout = () => {
  return (
    <div className='Logout'>
      <button
        onClick={() =>
          (window.location.href = 'http://localhost:8080/api/logout')
        }
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
