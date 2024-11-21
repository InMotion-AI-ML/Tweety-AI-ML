import React from 'react';
import Logout from './Logout';

const Menu = ({ handleMenuBtn, isOpen }) => {
  return (
    <div className='menu'>
      <button onClick={handleMenuBtn}>&#9776;</button>
      {isOpen && (
        <div className='hiddenMenu'>
          <h1>Profile</h1>
          <Logout />
        </div>
      )}
    </div>
  );
};

export default Menu;
