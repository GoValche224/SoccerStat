import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeagueMatchesPage from './components/LeagueMatches';
import Leagues from './components/Leagues';
import TeamsL from './components/TeamsL';
import TeamMatchesPage from './components/TeamMatches';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Leagues />} />
          <Route path="/league/:leagueId" element={<LeagueMatchesPage />} />
          <Route path="/teams" element={<TeamsL /> } />
          <Route path="/team/:teamId" element={<TeamMatchesPage /> } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
