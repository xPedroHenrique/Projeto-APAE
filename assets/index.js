const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'apae_tijucas',
    password: process.env.DB_PASSWORD || 'ph2910',
    port: process.env.DB_PORT || 5432,
});

app.get('/', (req, res) => {
    res.send('API da APAE Tijucas está funcionando.');
});

app.post('/doacoes', async(req, res) => {
    const { nome, valor, tipo } = req.body;

    if (!nome || !valor || !tipo) {
        return res.status(400).json({ erro: 'Campos obrigatórios: nome, valor, tipo.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO doacoes (nome, valor, tipo) VALUES ($1, $2, $3) RETURNING *', [nome, valor, tipo]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao registrar doação:', err);
        res.status(500).json({ erro: 'Erro ao registrar doação.' });
    }
});

app.get('/doacoes', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM doacoes ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar doações.' });
    }
});

app.post('/usuarios', async(req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING id, email', [email, senhaCriptografada]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
    }
});

app.post('/login', async(req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1', [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        }

        const usuario = result.rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }

        res.status(200).json({ mensagem: 'Login realizado com sucesso!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao realizar login.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});