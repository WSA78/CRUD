const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

let users = [];

// Criar um novo usuário (POST)
app.post('/api/users', (req, res) => {
    const { name, email, address, phone, username, password } = req.body;
    if (!name || !email || !address || !phone || !username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }
    const user = { id: users.length + 1, name, email, address, phone, username, password };
    users.push(user);
    res.status(201).json(user);
});

// Obter todos os usuários (GET)
app.get('/api/users', (req, res) => {
    const sanitizedUsers = users.map(({ id, name, email, address, phone, username }) => ({
        id, name, email, address, phone, username
    }));
    res.status(200).json(sanitizedUsers); // Não retorna a senha
});

// Obter um único usuário (GET by ID)
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id == id);
    if (user) {
        const { password, ...userWithoutPassword } = user; // Remove a senha da resposta
        res.status(200).json(userWithoutPassword);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado!' });
    }
});

// Atualizar um usuário (PUT)
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, address, phone, username, password } = req.body;

    if (!name || !email || !address || !phone || !username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const user = users.find(u => u.id == id);

    if (user) {
        user.name = name;
        user.email = email;
        user.address = address;
        user.phone = phone;
        user.username = username;
        user.password = password;
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado!' });
    }
});

// Excluir um usuário (DELETE)
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id == id);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).json({ message: 'Usuário excluído com sucesso!' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado!' });
    }
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
