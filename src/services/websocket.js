class WebSocketService {
    constructor() {
        this.ws = null;
        this.onlineCountCallback = null;
    }

    connect() {
        // Используем защищенное соединение WSS
        this.ws = new WebSocket('wss://your-backend-url/ws');

        this.ws.onopen = () => {
            console.log('WebSocket соединение установлено');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'online_count') {
                this.onlineCountCallback && this.onlineCountCallback(data.count);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket соединение закрыто');
            // Пробуем переподключиться через 5 секунд
            setTimeout(() => this.connect(), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket ошибка:', error);
        };
    }

    setOnlineCountCallback(callback) {
        this.onlineCountCallback = callback;
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export const wsService = new WebSocketService(); 