import { ref, get, set, remove } from 'firebase/database';
import { db } from './config';

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

export function gerarChave(marca, modelo) {
  return chaveVeiculo(marca, modelo);
}

export async function salvarVeiculo(chave, dados) {
  await set(ref(db, `veiculos/${chave}`), dados);
}

export async function excluirVeiculo(chave) {
  await remove(ref(db, `veiculos/${chave}`));
}

export async function buscarTodosVeiculos() {
  const snapshot = await get(ref(db, 'veiculos'));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([chave, dados]) => ({ chave, ...dados }));
}

export async function buscarVeiculosPorCategoria(categoria) {
  const snapshot = await get(ref(db, 'veiculos'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val()).filter((v) => v.categoria === categoria);
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
