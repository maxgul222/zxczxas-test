import React from 'react';
import { useLocation } from 'react-router-dom';
import './GameGrid.css';
import GameCard from './GameCard';

const games = [
    {
        id: 'blackjack',
        title: 'BLACKJACK',
        description: 'Классическая карточная игра',
        backgroundColor: 'rgba(35, 35, 43, 0.95)',
        icon: '♠️',
        image: '/images/games/blackjack.png'
    },
    {
        id: 'double',
        title: 'DOUBLE',
        description: 'Европейская рулетка',
        backgroundColor: 'rgba(35, 35, 43, 0.95)',
        icon: '🎲',
        image: '/images/games/double.png'
    },
    {
        id: 'crash',
        title: 'CRASH',
        description: 'Успей забрать выигрыш',
        backgroundColor: 'rgba(35, 35, 43, 0.95)',
        icon: '📈',
        image: '/images/games/crash.png'
    },
    {
        id: 'dice',
        title: 'DICE',
        description: 'Классические кости',
        backgroundColor: 'rgba(35, 35, 43, 0.95)',
        icon: '🎲',
        image: '/images/games/dice.png'
    },
    {
        id: 'mines',
        title: 'MINES',
        description: 'Найди безопасный путь',
        backgroundColor: 'rgba(35, 35, 43, 0.95)',
        icon: '💣',
        image: '/images/games/mines.png'
    },
    {
        id: 'plinko',
        title: 'PLINKO',
        description: 'Падающий шар удачи',
        backgroundColor: 'rgba(35, 35, 43, 0.95)',
        icon: '🔵',
        image: '/images/games/plinko.png'
    },
    {
        id: 'hilo',
        title: 'HILO',
        description: 'Угадай карту',
        backgroundColor: 'rgba(35, 35, 43, 0.95)',
        icon: '🎴',
        image: '/images/games/hilo.png'
    }
];

const GameGrid = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="game-grid-container">
            <div className="grid-header">
                <h1 className="grid-title">Выберите игру</h1>
                <div className="total-players">
                    <span className="online-dot"></span>
                    Онлайн игроков: 15,423
                </div>
            </div>
            <div className="game-grid">
                {games.map((game) => (
                    <div key={game.id}>
                        <GameCard
                            gameId={game.id}
                            title={game.title}
                            description={game.description}
                            backgroundColor={game.backgroundColor}
                            icon={game.icon}
                            image={game.image}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameGrid; 