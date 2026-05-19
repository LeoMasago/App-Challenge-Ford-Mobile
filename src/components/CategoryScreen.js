import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeHeader from './HomeHeader';
import VehicleCard from './VehicleCard';
import { VEICULOS_DATA } from '../data/veiculosData';
import { TODOS_ATRIBUTOS } from '../data/atributosData';
import { FORD_BLUE } from '../theme';

export default function CategoryScreen({ navigation, categoria, titulo, icone, tag }) {
  const veiculos = Object.values(VEICULOS_DATA).filter((v) => v.categoria === categoria);

  function abrirVeiculo(veiculo) {
    const versao = Object.keys(veiculo.versoes)[0];
    navigation.navigate('Resultados', {
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      versao,
      atributos: TODOS_ATRIBUTOS,
    });
  }

  return (
    <View style={styles.container}>
      <HomeHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.subtitle}>
          Toque em um veículo para ver as especificações completas.
        </Text>

        {veiculos.map((v) => (
          <VehicleCard
            key={`${v.marca}_${v.modelo}`}
            name={`${v.marca} ${v.modelo}`}
            description={`Versão ${Object.keys(v.versoes)[0]}`}
            icon={icone}
            tag={tag}
            onPress={() => abrirVeiculo(v)}
          />
        ))}

        <TouchableOpacity
          style={styles.buscaBtn}
          onPress={() => navigation.navigate('Busca')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="magnify" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buscaBtnText}>Busca personalizada</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: FORD_BLUE, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 18 },
  buscaBtn: {
    marginTop: 8,
    backgroundColor: FORD_BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buscaBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
