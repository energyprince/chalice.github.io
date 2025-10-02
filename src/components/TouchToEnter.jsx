import React from 'react';
import './TouchToEnter.css';

const TouchToEnter = ({ onEnter }) => {
  const handleActivate = (e) => {
    e.preventDefault();
    if (onEnter) onEnter();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleActivate(e);
    }
  };

  return (
    <div className="touch-to-enter-wrapper">
      <button
        type="button"
        className="touch-to-enter-btn"
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        aria-label="Touch to enter"
      >
        Touch to Enter
      </button>
    </div>
  );
};

export default TouchToEnter;

