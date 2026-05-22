import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'https://parallelum.com.br/fipe/api/v1/carros';
const TIMEOUT_MS = 8000;
const CACHE_KEY_MARCAS = '@fipe_marcas';
const CACHE_KEY_MODELOS = '@fipe_modelos_v2';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

function norm(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function extrairAno(versao) {
  const match = String(versao).match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchComTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchComRetry(url, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    if (i > 0) await delay(i * 2000);
    try {
      const res = await fetchComTimeout(url);
      if (res.ok) return res;
      if (res.status !== 429) return res; // erro definitivo, não tentar novamente
    } catch (e) {
      if (i === tentativas - 1) throw e;
    }
  }
  return null;
}

let _marcasMemoria = null;
const _modelosMemoria = {};

async function getMarcas() {
  if (_marcasMemoria) return _marcasMemoria;

  let cacheStale = null;
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY_MARCAS);
    if (raw) {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL_MS) {
        _marcasMemoria = data;
        return _marcasMemoria;
      }
      cacheStale = data;
    }
  } catch {}

  try {
    const res = await fetchComRetry(`${BASE}/marcas`);
    if (!res?.ok) throw new Error(`marcas HTTP ${res?.status}`);
    const data = await res.json();
    _marcasMemoria = data;
    AsyncStorage.setItem(CACHE_KEY_MARCAS, JSON.stringify({ ts: Date.now(), data })).catch(() => {});
    return _marcasMemoria;
  } catch (e) {
    if (cacheStale) {
      _marcasMemoria = cacheStale;
      return _marcasMemoria;
    }
    throw e;
  }
}

async function getModelosDaMarca(codigoMarca) {
  if (_modelosMemoria[codigoMarca]) return _modelosMemoria[codigoMarca];

  try {
    const cacheKey = `${CACHE_KEY_MODELOS}_${codigoMarca}`;
    const raw = await AsyncStorage.getItem(cacheKey);
    if (raw) {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL_MS) {
        _modelosMemoria[codigoMarca] = data;
        return data;
      }
    }
  } catch {}

  const res = await fetchComRetry(`${BASE}/marcas/${codigoMarca}/modelos`);
  if (!res?.ok) return null;
  const { modelos } = await res.json();
  if (!Array.isArray(modelos)) return null;

  _modelosMemoria[codigoMarca] = modelos;
  const cacheKey = `${CACHE_KEY_MODELOS}_${codigoMarca}`;
  AsyncStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: modelos })).catch(() => {});
  return modelos;
}

async function buscarCodigoMarca(nomeMarca) {
  try {
    const marcas = await getMarcas();
    const nomeNorm = norm(nomeMarca);
    const encontrada = marcas.find((m) => norm(m.nome).includes(nomeNorm) || nomeNorm.includes(norm(m.nome))) ?? null;
    if (!encontrada) console.warn('[FIPE] marca ausente na lista:', nomeMarca);
    return encontrada;
  } catch (e) {
    console.warn('[FIPE] getMarcas erro:', e?.message ?? e);
    return null;
  }
}

function anoMaisRecenteNum(anos) {
  const reais = anos.filter((a) => parseInt(a.nome) < 32000);
  const lista = reais.length ? reais : anos;
  return Math.max(...lista.map((a) => parseInt(a.nome) || 0));
}

function anoMaisRecenteDaLista(anos) {
  const reais = anos.filter((a) => parseInt(a.nome) < 32000);
  const lista = reais.length ? reais : anos;
  return lista
    .map((a) => ({ ...a, anoNum: parseInt(a.nome) || 0 }))
    .sort((a, b) => b.anoNum - a.anoNum)[0] ?? anos[0];
}

async function buscarAnosDoModelo(codigoMarca, codigoModelo) {
  try {
    const res = await fetchComRetry(
      `${BASE}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`
    );
    if (!res?.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function buscarModeloComAno(codigoMarca, nomeModelo, anoDesejado) {
  const modelos = await getModelosDaMarca(codigoMarca);
  if (!modelos) return null;

  const palavras = norm(nomeModelo).split(' ').filter((p) => p.length > 1);
  if (!palavras.length) return null;

  const candidatos = modelos
    .map((m) => {
      const mNorm = norm(m.nome);
      const score = palavras.filter((p) => mNorm.includes(p)).length;
      return { ...m, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || parseInt(b.codigo) - parseInt(a.codigo));

  if (!candidatos.length) return null;

  let melhorComAnoExato = null;
  let melhorPorAnoRecente = null;
  let maiorAno = -1;

  for (const candidato of candidatos.slice(0, 5)) {
    const anos = await buscarAnosDoModelo(codigoMarca, candidato.codigo);
    if (!anos.length) continue;

    if (anoDesejado && anos.some((a) => a.nome.startsWith(anoDesejado))) {
      melhorComAnoExato = { candidato, anos };
      break;
    }

    const anoRecente = anoMaisRecenteNum(anos);
    if (anoRecente > maiorAno) {
      maiorAno = anoRecente;
      melhorPorAnoRecente = { candidato, anos };
    }
  }

  return melhorComAnoExato ?? melhorPorAnoRecente ?? null;
}

function escolherAno(anos, anoDesejado) {
  if (anoDesejado) {
    const match = anos.find((a) => a.nome.startsWith(anoDesejado));
    if (match) return match;
  }
  return anoMaisRecenteDaLista(anos);
}

export async function buscarPrecoFipe(marca, modelo, versao = '') {
  try {
    const anoDesejado = extrairAno(versao);

    const marcaFipe = await buscarCodigoMarca(marca);
    if (!marcaFipe) { console.warn('[FIPE] marca não encontrada:', marca); return null; }

    const resultado = await buscarModeloComAno(marcaFipe.codigo, modelo, anoDesejado);
    if (!resultado) { console.warn('[FIPE] modelo não encontrado:', modelo); return null; }

    const { candidato: modeloFipe, anos } = resultado;
    if (!anos.length) { console.warn('[FIPE] sem anos para:', modeloFipe.nome); return null; }

    const anoSelecionado = escolherAno(anos, anoDesejado);

    const precoRes = await fetchComRetry(
      `${BASE}/marcas/${marcaFipe.codigo}/modelos/${modeloFipe.codigo}/anos/${anoSelecionado.codigo}`
    );
    if (!precoRes?.ok) { console.warn('[FIPE] preço HTTP:', precoRes?.status); return null; }
    const preco = await precoRes.json();

    return {
      valor: preco.Valor,
      anoModelo: preco.AnoModelo,
      combustivel: preco.Combustivel,
      codigoFipe: preco.CodigoFipe,
      mesReferencia: preco.MesReferencia,
      modeloFipe: modeloFipe.nome,
      anoSolicitado: anoDesejado ? parseInt(anoDesejado) : null,
      anoExato: anoDesejado ? String(preco.AnoModelo) === anoDesejado : true,
    };
  } catch (e) {
    console.warn('[FIPE]', e?.message ?? e);
    return null;
  }
}
