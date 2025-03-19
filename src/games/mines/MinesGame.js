import React, { useState, useEffect, useCallback } from 'react';
import { balanceService } from '../../services/balanceService';
import './MinesGame.css';

const MinesGame = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState(0);
  const [selectedMines, setSelectedMines] = useState(3);
  const [gameState, setGameState] = useState({
    isActive: false,
    board: Array(25).fill({ revealed: false, isMine: false, exploded: false }),
    minePositions: [],
    multiplier: 1,
  });
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastRevealedCell, setLastRevealedCell] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [potentialWin, setPotentialWin] = useState('0.00');
  const [canCashout, setCanCashout] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [explodedMine, setExplodedMine] = useState(null);

  const handleWin = useCallback((winAmount) => {
    if (winAmount > 0) {
      balanceService.updateBalance(winAmount, true);
    }
  }, []);

  const calculateMultiplier = (mines, revealed) => {
    const fairMultiplier = (25 / (25 - mines)) * 0.97;
    return Number(fairMultiplier.toFixed(2));
  };

  const handleBetAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBetAmount(value);
    }
  };

  const handleHalfBet = () => {
    setBetAmount(prev => Math.max(0, prev / 2));
  };

  const handleDoubleBet = () => {
    setBetAmount(prev => prev * 2);
  };

  const handleMinesChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedMines(value);
  };

  const placeMines = () => {
    const positions = new Set();
    while (positions.size < selectedMines) {
      positions.add(Math.floor(Math.random() * 25));
    }
    return Array.from(positions);
  };

  const resetGame = () => {
    setGameState({
      isActive: false,
      board: Array(25).fill({ revealed: false, isMine: false, exploded: false }),
      minePositions: [],
      multiplier: 1,
    });
    setGameStarted(false);
    setGameOver(false);
    setWin(false);
    setRevealed(0);
    setCanCashout(false);
    setPotentialWin('0.00');
    setShowResult(false);
    setExplodedMine(null);
    setLastRevealedCell(null);
  };

  const startGame = () => {
    if (betAmount <= 0) return;
    
    if (!balanceService.hasEnoughBalance(betAmount)) {
      alert('Недостаточно средств');
      return;
    }
    
    balanceService.updateBalance(betAmount, false);
    
    const minePositions = placeMines();
    setGameState({
      isActive: true,
      board: Array(25).fill({ revealed: false, isMine: false, exploded: false }),
      minePositions,
      multiplier: 1,
    });
    setGameStarted(true);
    setGameOver(false);
    setWin(false);
    setRevealed(0);
    setCanCashout(false);
    setPotentialWin(betAmount.toFixed(2));
    setShowResult(false);
    setExplodedMine(null);
  };

  const handleCashout = () => {
    if (!gameStarted || gameOver || win || !canCashout) return;
    
    const winAmount = parseFloat(potentialWin);
    setWin(true);
    handleWin(winAmount);
    
    // Показываем все мины с задержкой
    const newBoard = [...gameState.board];
    gameState.minePositions.forEach((pos, index) => {
      setTimeout(() => {
        newBoard[pos] = { revealed: true, isMine: true, exploded: false };
        setGameState(prev => ({
          ...prev,
          board: [...newBoard],
        }));
      }, index * 100);
    });

    setGameState(prev => ({
      ...prev,
      isActive: false,
    }));

    setTimeout(() => {
      setShowResult(true);
    }, gameState.minePositions.length * 100 + 300);
  };

  const handleCellClick = (index) => {
    if (!gameState.isActive || gameState.board[index].revealed) return;

    const isMine = gameState.minePositions.includes(index);
    const newBoard = [...gameState.board];

    if (isMine) {
      // Помечаем взорвавшуюся мину
      setExplodedMine(index);
      newBoard[index] = { revealed: true, isMine: true, exploded: true };
      
      // Показываем остальные мины с задержкой
      gameState.minePositions.forEach((pos, i) => {
        if (pos !== index) {
          setTimeout(() => {
            newBoard[pos] = { revealed: true, isMine: true, exploded: false };
            setGameState(prev => ({
              ...prev,
              board: [...newBoard],
            }));
          }, i * 100);
        }
      });
      
      setGameState(prev => ({
        ...prev,
        isActive: false,
        board: newBoard,
      }));
      
      setTimeout(() => {
        setGameOver(true);
        setShowResult(true);
      }, gameState.minePositions.length * 100 + 300);
    } else {
      newBoard[index] = { revealed: true, isMine: false, exploded: false };
      const revealedCount = newBoard.filter(cell => cell.revealed).length;
      const newMultiplier = calculateMultiplier(selectedMines, revealedCount);
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        multiplier: newMultiplier,
      }));
      setRevealed(revealedCount);
      setCanCashout(true);
      setPotentialWin((betAmount * newMultiplier).toFixed(2));
      setLastRevealedCell(index);
      
      if (revealedCount + selectedMines === 25) {
        handleCashout();
      }
    }
  };

  const handleBackToMenu = () => {
    if (gameStarted && !gameOver && !win) {
      if (window.confirm('Вы уверены? Текущая игра будет отменена')) {
        resetGame();
        window.location.href = '/games';
      }
    } else {
      resetGame();
      window.location.href = '/games';
    }
  };

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  return (
    <div className="mines-game">
      <div className="mines-controls">
        <div className="controls-header">
          <button 
            className="back-button"
            onClick={handleBackToMenu}
          >
            ← Вернуться
          </button>
          {gameStarted && (
            <div className="potential-win">
              Возможный выигрыш: <span>{Number(potentialWin).toFixed(2)}$</span>
            </div>
          )}
        </div>
        
        <div className="bet-controls">
          <div className="bet-amount">
            <span>Сумма ставки</span>
            <div className="bet-input-container">
              <input
                type="number"
                value={betAmount}
                onChange={handleBetAmountChange}
                min="0"
                step="0.01"
                disabled={gameStarted}
              />
              <span className="currency">$</span>
              <div className="bet-buttons">
                <button 
                  className="half-bet" 
                  onClick={handleHalfBet}
                  disabled={gameStarted}
                >
                  ½
                </button>
                <button 
                  className="double-bet" 
                  onClick={handleDoubleBet}
                  disabled={gameStarted}
                >
                  2×
                </button>
              </div>
            </div>
          </div>
          <div className="mines-selector">
            <span>Mines</span>
            <select 
              value={selectedMines} 
              onChange={handleMinesChange}
              disabled={gameStarted}
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        <button 
          className="bet-button"
          onClick={gameStarted ? handleCashout : startGame}
          disabled={betAmount <= 0 || (gameStarted && !canCashout)}
        >
          {gameStarted ? `Забрать ${Number(potentialWin).toFixed(2)}$` : 'Ставка'}
        </button>
      </div>
      
      <div className="mines-board">
        {gameState.board.map((cell, index) => (
          <div
            key={index}
            className={`mines-cell 
              ${cell.revealed ? (cell.isMine ? 'mine' : 'safe') : ''} 
              ${cell.exploded ? 'explode' : ''} 
              ${!gameState.isActive && !cell.revealed ? 'disabled' : ''}
            `}
            onClick={() => handleCellClick(index)}
          >
            {cell.revealed && (cell.isMine ? '💣' : '💎')}
          </div>
        ))}

        {showResult && (
          <div className="game-result-overlay">
            <div className="result-container">
              <div className="result-icon">
                {win ? '🎉' : '💥'}
              </div>
              <div className="result-title">
                {win ? 'Победа!' : 'Игра окончена!'}
              </div>
              <div className={`result-amount ${win ? 'win' : 'loss'}`}>
                {win ? `+${Number(potentialWin).toFixed(2)}$` : `-${Number(betAmount).toFixed(2)}$`}
              </div>
              <div className="result-stats">
                <div className="stat-row">
                  <span className="stat-label">Открыто клеток</span>
                  <span className="stat-value">{revealed}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Множитель</span>
                  <span className="stat-value">x{gameState.multiplier.toFixed(2)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Мин</span>
                  <span className="stat-value">{selectedMines}</span>
                </div>
              </div>
              <div className="result-buttons">
                <button className="result-button" onClick={startGame}>
                  Играть снова
                </button>
                <button className="result-button secondary" onClick={resetGame}>
                  Изменить ставку
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="game-stats">
        <div className="stat-block">
          <div className="stat-block-label">Открыто</div>
          <div className={`stat-block-value ${gameStarted ? 'active' : 'inactive'}`}>
            {revealed}
          </div>
        </div>
        <div className="stat-block">
          <div className="stat-block-label">Множитель</div>
          <div className={`stat-block-value ${gameStarted ? 'active' : 'inactive'}`}>
            {gameStarted ? `${gameState.multiplier.toFixed(2)}x` : '1.00x'}
          </div>
        </div>
        <div className="stat-block">
          <div className="stat-block-label">Мин</div>
          <div className={`stat-block-value ${gameStarted ? 'active' : 'inactive'}`}>
            {selectedMines}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinesGame; 