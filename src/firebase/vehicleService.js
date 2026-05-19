import { ref, get, set } from 'firebase/database';
import { db } from './config';
import { VEICULOS_DATA } from '../data/veiculosData';

function normalizar(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function chaveVeiculo(marca, modelo) {
  return `${normalizar(marca)}_${normalizar(modelo)}`;
}

export async function seedIfEmpty() {
  const snapshot = await get(ref(db, 'veiculos'));
  if (snapshot.exists()) return;
  await set(ref(db, 'veiculos'), VEICULOS_DATA);
}

export async function buscarEspecificacoes(marca, modelo, versao, atributos) {
  const snapshot = await get(ref(db, 'veiculos'));

  if (!snapshot.exists()) {
    throw new Error('Base de dados vazia. Tente novamente.');
  }

  const todos = snapshot.val();
  const chaveBuscada = chaveVeiculo(marca, modelo);

  let dadosVeiculo = todos[chaveBuscada];

  if (!dadosVeiculo) {
    const marcaNorm = normalizar(marca);
    const modeloNorm = normalizar(modelo);

    const entrada = Object.entries(todos).find(([, v]) => {
      return (
        normalizar(v.marca) === marcaNorm &&
        normalizar(v.modelo).includes(modeloNorm)
      );
    });

    dadosVeiculo = entrada?.[1] ?? null;
  }

  if (!dadosVeiculo) {
    return null;
  }

  const versoes = dadosVeiculo.versoes ?? {};
  const chaveVersao =
    Object.keys(versoes).find((v) => v === versao.trim()) ??
    Object.keys(versoes).find((v) => v.includes(versao.trim())) ??
    Object.keys(versoes)[0];

  const specs = versoes[chaveVersao] ?? {};

  const especificacoes = atributos.map(({ id, label }) => {
    const valor = specs[id];
    return {
      atributo: label,
      valor: valor ?? 'Não disponível',
      disponivel: valor != null,
    };
  });

  return {
    veiculo: {
      marca: dadosVeiculo.marca,
      modelo: dadosVeiculo.modelo,
      versao: chaveVersao,
    },
    especificacoes,
  };
}
