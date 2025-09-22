const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

//기본 스플래쉬 화면
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'splash.html'));
});

// 메인 페이지 관련 경로는 모두 main.html로 응답
app.get(['/main*', '/report*', '/users*'], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'main.html'));
});

app.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'login-page.html'));
});

app.get('/email-exists', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'email-exists.html'));
});

app.get('/survey', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'survey.html'));
});

app.get('/signup-complete', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'signup-complete.html'));
});

app.get('/signup/terms-privacy', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'terms-privacy.html'));
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

app.get('/admin/food-management/recommend', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/food-management/add', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get([
    '/admin/notice',
    '/admin/notice/add',
    '/admin/notice/:id(\\d+)',
], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get([
    '/admin/admin-management',
    '/admin/admin-management/add',
    '/admin/admin-management/:id(\\d+)',
    '/admin/admin-management/trainer',
    '/admin/admin-management/trainer/add',
    '/admin/admin-management/trainer/:id(\\d+)',
    '/admin/admin-management/gym',
    '/admin/admin-management/gym/add',
    '/admin/admin-management/gym/:id(\\d+)',
], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


app.get([
    '/admin/food-management/:id(\\d+)',
    '/admin/food-management/user-regist/:id(\\d+)',
    '/admin/food-management/recommend/:id(\\d+)',
  ], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
  });

  // admin 스플래쉬 화면
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'splash.html'));
});