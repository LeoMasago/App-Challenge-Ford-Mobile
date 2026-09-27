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
import { useRouter } from 'expo-router';
import { TODOS_ATRIBUTOS } from '../data/atributosData';
import { FORD_BLUE, FORD_BLUE_LIGHT } from '../theme';

const IDS_PADRAO = new Set(['motor', 'potencia', 'torque', 'transmissao', 'tracao', 'amortecedores', 'aceleracao']);

function VeiculoInputs({ titulo, numero, marca, setMarca, modelo, setModelo, versao, setVersao }) {
  return (
    <View style={styles.veiculoBox}>
      <View style={styles.veiculoBoxHeader}>
        <View style={styles.numeroBadge}>
          <Text style={styles.numeroBadgeText}>{numero}</Text>
        </View>
        <Text style={styles.veiculoBoxTitulo}>{titulo}</Text>
      </View>

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
        placeholder="Ex: 2024, GR Sport..."
        placeholderTextColor="#AAA"
        value={versao}
        onChangeText={setVersao}
        autoCapitalize="none"
      />
    </View>
  );
}

export default function BuscaScreen() {
  const router = useRouter();
  const [modo, setModo] = useState('individual');

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [versao, setVersao] = useState('');

  const [marca2, setMarca2] = useState('');
  const [modelo2, setModelo2] = useState('');
  const [versao2, setVersao2] = useState('');

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

    router.push({
      pathname: '/resultados',
      params: {
        marca: marca.trim(),
        modelo: modelo.trim(),
        versao: versao.trim() || '',
        atributos: JSON.stringify(atributosSelecionados),
      },
    });
  }

  function comparar() {
    if (!marca.trim() || !modelo.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha Marca e Modelo do Veículo 1.');
      return;
    }
    if (!marca2.trim() || !modelo2.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha Marca e Modelo do Veículo 2.');
      return;
    }
    if (selecionados.size === 0) {
      Alert.alert('Atributos', 'Selecione pelo menos um atributo técnico.');
      return;
    }

    const atributosSelecionados = TODOS_ATRIBUTOS
      .filter((a) => selecionados.has(a.id))
      .map((a) => ({ id: a.id, label: a.label }));

    router.push({
      pathname: '/comparacao',
      params: {
        veiculos: JSON.stringify([
          { marca: marca.trim(), modelo: modelo.trim(), versao: versao.trim() || '' },
          { marca: marca2.trim(), modelo: modelo2.trim(), versao: versao2.trim() || '' },
        ]),
        atributos: JSON.stringify(atributosSelecionados),
      },
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Especificações</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.modoToggle}>
            <TouchableOpacity
              style={[styles.modoBtn, modo === 'individual' && styles.modoBtnAtivo]}
              onPress={() => setModo('individual')}
            >
              <MaterialCommunityIcons name="car" size={15} color={modo === 'individual' ? '#FFF' : FORD_BLUE} style={{ marginRight: 6 }} />
              <Text style={[styles.modoBtnText, modo === 'individual' && styles.modoBtnTextAtivo]}>Individual</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modoBtn, modo === 'comparar' && styles.modoBtnAtivo]}
              onPress={() => setModo('comparar')}
            >
              <MaterialCommunityIcons name="car-multiple" size={15} color={modo === 'comparar' ? '#FFF' : FORD_BLUE} style={{ marginRight: 6 }} />
              <Text style={[styles.modoBtnText, modo === 'comparar' && styles.modoBtnTextAtivo]}>Comparar</Text>
            </TouchableOpacity>
          </View>

          {modo === 'individual' ? (
            <>
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
                autoCapitalize="none"
              />
            </>
          ) : (
            <>
              <VeiculoInputs
                titulo="Veículo 1"
                numero="1"
                marca={marca}
                setMarca={setMarca}
                modelo={modelo}
                setModelo={setModelo}
                versao={versao}
                setVersao={setVersao}
              />
              <VeiculoInputs
                titulo="Veículo 2"
                numero="2"
                marca={marca2}
                setMarca={setMarca2}
                modelo={modelo2}
                setModelo={setModelo2}
                versao={versao2}
                setVersao={setVersao2}
              />
            </>
          )}

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

          {modo === 'individual' ? (
            <TouchableOpacity style={styles.buscarBtn} onPress={buscar} activeOpacity={0.85}>
              <MaterialCommunityIcons name="magnify" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.buscarBtnText}>Buscar Especificações</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.compararBtn} onPress={comparar} activeOpacity={0.85}>
              <MaterialCommunityIcons name="compare" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.buscarBtnText}>Comparar Veículos</Text>
            </TouchableOpacity>
          )}
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
  modoToggle: {
    flexDirection: 'row',
    backgroundColor: '#E8EDF5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },
  modoBtnAtivo: { backgroundColor: FORD_BLUE },
  modoBtnText: { fontSize: 14, fontWeight: '600', color: FORD_BLUE },
  modoBtnTextAtivo: { color: '#FFF' },
  veiculoBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DDE3EE',
  },
  veiculoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  numeroBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: FORD_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  numeroBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: FORD_BLUE, marginBottom: 12, marginTop: 4 },
  veiculoBoxTitulo: { fontSize: 15, fontWeight: '700', color: FORD_BLUE },
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
    backgroundColor: '#F4F6FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE3EE',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
    marginBottom: 10,
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
  compararBtn: {
    backgroundColor: '#1A5FA8',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A5FA8',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buscarBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});
