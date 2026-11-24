const { conectarBanco } = require('../config/db');
async function col() { return (await conectarBanco()).collection('usuarios'); }
async function buscarPorEmail(email) { return (await col()).findOne({ email }); }
async function criarUsuario(dados) {
  const res = await (await col()).insertOne(dados);
  return { _id: res.insertedId, ...dados };
}
module.exports = { buscarPorEmail, criarUsuario };
