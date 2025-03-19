import React, { useState } from 'react';
import { balanceService } from '../services/balanceService';
import './DepositMenu.css';

const DepositMenu = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('card');

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleDeposit = () => {
        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount < 10) {
            alert('Минимальная сумма депозита: $10');
            return;
        }

        balanceService.updateBalance(depositAmount, true);
        setAmount('');
        onClose();
    };

    const paymentMethods = [
        { id: 'card', name: 'Банковская карта', icon: '💳' },
        { id: 'crypto', name: 'Криптовалюта', icon: '₿' },
        { id: 'qiwi', name: 'QIWI', icon: '🥝' },
        { id: 'webmoney', name: 'WebMoney', icon: '💰' }
    ];

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content deposit-menu">
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>Пополнение баланса</h2>
                    <p className="modal-subtitle">Выберите способ оплаты</p>
                </div>

                <div className="payment-methods">
                    {paymentMethods.map(method => (
                        <button
                            key={method.id}
                            className={`payment-method ${selectedMethod === method.id ? 'active' : ''}`}
                            onClick={() => setSelectedMethod(method.id)}
                        >
                            <span className="payment-icon">{method.icon}</span>
                            <span className="payment-name">{method.name}</span>
                        </button>
                    ))}
                </div>

                <div className="amount-input-container">
                    <label>Сумма депозита</label>
                    <div className="amount-input">
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                        />
                        <span className="currency">$</span>
                    </div>
                </div>

                <div className="quick-amounts">
                    {[10, 50, 100, 500].map(value => (
                        <button
                            key={value}
                            className="quick-amount"
                            onClick={() => setAmount(value.toString())}
                        >
                            ${value}
                        </button>
                    ))}
                </div>

                <button 
                    className="deposit-submit"
                    onClick={handleDeposit}
                    disabled={!amount || parseFloat(amount) < 10}
                >
                    Пополнить ${amount || '0.00'}
                </button>

                <div className="deposit-info">
                    <p>Минимальная сумма: $10</p>
                    <p>Комиссия: 0%</p>
                    <p>Зачисление: мгновенно</p>
                </div>
            </div>
        </div>
    );
};

export default DepositMenu; 