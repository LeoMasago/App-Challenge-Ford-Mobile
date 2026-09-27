import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ford_historico_buscas';
const MAX_ENTRADAS = 10;
const TTL_DIAS = 30;

function isExpirado(timestamp) {
  const limite = Date.now() - TTL_DIAS * 24 * 60 * 60 * 1000;
  return timestamp < limite;
}

export async function salvarBusca({ marca, modelo, versao, atributos }) {
  try {
    const historico = await carregarHistorico();

    const nova = {
      id: String(Date.now()),
      marca,
      modelo,
      versao,
      atributos,
      timestamp: Date.now(),
    };

    const atualizado = [nova, ...historico]
      .filter((e) => !isExpirado(e.timestamp))
      .slice(0, MAX_ENTRADAS);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
  } catch {
    // Falha silenciosa — histórico não é crítico para o funcionamento do app
  }
}

export async function carregarHistorico() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const lista = JSON.parse(raw);
    const validos = lista.filter((e) => !isExpirado(e.timestamp));

    if (validos.length !== lista.length) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validos));
    }

    return validos;
  } catch {
    return [];
  }
}

export async function limparHistorico() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Falha silenciosa
  }
}
