import { getCurrentTelegramUser } from './telegramService';

const BALANCE_KEY_PREFIX = 'tgBalance_';
const DEFAULT_BALANCE = '1000.00000000';

class BalanceService {
    constructor() {
        this.balance = parseFloat(localStorage.getItem('balance')) || 0;
        this.subscribers = new Set();
    }

    // Получение ключа для хранения баланса конкретного пользователя
    getBalanceKey() {
        const user = getCurrentTelegramUser();
        return `${BALANCE_KEY_PREFIX}${user.id}`;
    }

    // Загрузка баланса пользователя
    loadBalance() {
        const balanceKey = this.getBalanceKey();
        const savedBalance = localStorage.getItem(balanceKey);
        if (!savedBalance) {
            this.saveBalance(DEFAULT_BALANCE);
            return DEFAULT_BALANCE;
        }
        return savedBalance;
    }

    // Сохранение баланса пользователя
    saveBalance(newBalance) {
        const balanceKey = this.getBalanceKey();
        localStorage.setItem(balanceKey, newBalance);
        this.balance = parseFloat(newBalance);
        this.notifySubscribers();
        return newBalance;
    }

    // Обновление баланса (пополнение или списание)
    updateBalance(amount, isAdd = true) {
        if (isAdd) {
            this.balance += parseFloat(amount);
        } else {
            this.balance -= parseFloat(amount);
        }
        localStorage.setItem('balance', this.balance.toString());
        this.notifySubscribers();
    }

    // Проверка достаточности средств
    hasEnoughBalance(amount) {
        return this.balance >= amount;
    }

    // Подписка на изменения баланса
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    // Уведомление всех подписчиков
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.balance));
    }

    // Получение текущего баланса
    getCurrentBalance() {
        return this.balance;
    }

    getBalance() {
        return this.balance;
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }
}

// Создаем единственный экземпляр сервиса
export const balanceService = new BalanceService(); 