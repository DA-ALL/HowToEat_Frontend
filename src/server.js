const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user', 'main.html'));
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

app.get('/admin/food-management', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/report', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/notice', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});

app.get('/admin/admin-management', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/administrate', 'main.html'));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});