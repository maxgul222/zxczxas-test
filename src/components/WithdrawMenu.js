import React, { useState } from 'react';
import { balanceService } from '../services/balanceService';
import './WithdrawMenu.css';

const WithdrawMenu = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [withdrawAddress, setWithdrawAddress] = useState('');

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleWithdraw = () => {
        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            alert('Пожалуйста, введите корректную сумму');
            return;
        }

        if (!withdrawAddress.trim()) {
            alert('Пожалуйста, введите адрес для вывода');
            return;
        }

        if (!balanceService.hasEnoughBalance(withdrawAmount)) {
            alert('Недостаточно средств');
            return;
        }

        balanceService.updateBalance(withdrawAmount, false);
        setAmount('');
        setWithdrawAddress('');
        onClose();
    };

    const withdrawMethods = [
        { id: 'card', name: 'Банковская карта', icon: '💳' },
        { id: 'crypto', name: 'Криптовалюта', icon: '₿' },
        { id: 'qiwi', name: 'QIWI', icon: '🥝' },
        { id: 'webmoney', name: 'WebMoney', icon: '💰' }
    ];

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content withdraw-menu">
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>Вывод средств</h2>
                    <p className="modal-subtitle">Выберите способ вывода</p>
                </div>

                <div className="payment-methods">
                    {withdrawMethods.map(method => (
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
                    <label>Сумма вывода</label>
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

                <div className="address-input-container">
                    <label>
                        {selectedMethod === 'card' ? 'Номер карты' : 
                         selectedMethod === 'crypto' ? 'Адрес кошелька' :
                         'Номер счета'}
                    </label>
                    <input
                        type="text"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        placeholder={
                            selectedMethod === 'card' ? '0000 0000 0000 0000' :
                            selectedMethod === 'crypto' ? 'Введите адрес кошелька' :
                            'Введите номер счета'
                        }
                    />
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
                    className="withdraw-submit"
                    onClick={handleWithdraw}
                    disabled={!amount || !withdrawAddress || parseFloat(amount) <= 0}
                >
                    Вывести ${amount || '0.00'}
                </button>

                <div className="withdraw-info">
                    <p>Минимальная сумма: $10</p>
                    <p>Комиссия: 0%</p>
                    <p>Время обработки: до 24 часов</p>
                </div>
            </div>
        </div>
    );
};

export default WithdrawMenu; 