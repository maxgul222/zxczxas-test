import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { balanceService } from '../services/balanceService';
import DepositMenu from './DepositMenu';
import WithdrawMenu from './WithdrawMenu';
import './TopBar.css';

const TopBar = () => {
    const [balance, setBalance] = useState(balanceService.getCurrentBalance());
    const [isDepositMenuOpen, setIsDepositMenuOpen] = useState(false);
    const [isWithdrawMenuOpen, setIsWithdrawMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = balanceService.subscribe((newBalance) => {
            setBalance(newBalance);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleOpenDepositMenu = () => {
        setIsDepositMenuOpen(true);
        setIsWithdrawMenuOpen(false);
    };

    const handleOpenWithdrawMenu = () => {
        setIsWithdrawMenuOpen(true);
        setIsDepositMenuOpen(false);
    };

    const handleCloseMenus = () => {
        setIsDepositMenuOpen(false);
        setIsWithdrawMenuOpen(false);
    };

    return (
        <>
            <div className="top-bar">
                <Link to="/" className="top-bar-logo">
                    <img src="/logo.png" alt="Logo" className="logo-image" />
                    <span className="logo-text">SHARK</span>
                </Link>

                <nav className="top-bar-nav">
                    <Link 
                        to="/games" 
                        className={`nav-link ${location.pathname === '/games' ? 'active' : ''}`}
                    >
                        Игры
                    </Link>
                    <Link 
                        to="/bonuses" 
                        className={`nav-link ${location.pathname === '/bonuses' ? 'active' : ''}`}
                    >
                        Бонусы
                    </Link>
                    <Link 
                        to="/support" 
                        className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}
                    >
                        Поддержка
                    </Link>
                </nav>

                <div className="top-bar-actions">
                    <div className="balance-container">
                        <div className="balance-display">
                            <span className="balance-label">Баланс</span>
                            <span className="balance-amount">{balance.toFixed(2)}$</span>
                        </div>
                        <div className="balance-buttons">
                            <button className="action-button withdraw" onClick={handleOpenWithdrawMenu}>
                                Вывод
                            </button>
                            <button className="action-button deposit" onClick={handleOpenDepositMenu}>
                                Депозит
                            </button>
                        </div>
                    </div>

                    <div className="user-menu">
                        <div className="user-avatar">
                            <img src="/avatar.png" alt="User" />
                        </div>
                        <span className="user-name">Player</span>
                    </div>
                </div>
            </div>

            <DepositMenu 
                isOpen={isDepositMenuOpen} 
                onClose={handleCloseMenus}
            />
            <WithdrawMenu 
                isOpen={isWithdrawMenuOpen} 
                onClose={handleCloseMenus}
            />
        </>
    );
};

export default TopBar; 