import React, { useState, useEffect } from 'react';
import './Casino.css';

const Casino = () => {
    const [balance, setBalance] = useState(1000);
    const [lastResult, setLastResult] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [betAmount, setBetAmount] = useState(50);

    const handleSpin = () => {
        if (balance < betAmount) {
            alert('Недостаточно средств!');
            return;
        }

        setIsSpinning(true);
        setBalance(prev => prev - betAmount);

        // Имитация вращения слотов
        setTimeout(() => {
            const symbols = ['🍎', '🍋', '🍒', '7️⃣', '💎'];
            const result = Array(3).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]);
            
            let win = 0;
            if (result[0] === result[1] && result[1] === result[2]) {
                win = symbols.indexOf(result[0]) * 100 + 200;
                setBalance(prev => prev + win);
            }

            setLastResult({
                symbols: result,
                win: win
            });
            setIsSpinning(false);
        }, 1000);
    };

    const handleDice = () => {
        if (balance < 100) {
            alert('Недостаточно средств! Минимальная ставка: 100');
            return;
        }

        setBalance(prev => prev - 100);
        
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const sum = dice1 + dice2;

        let win = 0;
        if (sum === 7 || sum === 11) {
            win = 250;
            setBalance(prev => prev + win);
        } else if (dice1 === dice2) {
            win = 150;
            setBalance(prev => prev + win);
        }

        setLastResult({
            dice: [dice1, dice2],
            sum: sum,
            win: win
        });
    };

    return (
        <div className="casino">
            <h1>🎰 Казино Telegram</h1>
            
            <div className="balance">
                Баланс: {balance} монет
            </div>

            <div className="controls">
                <div className="bet-control">
                    <label>Ставка:</label>
                    <input 
                        type="number" 
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(50, parseInt(e.target.value)))}
                        min="50"
                    />
                </div>

                <button 
                    className="spin-button" 
                    onClick={handleSpin}
                    disabled={isSpinning || balance < betAmount}
                >
                    {isSpinning ? 'Вращается...' : 'Крутить слоты'}
                </button>

                <button 
                    className="dice-button"
                    onClick={handleDice}
                    disabled={balance < 100}
                >
                    Бросить кости
                </button>
            </div>

            {lastResult && (
                <div className="result">
                    {lastResult.symbols ? (
                        <>
                            <div className="slot-result">
                                {lastResult.symbols.join(' ')}
                            </div>
                            {lastResult.win > 0 && (
                                <div className="win">Выигрыш: {lastResult.win} монет!</div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="dice-result">
                                🎲 {lastResult.dice[0]} и {lastResult.dice[1]} (сумма: {lastResult.sum})
                            </div>
                            {lastResult.win > 0 && (
                                <div className="win">Выигрыш: {lastResult.win} монет!</div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Casino; 