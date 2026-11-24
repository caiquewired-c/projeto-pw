const express = require('express');
const router = express.Router();
const topicoDao = require('../dao/topicoDao');
router.get('/topicos', async (req, res) => res.json(await topicoDao.listarTopicos()));
module.exports = router;
