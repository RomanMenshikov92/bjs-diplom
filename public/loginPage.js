// строгий режим
'use strict';

// вход и регистрация
// создание обьект класса
const userForm = new UserForm();

// попытка авторизации
// присвоение свойству loginFormCallback на обьект data, который принимает в качестве аргумента
// обьект data - содержит логин и пароль, который будет передаваться
userForm.loginFormCallback = (data) => {
    // выполнение запроса авторизации на сервер 
    ApiConnector.login(data, (response) => {
        // проверка: если запрос успешный - обновление страницы(переход на главную страницу)
        if (response.success) {
            location.reload();
        } else {
            // иначе - выводится ошибка
            userForm.setLoginErrorMessage(response.error);
        }
        // проверка в консоли и вывод окна
        console.log(data);
        alert(JSON.stringify(data));
    });
};

// попытка регистрации
// присвоение свойству registerFormCallback на обьект data
// обьект data - содержит логин и пароль, который будет передаваться
userForm.registerFormCallback = (data) => {
    // выполнение запроса авторизации на сервер 
    ApiConnector.register(data, (response) => {
        // проверка: если запрос успешный - обновление страницы(переход на главную страницу)
        if (response.success) {
            location.reload()
        } else {
            // иначе - выводится ошибка
            userForm.setRegisterErrorMessage(response.error);
        }
        // проверка в консоли и вывод окна
        console.log(data);
        alert(JSON.stringify(data));
    });

};

// const userForm = new UserForm();
// undefined
// userForm.loginFormCallback = data => console.log(data)
// data => console.log(data)
// VM578:1 {login: 'dsadas', password: '2223e21'}
// VM578:1 {login: 'd2e2', password: 'dsadasd'}
// VM578:1 {login: 'e2', password: '22'}
// userForm.loginFormCallback = data => alert(data)
// data => alert(data)
// userForm.loginFormCallback = data => alert(JSON.stringify(data))
// data => alert(JSON.stringify(data))