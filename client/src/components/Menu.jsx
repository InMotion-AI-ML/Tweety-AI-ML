import React from 'react';
import Logout from './Logout';

const Menu = ({ handleMenuBtn, isOpen }) => {
  return (
    <div
      id='menu'
      className='absolute top-4 right-4 z-50 flex flex-col justify-evenly items-end space-y-2'
    >
      {/* Menu button */}
      <button
        onClick={handleMenuBtn}
        className='text-white bg-orange-500 p-2 rounded-lg hover:bg-orange-600 text-4xl'
      >
        {/* Hamburger menu icon */}
        &#9776;
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className='hiddenMenu bg-black bg-opacity-90 px-4 py-2 text-white text-2xl font-bold rounded-lg shadow-lg flex flex-col justify-evenly items-center'>
          <h1 className=' mb-2 cursor-pointer'>Profile</h1>
          <Logout />
        </div>
      )}
    </div>
  );
};

export default Menu;
