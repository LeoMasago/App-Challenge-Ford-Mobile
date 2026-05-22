import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { buscarTodosVeiculos, excluirVeiculo } from '../firebase/vehicleService';
import { FORD_BLUE } from '../theme';

const CATEGORIA_ICON = {
  sedan: 'car',
  esportivo: 'car-sports',
  caminhonete: 'car-pickup',
  suv: 'car-SUV',
};

export default function AdminScreen() {
  const router = useRouter();
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    try {
      const lista = await buscarTodosVeiculos();
      lista.sort((a, b) => `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`));
      setVeiculos(lista);
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(useCallback(() => { carregar(); }, []));

  function confirmarExclusao(veiculo) {
    Alert.alert(
      'Excluir veículo',
      `Deseja excluir "${veiculo.marca} ${veiculo.modelo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await excluirVeiculo(veiculo.chave);
            carregar();
          },
        },
      ]
    );
  }

  function editarVeiculo(veiculo) {
    router.push({
      pathname: '/admin-form',
      params: { modo: 'editar', dados: JSON.stringify(veiculo) },
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Administração</Text>
        <View style={{ width: 26 }} />
      </View>

      {carregando ? (
        <View style={styles.centralized}>
          <ActivityIndicator size="large" color={FORD_BLUE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.count}>{veiculos.length} veículo{veiculos.length !== 1 ? 's' : ''} cadastrado{veiculos.length !== 1 ? 's' : ''}</Text>

          {veiculos.map((v) => (
            <View key={v.chave} style={styles.card}>
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons
                  name={CATEGORIA_ICON[v.categoria] ?? 'car'}
                  size={26}
                  color={FORD_BLUE}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNome}>{v.marca} {v.modelo}</Text>
                <Text style={styles.cardSub}>
                  {v.categoria} · {Object.keys(v.versoes ?? {}).join(', ')}
                </Text>
              </View>
              <TouchableOpacity style={styles.iconBtn} onPress={() => editarVeiculo(v)}>
                <MaterialCommunityIcons name="pencil-outline" size={22} color={FORD_BLUE} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => confirmarExclusao(v)}>
                <MaterialCommunityIcons name="trash-can-outline" size={22} color="#CC0000" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push({ pathname: '/admin-form', params: { modo: 'adicionar' } })}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.addBtnText}>Adicionar Veículo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FORD_BLUE },
  header: {
    backgroundColor: FORD_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
  },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
  centralized: { flex: 1, backgroundColor: '#F4F6FA', alignItems: 'center', justifyContent: 'center' },
  scroll: { backgroundColor: '#F4F6FA', flexGrow: 1, padding: 16, paddingBottom: 24 },
  count: { fontSize: 12, color: '#888', marginBottom: 14, fontWeight: '500' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  iconBtn: { padding: 8 },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF4',
    elevation: 6,
  },
  addBtn: {
    backgroundColor: FORD_BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
