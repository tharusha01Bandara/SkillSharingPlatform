import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserProvider } from '../common/UserContext';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

import Home from '../components/Home';

import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="app-body">
            <Navigation />
            <main className="main-content">
              <Switch>
                <Route exact path="/" component={<Home />} />
        
     
              </Switch>
            </main>
          </div>

        </div>
      </Router>
    </UserProvider>
  );
}

export default App;