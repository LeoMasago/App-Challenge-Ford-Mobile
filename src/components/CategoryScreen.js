import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HomeHeader from './HomeHeader';
import VehicleCard from './VehicleCard';
import { buscarVeiculosPorCategoria } from '../firebase/vehicleService';
import { TODOS_ATRIBUTOS } from '../data/atributosData';
import { FORD_BLUE } from '../theme';

export default function CategoryScreen({ categoria, titulo, icone, tag }) {
  const router = useRouter();
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setErro(null);
    setCarregando(true);
    buscarVeiculosPorCategoria(categoria)
      .then(setVeiculos)
      .catch(() => setErro('Não foi possível carregar os veículos. Verifique sua conexão.'))
      .finally(() => setCarregando(false));
  }, [categoria]);

  function abrirVeiculo(veiculo) {
    const versao = Object.keys(veiculo.versoes)[0];
    router.push({
      pathname: '/resultados',
      params: {
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        versao,
        atributos: JSON.stringify(TODOS_ATRIBUTOS),
      },
    });
  }

  return (
    <View style={styles.container}>
      <HomeHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.subtitle}>
          Toque em um veículo para ver as especificações completas.
        </Text>

        {carregando ? (
          <ActivityIndicator size="large" color={FORD_BLUE} style={{ marginTop: 40 }} />
        ) : erro ? (
          <View style={styles.erroContainer}>
            <MaterialCommunityIcons name="wifi-off" size={40} color="#DDE3EE" />
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        ) : veiculos.map((v) => (
          <VehicleCard
            key={`${v.marca}_${v.modelo}`}
            name={`${v.marca} ${v.modelo}`}
            description={`Versão ${Object.keys(v.versoes)[0]}`}
            icon={icone}
            tag={tag}
            onPress={() => abrirVeiculo(v)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buscaBtn}
          onPress={() => router.push('/busca')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="magnify" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buscaBtnText}>Busca personalizada</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { padding: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: FORD_BLUE, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 18 },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF4',
    shadowColor: '#003478',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 6,
  },
  buscaBtn: {
    backgroundColor: FORD_BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buscaBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  erroContainer: { alignItems: 'center', marginTop: 48, paddingHorizontal: 24 },
  erroTexto: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 12, lineHeight: 20 },
});
