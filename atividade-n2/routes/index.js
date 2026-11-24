const express = require('express');
const router = express.Router();
const topicoDao = require('../dao/topicoDao');
const { verificarLogin } = require('../middlewares/auth');

router.get('/', async (req, res) => {
  const busca = req.query.busca || '';
  const categoria = req.query.categoria || 'Todas';
  const topicos = await topicoDao.listarTopicos(busca, categoria);
  res.render('index', { topicos, busca, categoria });
});

router.get('/topicos/novo', verificarLogin, (req, res) => res.render('form-topico', { topico: null, erro: null }));
router.post('/topicos/novo', verificarLogin, async (req, res) => {
  const { titulo, categoria, conteudo } = req.body;
  if (!titulo || !conteudo) return res.render('form-topico', { topico: null, erro: 'Preencha titulo e conteudo.' });
  await topicoDao.criarTopico({ titulo, categoria, conteudo, autorNome: req.session.usuario.nome, autorId: req.session.usuario.id });
  res.redirect('/');
});

router.get('/topicos/:id', async (req, res) => {
  const topico = await topicoDao.buscarPorId(req.params.id);
  if (!topico) return res.redirect('/');
  res.render('topico', { topico });
});

router.post('/topicos/:id/comentar', verificarLogin, async (req, res) => {
  if (req.body.texto && req.body.texto.trim()) {
    await topicoDao.adicionarComentario(req.params.id, { autor: req.session.usuario.nome, texto: req.body.texto.trim(), data: new Date().toLocaleDateString('pt-BR') });
  }
  res.redirect(`/topicos/${req.params.id}`);
});

router.get('/topicos/:id/editar', verificarLogin, async (req, res) => {
  const topico = await topicoDao.buscarPorId(req.params.id);
  if (!topico || topico.autorId !== req.session.usuario.id) return res.redirect('/');
  res.render('form-topico', { topico, erro: null });
});

router.post('/topicos/:id/editar', verificarLogin, async (req, res) => {
  const topico = await topicoDao.buscarPorId(req.params.id);
  if (!topico || topico.autorId !== req.session.usuario.id) return res.redirect('/');
  await topicoDao.atualizarTopico(req.params.id, req.body);
  res.redirect(`/topicos/${req.params.id}`);
});

router.post('/topicos/:id/excluir', verificarLogin, async (req, res) => {
  const topico = await topicoDao.buscarPorId(req.params.id);
  if (topico && topico.autorId === req.session.usuario.id) await topicoDao.excluirTopico(req.params.id);
  res.redirect('/');
});

module.exports = router;
