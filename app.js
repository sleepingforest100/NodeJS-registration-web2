const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'registration_and_login',
  password: 'pgadmin4',
  port: 5432,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));

// Роут для корневого пути
app.get('/', (req, res) => {
  res.send('Добро пожаловать на главную страницу!');
});

// Роут для обработки формы входа

// Роут для отображения страницы входа
app.get('/login', (req, res) => {
    const loginPath = path.join(__dirname, './views/login.html');
    res.sendFile(loginPath);
  });

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Ищем пользователя в базе данных по имени пользователя
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
      // Сравниваем введенный пароль с хешированным паролем в базе данных
      const match = await bcrypt.compare(password, result.rows[0].password);

      if (match) {
        // Устанавливаем сессию для успешного входа
        req.session.loggedIn = true;
        req.session.username = username;
        res.send('Вход прошел успешно!');
      } else {
        res.send('Неверный пароль');
      }
    } else {
      res.send('Пользователь не найден');
    }
  } catch (error) {
    console.error(error);
    res.send('Ошибка при входе');
  }
});


app.get('/register', (req, res) => {
    const registrationPath = path.join(__dirname, './views/register.html');
    res.sendFile(registrationPath);
  });

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const usernameIsValid = isValidUsername(username);
  const emailIsValid = isValidEmail(email);
  const passwordIsValid = isValidPassword(password);

 //Validation
 if (!usernameIsValid.valid || !emailIsValid.valid || !passwordIsValid.valid) {
  const errorMessages = []; 

 if(!usernameIsValid.valid) {
  return res.send(`Недопустимое имя пользователя: ${usernameIsValid.message}`);
}

if(!emailIsValid.valid) {
  return res.send(`Недопустимый адрес электронной почты: ${emailIsValid.message}`);
}

if(!passwordIsValid.valid) {
  return res.send(`Недопустимый пароль: ${passwordIsValid.message}`);
}

 // Send the error messages back to the client
 return res.status(400).send(errorMessages.join('\n'));
 
 }

  try {
    // Проверка на существующее имя пользователя или адрес электронной почты
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

    if (userExists.rows.length > 0) {
      res.send('Пользователь с таким именем пользователя или адресом электронной почты уже существует');
    } else {

      // Хеширование пароля перед сохранением в базу данных
      const hashedPassword = await bcrypt.hash(password, 10);

      // Сохранение данных в базу данных
      await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

      res.send('Регистрация успешна');
    }
  } catch (error) {
    console.error(error);
    res.send('Ошибка при регистрации');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

function isValidUsername(username) {
 const isValid = /^[a-zA-Z0-9_]+$/.test(username) && username.length >= 4 && username.length <= 20;
 return { valid: isValid, message: isValid ? 'OK' : 'Имя пользователя должно содержать от 4 до 20 символов, используйте только буквы, цифры и подчеркивание'};
}

function isValidEmail(email) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return { valid: isValid, message: isValid ? 'OK' : 'Неверный формат адреса электронной почты'};

}
function isValidPassword(password) {
  const isValid = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
  return { valid: isValid, message: isValid ? 'OK' : 'Пароль должен содержать минимум 8 символов, хотя бы одну строчную и заглавную букву, и цифру'};

}