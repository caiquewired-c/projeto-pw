const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const greetings = {
  'pt-br': 'Olá',
  'es': 'Hola',
  'en': 'Hello'
};

// ==========================================
// ROTAS DA V1
// ==========================================
app.get('/v1/hi', (req, res) => {
  res.status(200).json({ msg: "Hello, world!" });
});

app.get('/v1/hi/user/:name', (req, res) => {
  res.status(200).json({ msg: `Hello, ${req.params.name}` });
});

app.post('/v1/hi', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(200).json({ msg: `Hello, ${name.toUpperCase()} from POST!` });
});

// ==========================================
// ROTAS DA V2 (Exercício 2: pt-br, es, en)
// ==========================================
app.get('/v2/hi/:lang', (req, res) => {
  const lang = req.params.lang.toLowerCase();
  const greeting = greetings[lang];

  if (!greeting) {
    return res.status(400).json({ error: "Idioma não suportado. Use: pt-br, es ou en" });
  }

  res.status(200).json({ msg: `${greeting}, mundo!` });
});

app.get('/v2/hi/:lang/user/:name', (req, res) => {
  const lang = req.params.lang.toLowerCase();
  const name = req.params.name;
  const greeting = greetings[lang];

  if (!greeting) {
    return res.status(400).json({ error: "Idioma não suportado. Use: pt-br, es ou en" });
  }

  res.status(200).json({ msg: `${greeting}, ${name}!` });
});

app.post('/v2/hi', (req, res) => {
  const { name, lang } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const selectedLang = (lang || 'en').toLowerCase();
  const greeting = greetings[selectedLang];

  if (!greeting) {
    return res.status(400).json({ error: "Idioma não suportado. Use: pt-br, es ou en" });
  }

  res.status(200).json({ msg: `${greeting}, ${name.toUpperCase()} (v2 POST)!` });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: "Invalid endpoint" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
