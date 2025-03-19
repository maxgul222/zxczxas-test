import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import TopBar from './components/TopBar';
import GameGrid from './components/GameGrid';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <TopBar />
        <GameGrid />
      </div>
    </Router>
  );
}

export default App;
