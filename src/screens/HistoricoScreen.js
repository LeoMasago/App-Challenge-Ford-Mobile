import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeHeader from '../components/HomeHeader';
import { carregarHistorico, limparHistorico } from '../services/historyService';

const FORD_BLUE = '#003478';

function formatarData(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function HistoricoScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarHistorico().then(setHistorico);
    }, [])
  );

  function repetirBusca(item) {
    navigation.navigate('Resultados', {
      marca: item.marca,
      modelo: item.modelo,
      versao: item.versao,
      atributos: item.atributos,
    });
  }

  function confirmarLimpeza() {
    Alert.alert(
      'Limpar histórico',
      'Deseja remover todas as buscas anteriores?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await limparHistorico();
            setHistorico([]);
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <HomeHeader navigation={navigation} />

      <View style={styles.titleRow}>
        <Text style={styles.title}>Histórico</Text>
        {historico.length > 0 && (
          <TouchableOpacity onPress={confirmarLimpeza}>
            <Text style={styles.limparLink}>Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {historico.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="history" size={64} color="#DDE3EE" />
          <Text style={styles.emptyTitle}>Nenhuma busca ainda</Text>
          <Text style={styles.emptySubtitle}>
            Suas pesquisas de especificações aparecerão aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => repetirBusca(item)}
              activeOpacity={0.75}
            >
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons name="car-search" size={22} color={FORD_BLUE} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>
                  {item.marca} {item.modelo}
                </Text>
                <Text style={styles.cardSub}>
                  {item.versao || 'Versão não especificada'} · {item.atributos.length} atributo{item.atributos.length !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.cardDate}>{formatarData(item.timestamp)}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.rodape}>
        <MaterialCommunityIcons name="information-outline" size={13} color="#CCC" />
        <Text style={styles.rodapeText}>
          Máximo de 10 buscas · Expiram após 30 dias
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: FORD_BLUE,
  },
  limparLink: {
    fontSize: 13,
    color: '#CC0000',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: FORD_BLUE,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#F4F6FA',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8EDF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: FORD_BLUE,
  },
  cardSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardDate: {
    fontSize: 11,
    color: '#BBB',
    marginTop: 3,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 16,
  },
  rodapeText: {
    fontSize: 11,
    color: '#CCC',
  },
});
