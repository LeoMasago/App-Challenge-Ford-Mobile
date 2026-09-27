import { ref, get, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './config';

const MIGRADO_KEY = '@ford_precos_migrados_v1';

function normalizarPreco(valor) {
  const digits = String(valor).replace(/\D/g, '');
  if (!digits) return valor;
  const num = parseInt(digits, 10);
  return 'R$ ' + num.toLocaleString('pt-BR');
}

export async function migrarPrecos() {
  try {
    const jaFeito = await AsyncStorage.getItem(MIGRADO_KEY);
    if (jaFeito) return;
  } catch {}

  const snapshot = await get(ref(db, 'veiculos'));
  if (!snapshot.exists()) return;

  const veiculos = snapshot.val();
  const updates = {};

  for (const [chave, veiculo] of Object.entries(veiculos)) {
    for (const [versao, specs] of Object.entries(veiculo.versoes ?? {})) {
      if (specs.preco) {
        const normalizado = normalizarPreco(specs.preco);
        if (normalizado !== specs.preco) {
          updates[`veiculos/${chave}/versoes/${versao}/preco`] = normalizado;
        }
      }
    }
  }

  const total = Object.keys(updates).length;
  if (total > 0) {
    for (const [path, valor] of Object.entries(updates)) {
      await set(ref(db, path), valor);
    }
  }

  AsyncStorage.setItem(MIGRADO_KEY, '1').catch(() => {});
}
