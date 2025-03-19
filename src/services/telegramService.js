// Получение параметров из URL при открытии веб-приложения в Telegram
const getTelegramUser = () => {
    try {
        // Получаем параметры из URL
        const urlParams = new URLSearchParams(window.location.search);
        const initData = urlParams.get('tgWebAppData');
        
        if (!initData) {
            console.warn('Telegram WebApp data not found');
            return null;
        }

        // Декодируем параметры
        const params = new URLSearchParams(decodeURIComponent(initData));
        
        return {
            id: params.get('user_id'),
            username: params.get('username'),
            firstName: params.get('first_name'),
            lastName: params.get('last_name'),
            photoUrl: params.get('photo_url')
        };
    } catch (error) {
        console.error('Error parsing Telegram user data:', error);
        return null;
    }
};

// Получение текущего пользователя или создание тестового
export const getCurrentTelegramUser = () => {
    const user = getTelegramUser();
    
    if (user && user.id) {
        return user;
    }
    
    // Если приложение открыто не в Telegram, используем тестовый ID
    const testUser = {
        id: localStorage.getItem('testTelegramId') || 'test_' + Math.random().toString(36).substr(2, 9),
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User',
        photoUrl: null
    };
    
    // Сохраняем тестовый ID, чтобы он сохранялся между сессиями
    localStorage.setItem('testTelegramId', testUser.id);
    
    return testUser;
}; 