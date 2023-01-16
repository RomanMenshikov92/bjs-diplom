// строгий режим
'use strict';

// ***домашняя страница после входа или регистрации*** //

// *выход из личного кабинета* //
// создание обьект класса
const logoutButton = new LogoutButton();

logoutButton.action = () => {
    // выполнение запроса на деавторизацию
    ApiConnector.logout(response => {
        // проверка: если запрос успешный - обновление страницы(переход на страницу ввхода/регистрации)
        if (response.success) {
            location.reload();
            console.log('Выходим из личного кабинета')
        }
    });
};

// *получение информации о пользователе* //
// выполнение запроса на получение инфо о пользователе
ApiConnector.current(response => {
    // проверка: если запрос успешный - показ данных профиля
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// *получение текущих курсов валюты* //
// создание обьекта класса
const ratesBoard = new RatesBoard();

// функция выполнения запроса получение текущих курсов валют
function receiveingCurrentExchangeRate() {
    // выполнение запроса на получение курсов валют
    ApiConnector.getStocks(response => {
        // проверка: если успешно - очистка таблицы с данными и вставка новых данных (обновление)
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data)
        }
    });
    return;
};
// вызов функции для получение текущих курсов валют
receiveingCurrentExchangeRate();
// задаем интервал времени через 1 минуту (60000 мс) через вызов функции текущих курса валют
setInterval(receiveingCurrentExchangeRate, 60000);


// *операции с деньгами* //
const moneyManager = new MoneyManager();
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
// создание обьекта класса
const favoritesWidget = new FavoritesWidget();

// выполнение запроса на получение списка избранного
ApiConnector.getFavorites = ((response) => {
    // проверка: если запрос успешный - очистка списка избранного, вставка полученных новых данных, добавление в списке для перевода денег
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

// добавление пользователя в список избранных
favoritesWidget.addUserCallback = ((data) => {
    // выполнение запроса на добавление новых пользователей
    ApiConnector.addUserToFavorites(data, (response) => {
        // проверка: если запрос успешный - очистка списка избранного, вставка полученных новых данных, добавление в списке для перевода денег
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
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
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь успешно удален')
        } else {
            favoritesWidget.setMessage(false, 'Ошибка удаления пользователя')
        }
    });
});

