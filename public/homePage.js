// строгий режим
'use strict';

// ***домашняя страница после входа или регистрации*** //

// *выход из личного кабинета* //
// создание обьектов из классов
const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

// задаем интервал времени через 1 минуту (60000 мс) через вызов функции текущих курса валют
setInterval(receiveingCurrentExchangeRate, 60000);

logoutButton.action = () => {
    // выполнение запроса на деавторизацию
    ApiConnector.logout(response => {
        // очистка интервала
        clearInterval(interval);
        // проверка: если запрос успешный - обновление страницы(переход на страницу ввхода/регистрации)
        if (response.success) {
            location.reload();
            logoutButton.setMessage(true, 'Выход из кабинета прошло успешно');
            console.log('Выходим из личного кабинета')
        } else {
            logoutButton.setMessage(false, 'Ошибка выхода из кабинета');
        }
    });
};

// *получение информации о пользователе* //
// выполнение запроса на получение инфо о пользователе
ApiConnector.current(response => {
    // проверка: если запрос успешный - показ данных профиля
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        this.setMessage(true, 'Успешно обновлены даннные');
    } else {
        this.setMessage(false, 'Ошибка обновления данных');
    }
});

// *получение текущих курсов валюты* //
// функция выполнения запроса получение текущих курсов валют
function receiveingCurrentExchangeRate() {
    // выполнение запроса на получение курсов валют
    ApiConnector.getStocks(response => {
        // проверка: если успешно - очистка таблицы с данными и вставка новых данных (обновление)
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
            this.setMessage(true, 'Очистка и обновление данных прошла успешно');
        } else {
            this.setMessage(false, 'Ошибка очистки и обновления данных');
        }
    });
    return;
};
// вызов функции для получение текущих курсов валют
receiveingCurrentExchangeRate();

// *операции с деньгами* //

// balance
moneyManager.addMoneyCallback = ((data) => {
    // выполнение запроса на пополнение баланса
    ApiConnector.addMoney(data, (response) => {
        // проверка: если запрос успешный - успешное пополнение, иначе ошибка
        if (response.success) {
            // показ новых данных о пользователе
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Пополнение баланса прошло успешно');
        } else {
            moneyManager.setMessage(false, 'Ошибка пополнения баланса');
        }
    });
});
// conversion
moneyManager.conversionMoneyCallback = ((data) => {
    ApiConnector.convertMoney(data, (response) => {
        // проверка: если запрос успешный - успешное конвертирование, иначе ошибка
        if (response.success) {
            // показ новых данных о пользователе
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Конвертирование прошло успешно');
        } else {
            moneyManager.setMessage(false, 'Ошибка конвертирования');
        }
    });
});
// translation
moneyManager.sendMoneyCallback = ((data) => {
    ApiConnector.transferMoney(data, (response) => {
        // проверка: если запрос успешный - успешный перевод, иначе ошибка
        if (response.success) {
            // показ новых данных о пользователе
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Перевод прошел успешно');
        } else {
            moneyManager.setMessage(false, 'Ошибка перевода');
        }
    });
});

// *работа с избранным* //
// функция - очистка списка избранного, вставка полученных новых данных, добавление в списке для перевода денег
function clearFillUpdate() {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
};
// выполнение запроса на получение списка избранного
ApiConnector.getFavorites = ((response) => {
    // проверка: если запрос успешный - очистка списка избранного, вставка полученных новых данных, добавление в списке для перевода денег
    if (response.success) {
        clearFillUpdate();
        this.setMessage(true, 'Список избранных получен успешно');
    } else {
        this.setMessage(false, 'Ошибка вывода списка избранных');
    }
});

// добавление пользователя в список избранных
favoritesWidget.addUserCallback = ((data) => {
    // выполнение запроса на добавление новых пользователей
    ApiConnector.addUserToFavorites(data, (response) => {
        // проверка: если запрос успешный - очистка списка избранного, вставка полученных новых данных, добавление в списке для перевода денег
        if (response.success) {
            clearFillUpdate();
            favoritesWidget.setMessage(true, 'Пользователь успешно добавлен')
        } else {
            favoritesWidget.setMessage(false, 'Ошибка добавления пользователя')
        }
    });
});
// удаление пользователя из списка избранного
favoritesWidget.removeUserCallback = ((data) => {
    // выполнение запроса на удаление пользователей
    ApiConnector.removeUserFromFavorites(data, (response) => {
        // проверка: если запрос успешный - очистка списка избранного, вставка полученных новых данных, добавление в списке для перевода денег
        if (response.success) {
            clearFillUpdate();
            favoritesWidget.setMessage(true, 'Пользователь успешно удален')
        } else {
            favoritesWidget.setMessage(false, 'Ошибка удаления пользователя')
        }
    });
});

