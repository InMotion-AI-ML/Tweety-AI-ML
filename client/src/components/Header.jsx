import React from 'react';
import Menu from './Menu';

function Header({ isOpen, setIsOpen, handleMenuBtn }) {
  return (
    <div id='browserLogo'>
      <img src='/Shirt Logo Draft.png' alt='Logo' />
      <Menu
        handleMenuBtn={handleMenuBtn}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      {/* Optionally, include more images or elements here */}
      {/* <img src="/l-intro-1630426166.jpg" alt="pic1" />
      <img src="/istockphoto-1322887164-612x612.jpg" alt="pic2" />
      <img src="/no-such-thing-as-a-bad-workout-1.jpg" alt="pic3" /> */}
    </div>
  );
}

export default Header;
