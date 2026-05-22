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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { salvarVeiculo, gerarChave } from '../firebase/vehicleService';
import { FORD_BLUE } from '../theme';

const CATEGORIAS = ['sedan', 'esportivo', 'caminhonete', 'suv'];

const ATRIBUTOS = [
  { id: 'motor', label: 'Motor' },
  { id: 'potencia', label: 'Potência' },
  { id: 'torque', label: 'Torque Máx' },
  { id: 'transmissao', label: 'Transmissão' },
  { id: 'tracao', label: 'Tração' },
  { id: 'amortecedores', label: 'Amortecedores' },
  { id: 'aceleracao', label: '0-100 km/h' },
  { id: 'modos_conducao', label: 'Modos de Condução' },
  { id: 'modos_volante', label: 'Modos de Volante' },
  { id: 'modos_escapamento', label: 'Modos de Escapamento' },
  { id: 'modos_amortecedor', label: 'Modos de Amortecedor' },
  { id: 'farois', label: 'Faróis' },
  { id: 'rodas_pneus', label: 'Rodas e Pneus' },
  { id: 'preco', label: 'Preço' },
];

function extrairSpecs(versoes) {
  const primeiraVersao = Object.keys(versoes ?? {})[0] ?? '';
  const specs = versoes?.[primeiraVersao] ?? {};
  return { versao: primeiraVersao, specs };
}

function formatarBRL(valor) {
  const digits = String(valor).replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10);
  return 'R$ ' + num.toLocaleString('pt-BR');
}

export default function AdminFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const modo = params.modo ?? 'adicionar';
  const dadosIniciais = (() => { try { return params.dados ? JSON.parse(params.dados) : null; } catch { return null; } })();

  const { versao: versaoInicial, specs: specsIniciais } = dadosIniciais
    ? extrairSpecs(dadosIniciais.versoes)
    : { versao: '', specs: {} };

  const [marca, setMarca] = useState(dadosIniciais?.marca ?? '');
  const [modelo, setModelo] = useState(dadosIniciais?.modelo ?? '');
  const [categoria, setCategoria] = useState(dadosIniciais?.categoria ?? CATEGORIAS[0]);
  const [versao, setVersao] = useState(versaoInicial);
  const [specs, setSpecs] = useState(
    Object.fromEntries(ATRIBUTOS.map((a) => [a.id, specsIniciais[a.id] ?? '']))
  );
  const [salvando, setSalvando] = useState(false);

  function setSpec(id, value) {
    setSpecs((prev) => ({ ...prev, [id]: value }));
  }

  async function salvar() {
    if (!marca.trim() || !modelo.trim() || !versao.trim()) {
      Alert.alert('Atenção', 'Preencha Marca, Modelo e Versão/Ano.');
      return;
    }

    const chave = dadosIniciais?.chave ?? gerarChave(marca.trim(), modelo.trim());

    const specsLimpas = Object.fromEntries(
      Object.entries(specs)
        .filter(([, v]) => v.trim() !== '')
        .map(([k, v]) => [k, k === 'preco' ? formatarBRL(v) : v])
    );

    const dados = {
      marca: marca.trim(),
      modelo: modelo.trim(),
      categoria,
      versoes: { [versao.trim()]: specsLimpas },
    };

    setSalvando(true);
    try {
      await salvarVeiculo(chave, dados);
      router.back();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {modo === 'editar' ? 'Editar Veículo' : 'Adicionar Veículo'}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <Text style={styles.sectionTitle}>Informações do Veículo</Text>

          <Text style={styles.label}>Marca *</Text>
          <TextInput
            style={[styles.input, modo === 'editar' && styles.inputDisabled]}
            value={marca}
            onChangeText={setMarca}
            placeholder="Ex: Ford"
            placeholderTextColor="#AAA"
            autoCapitalize="words"
            editable={modo !== 'editar'}
          />

          <Text style={styles.label}>Modelo *</Text>
          <TextInput
            style={[styles.input, modo === 'editar' && styles.inputDisabled]}
            value={modelo}
            onChangeText={setModelo}
            placeholder="Ex: Ranger Raptor"
            placeholderTextColor="#AAA"
            autoCapitalize="words"
            editable={modo !== 'editar'}
          />

          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.categoriaRow}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, categoria === cat && styles.catChipAtivo]}
                onPress={() => setCategoria(cat)}
              >
                <Text style={[styles.catChipText, categoria === cat && styles.catChipTextAtivo]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Versão / Ano *</Text>
          <TextInput
            style={styles.input}
            value={versao}
            onChangeText={setVersao}
            placeholder="Ex: 2024"
            placeholderTextColor="#AAA"
            autoCapitalize="none"
          />

          <Text style={styles.sectionTitle}>Especificações Técnicas</Text>
          <Text style={styles.hint}>Deixe em branco os campos não disponíveis para este veículo.</Text>

          {ATRIBUTOS.map((a) => (
            <View key={a.id}>
              <Text style={styles.label}>{a.label}</Text>
              <TextInput
                style={styles.input}
                value={specs[a.id]}
                onChangeText={(v) =>
                  setSpec(a.id, a.id === 'preco' ? formatarBRL(v) : v)
                }
                placeholder={a.id === 'preco' ? 'Ex: 499000' : `Ex: valor de ${a.label.toLowerCase()}`}
                placeholderTextColor="#AAA"
                autoCapitalize="none"
                keyboardType={a.id === 'preco' ? 'numeric' : 'default'}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.salvarBtn, salvando && { opacity: 0.6 }]}
            onPress={salvar}
            disabled={salvando}
            activeOpacity={0.85}
          >
            {salvando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="content-save-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.salvarBtnText}>Salvar</Text>
              </>
            )}
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
  sectionTitle: { fontSize: 14, fontWeight: '700', color: FORD_BLUE, marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 4 },
  hint: { fontSize: 12, color: '#888', marginBottom: 14 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE3EE',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#222',
    marginBottom: 10,
  },
  inputDisabled: { backgroundColor: '#EFEFEF', color: '#888' },
  categoriaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: FORD_BLUE,
    backgroundColor: '#FFF',
  },
  catChipAtivo: { backgroundColor: FORD_BLUE },
  catChipText: { fontSize: 13, fontWeight: '600', color: FORD_BLUE },
  catChipTextAtivo: { color: '#FFF' },
  salvarBtn: {
    backgroundColor: FORD_BLUE,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 6,
  },
  salvarBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
