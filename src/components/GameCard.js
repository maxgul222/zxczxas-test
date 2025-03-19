import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import './GameCard.css';
import MinesGame from '../games/mines/MinesGame';

const GameCard = ({ gameId, title, backgroundColor, image }) => {
    const [activePlayers, setActivePlayers] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isGameOpen, setIsGameOpen] = useState(false);
    const history = useHistory();

    // Функция для форматирования числа с разделителями
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Имитация получения данных о количестве игроков
    const fetchActivePlayers = useCallback(() => {
        const mockServerCall = () => {
            const baseCount = {
                'blackjack': [800, 1500],
                'double': [1500, 2500],
                'crash': [2500, 3500],
                'dice': [2000, 3000],
                'mines': [3500, 4500],
                'plinko': [1000, 2000],
                'hilo': [1000, 1800]
            };

            const range = baseCount[gameId] || [0, 0];
            const randomCount = Math.floor(Math.random() * (range[1] - range[0])) + range[0];
            
            // Добавляем 5% шанс, что игра будет без игроков
            return Math.random() < 0.05 ? 0 : randomCount;
        };

        setActivePlayers(mockServerCall());
    }, [gameId]);

    useEffect(() => {
        fetchActivePlayers();
        const interval = setInterval(fetchActivePlayers, 10000);
        return () => clearInterval(interval);
    }, [fetchActivePlayers]);

    const handlePlayClick = () => {
        if (gameId === 'mines') {
            setIsGameOpen(true);
            history.push('/games/mines');
        }
    };

    const handleCloseGame = () => {
        setIsGameOpen(false);
        history.push('/games');
    };

    return (
        <>
            <div className="game-card" style={{ background: backgroundColor }}>
                <div className={`game-image ${imageLoaded ? 'loaded' : ''}`}>
                    <img 
                        src={image} 
                        alt={title}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
                <div className="game-card-content">
                    <button className="play-button" onClick={handlePlayClick}>
                        ИГРАТЬ
                        <div className="button-shine"></div>
                    </button>
                    <div className="game-players">
                        <span className={`online-dot ${activePlayers === 0 ? 'offline' : ''}`}></span>
                        <span className="player-count">
                            Онлайн: {formatNumber(activePlayers)}
                        </span>
                    </div>
                </div>
            </div>

            {isGameOpen && gameId === 'mines' && (
                <div className="game-modal">
                    <div className="game-modal-content">
                        <MinesGame onClose={handleCloseGame} />
                    </div>
                </div>
            )}
        </>
    );
};

export default GameCard; 