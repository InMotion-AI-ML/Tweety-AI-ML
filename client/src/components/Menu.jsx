import React from 'react';
import Logout from './Logout';

const Menu = ({ handleMenuBtn, isOpen }) => {
  return (
    <div
      id='menu'
      className='absolute top-4 right-4 z-50 flex flex-col items-end space-y-2'
    >
      {/* Menu button */}
      <button
        onClick={handleMenuBtn}
        className='text-white bg-orange-500 p-2 rounded-lg hover:bg-orange-600 text-2xl'
      >
        {/* Hamburger menu icon */}
        &#9776;
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className='hiddenMenu bg-black bg-opacity-90 p-4 rounded-lg shadow-lg'>
          <h1 className='text-white text-lg font-bold mb-2'>Profile</h1>
          <Logout />
        </div>
      )}
    </div>
  );
};

export default Menu;
