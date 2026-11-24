const { ObjectId } = require('mongodb');
const { conectarBanco } = require('../config/db');
async function col() { return (await conectarBanco()).collection('topicos'); }

async function listarTopicos(busca, categoria) {
  const filtro = {};
  if (busca) {
    filtro.$or = [
      { titulo: { $regex: busca, $options: 'i' } },
      { conteudo: { $regex: busca, $options: 'i' } }
    ];
  }
  if (categoria && categoria !== 'Todas') filtro.categoria = categoria;
  return (await col()).find(filtro).sort({ _id: -1 }).toArray();
}

async function buscarPorId(id) {
  if (!ObjectId.isValid(id)) return null;
  return (await col()).findOne({ _id: new ObjectId(id) });
}

async function criarTopico(dados) {
  return (await col()).insertOne({ ...dados, comentarios: [], data: new Date().toLocaleDateString('pt-BR') });
}

async function atualizarTopico(id, dados) {
  if (!ObjectId.isValid(id)) return null;
  return (await col()).updateOne({ _id: new ObjectId(id) }, { $set: { titulo: dados.titulo, categoria: dados.categoria, conteudo: dados.conteudo } });
}

async function excluirTopico(id) {
  if (!ObjectId.isValid(id)) return null;
  return (await col()).deleteOne({ _id: new ObjectId(id) });
}

async function adicionarComentario(topicoId, comentario) {
  if (!ObjectId.isValid(topicoId)) return null;
  return (await col()).updateOne({ _id: new ObjectId(topicoId) }, { $push: { comentarios: comentario } });
}

module.exports = { listarTopicos, buscarPorId, criarTopico, atualizarTopico, excluirTopico, adicionarComentario };
