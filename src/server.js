const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'main.html'));
});

app.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'login-page.html'));
});

app.get('/survey', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'survey.html'));
});

app.get('/signup-complete', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'signup-complete.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'loginPage.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/user-management', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/user-management/pt', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/user-management/user/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/user-management/pt/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/user-management/pt/:id/user/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/food-management', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/food-management/user-regist', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/food-management/recommend-food', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/food-management/add-food', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/notice', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/admin-management', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/admin-management/trainer', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/admin-management/gym', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


app.get([
  '/admin/food-management/recommend-food',
  '/admin/food-management/:type(cooked|ingredient|processed|custom)/:id(\\d+)',
  '/admin/food-management/user-regist/:type(cooked|ingredient|processed|custom)/:id(\\d+)',
  '/admin/food-management/recommend-food/:type(cooked|ingredient|processed|custom)/:id(\\d+)',
], (req, res) => {
  res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});
