const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
app.use(cors());
// 使用body-parser中间件来解析JSON格式的请求体
app.use(bodyParser.json());

// 创建MySQL数据库连接池
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root', // 替换为你的MySQL用户名
    password: 'pfl170086', // 替换为你的MySQL密码
    database: 'test' ,// 替换为你的数据库名称
});


// 定义一个路由来处理前端发送的POST请求
app.post('/api/contact', async (req, res) => {
    const { name, phone, email, address } = req.body;

    // 数据验证
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: '所有字段都是必填项' });
    }

    try {
        // 准备SQL查询语句，用于插入数据
        const query = 'INSERT INTO contacts SET ?';
        const values = {
            name,
			phone,
            email,
            address
        };

        // 执行SQL查询
        await pool.query(query, values);

        // 返回成功响应
        res.status(201).json({ message: 'Contact information submitted successfully!' });
    } catch (error) {
        // 如果有错误发生，返回错误信息
        res.status(500).json({ message: error.message });
    }
});

// 获取所有联系人信息
app.get('/api/contacts', (req, res) => {
    const query = 'SELECT * FROM contacts';
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(200).json(results);
    });
});

// 更新联系人信息
app.put('/api/contact/:id', (req, res) => {
    const { name, phone, email, address } = req.body;
    const id = req.params.id;

    const query = 'UPDATE contacts SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?';
    pool.query(query, [name, phone, email, address, id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(200).json({ message: 'Contact updated successfully' });
    });
});

// 删除联系人信息
app.delete('/api/contact/:id', (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM contacts WHERE id = ?';
    pool.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    });
});

// 设置服务器监听的端口
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});