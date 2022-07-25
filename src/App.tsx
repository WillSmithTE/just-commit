import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PrivacyPolicy } from './PrivacyPolicy';
import { Route, Routes } from 'react-router-dom'
import { Home } from './Home';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
