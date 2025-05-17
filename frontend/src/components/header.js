import React from 'react';

function Header({ onNewProgressClick }) {
  return (
    <div className="header">
      <h1>Learning Progress Tracker</h1>
      <button onClick={onNewProgressClick}>Add New Progress</button>
    </div>
  );
}

export default Header;