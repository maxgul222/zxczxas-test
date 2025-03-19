import React, { useState } from 'react';
import MinesGame from './MinesGame';
import './MinesCard.css';

const MinesCard = () => {
  const [isGameOpen, setIsGameOpen] = useState(false);

  const handlePlayClick = () => {
    setIsGameOpen(true);
  };

  const handleCloseGame = () => {
    setIsGameOpen(false);
  };

  return (
    <>
      <div className="game-card mines-card">
        <h3>Mines</h3>
        <p>Найдите безопасные клетки и избегайте мин!</p>
        <button onClick={handlePlayClick}>Играть</button>
      </div>

      {isGameOpen && (
        <div className="game-modal">
          <div className="game-modal-content">
            <MinesGame onClose={handleCloseGame} />
          </div>
        </div>
      )}
    </>
  );
};

export default MinesCard; 