const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public/user')); // public 폴더 내 정적 파일 제공

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user', 'main.html')); // 기본 파일 변경
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin', 'admin.html'));
});