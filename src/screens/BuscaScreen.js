import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TODOS_ATRIBUTOS } from '../data/atributosData';
import { FORD_BLUE, FORD_BLUE_LIGHT } from '../theme';

const IDS_PADRAO = new Set(['motor', 'potencia', 'torque', 'transmissao', 'tracao']);

export default function BuscaScreen({ navigation }) {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [versao, setVersao] = useState('');
  const [selecionados, setSelecionados] = useState(new Set(IDS_PADRAO));

  function toggleAtributo(id) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selecionarTodos() {
    setSelecionados(new Set(TODOS_ATRIBUTOS.map((a) => a.id)));
  }

  function limparSelecao() {
    setSelecionados(new Set());
  }

  function buscar() {
    if (!marca.trim() || !modelo.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha pelo menos Marca e Modelo.');
      return;
    }
    if (selecionados.size === 0) {
      Alert.alert('Atributos', 'Selecione pelo menos um atributo técnico.');
      return;
    }

    const atributosSelecionados = TODOS_ATRIBUTOS
      .filter((a) => selecionados.has(a.id))
      .map((a) => ({ id: a.id, label: a.label }));

    navigation.navigate('Resultados', {
      marca: marca.trim(),
      modelo: modelo.trim(),
      versao: versao.trim() || '',
      atributos: atributosSelecionados,
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Especificações</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>Veículo</Text>

          <Text style={styles.label}>Marca *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Toyota, Chevrolet, Ford..."
            placeholderTextColor="#AAA"
            value={marca}
            onChangeText={setMarca}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Modelo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Hilux, S10, Ranger..."
            placeholderTextColor="#AAA"
            value={modelo}
            onChangeText={setModelo}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Versão / Ano</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: GR Sport 2024, 2.8 4x4 AT 2025..."
            placeholderTextColor="#AAA"
            value={versao}
            onChangeText={setVersao}
            autoCapitalize="words"
          />

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Atributos Técnicos</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity onPress={selecionarTodos}>
                <Text style={styles.actionLink}>Todos</Text>
              </TouchableOpacity>
              <Text style={styles.actionSep}>·</Text>
              <TouchableOpacity onPress={limparSelecao}>
                <Text style={styles.actionLink}>Limpar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.hint}>
            Selecione quais dados técnicos deseja consultar ({selecionados.size} selecionados)
          </Text>

          <View style={styles.atributosGrid}>
            {TODOS_ATRIBUTOS.map((atributo) => {
              const ativo = selecionados.has(atributo.id);
              return (
                <TouchableOpacity
                  key={atributo.id}
                  style={[styles.chip, ativo && styles.chipAtivo]}
                  onPress={() => toggleAtributo(atributo.id)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={atributo.icon}
                    size={14}
                    color={ativo ? '#FFF' : FORD_BLUE}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.chipLabel, ativo && styles.chipLabelAtivo]} numberOfLines={1}>
                    {atributo.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.buscarBtn} onPress={buscar} activeOpacity={0.85}>
            <MaterialCommunityIcons name="magnify" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buscarBtnText}>Buscar Especificações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scroll: { backgroundColor: '#F4F6FA', flexGrow: 1, padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: FORD_BLUE, marginBottom: 12, marginTop: 8 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginTop: 8,
  },
  sectionActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionLink: { color: FORD_BLUE_LIGHT, fontSize: 13, fontWeight: '600' },
  actionSep: { color: '#AAA', fontSize: 13 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 4 },
  hint: { fontSize: 12, color: '#888', marginBottom: 12 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE3EE',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
    marginBottom: 14,
  },
  atributosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: FORD_BLUE,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '48%',
  },
  chipAtivo: { backgroundColor: FORD_BLUE, borderColor: FORD_BLUE },
  chipLabel: { fontSize: 12, color: FORD_BLUE, fontWeight: '500', flexShrink: 1 },
  chipLabelAtivo: { color: '#FFF' },
  buscarBtn: {
    backgroundColor: FORD_BLUE,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: FORD_BLUE,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buscarBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});
