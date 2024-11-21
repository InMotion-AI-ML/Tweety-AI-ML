import React, { useState } from 'react';
import Header from './components/Header';
import MainContainer from './containers/MainContainer.jsx';
import './App.css'; // import App.css/styling

function App() {
  // const [searchEntry, setSearchEntry] = useState(''); // sets state for searchEntry to user input text (ref: Unit6 TicTacToe)
  const [isOpen, setIsOpen] = useState(false); // state for saving user's AI query

  const handleMenuBtn = async (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div id='appContainer'>
      {/* DISPLAYS THE LOGO AND PROJECT / APPLICATION NAME */}
      <Header
        handleMenuBtn={handleMenuBtn}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      <MainContainer />
    </div>
  );
}

export default App;
