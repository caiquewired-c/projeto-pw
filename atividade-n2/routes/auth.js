const express = require('express');
const router = express.Router();
const usuarioDao = require('../dao/usuarioDao');

router.get('/login', (req, res) => res.render('login', { erro: null }));
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await usuarioDao.buscarPorEmail(email);
  if (!usuario || usuario.senha !== senha) return res.render('login', { erro: 'Email ou senha incorretos.' });
  req.session.usuario = { id: usuario._id.toString(), nome: usuario.nome, email: usuario.email };
  res.redirect('/');
});

router.get('/cadastro', (req, res) => res.render('cadastro', { erro: null }));
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.render('cadastro', { erro: 'Preencha todos os campos.' });
  if (await usuarioDao.buscarPorEmail(email)) return res.render('cadastro', { erro: 'Esse email ja esta cadastrado.' });
  await usuarioDao.criarUsuario({ nome, email, senha });
  res.redirect('/login');
});

router.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });
module.exports = router;
