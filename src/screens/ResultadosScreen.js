import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarEspecificacoes } from '../firebase/vehicleService';
import { salvarBusca } from '../services/historyService';
import { buscarPrecoFipe } from '../services/fipeService';
import { FORD_BLUE } from '../theme';

const VERDE = '#1A7A3C';
const CINZA = '#888';

export default function ResultadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const marca = params.marca ?? '';
  const modelo = params.modelo ?? '';
  const versao = params.versao ?? '';
  const atributos = (() => { try { return params.atributos ? JSON.parse(params.atributos) : []; } catch { return []; } })();

  const [resultado, setResultado] = useState(null);
  const [fipe, setFipe] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [dados, dadosFipe] = await Promise.all([
          buscarEspecificacoes(marca, modelo, versao, atributos),
          buscarPrecoFipe(marca, modelo, versao),
        ]);
        if (!dados) {
          setErro(`Veículo "${marca} ${modelo}" não encontrado na base de dados.`);
        } else {
          setResultado(dados);
          setFipe(dadosFipe);
          salvarBusca({ marca, modelo, versao, atributos }).catch(() => {});
        }
      } catch (e) {
        setErro(e.message ?? 'Erro ao consultar os dados.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const disponiveis = resultado?.especificacoes.filter((e) => e.disponivel).length ?? 0;
  const total = resultado?.especificacoes.length ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Especificações Técnicas</Text>
        <View style={{ width: 26 }} />
      </View>

      {carregando ? (
        <View style={styles.centralized}>
          <ActivityIndicator size="large" color={FORD_BLUE} />
          <Text style={styles.loadingText}>Consultando base de dados...</Text>
        </View>
      ) : erro ? (
        <View style={styles.centralized}>
          <MaterialCommunityIcons name="car-off" size={60} color="#DDE3EE" />
          <Text style={styles.erroTitulo}>Veículo não encontrado</Text>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.voltarBtn} onPress={() => router.back()}>
            <Text style={styles.voltarBtnText}>Voltar e refinar a busca</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.vehicleCard}>
            <MaterialCommunityIcons name="car-info" size={34} color={FORD_BLUE} />
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={styles.vehicleName}>
                {resultado.veiculo.marca} {resultado.veiculo.modelo}
              </Text>
              <Text style={styles.vehicleVersion}>Versão / Ano: {resultado.veiculo.versao}</Text>
            </View>
          </View>

          {fipe ? (
            <View style={styles.fipeCard}>
              <View style={styles.fipeHeader}>
                <MaterialCommunityIcons name="web" size={14} color="#1A5FA8" />
                <Text style={styles.fipeHeaderText}>Preço FIPE · Tabela {fipe.mesReferencia}</Text>
              </View>
              <Text style={styles.fipeValor}>{fipe.valor}</Text>
              <Text style={styles.fipeSub}>
                {fipe.modeloFipe} · {fipe.anoModelo} · {fipe.combustivel}
              </Text>
              <Text style={styles.fipeCodigo}>Cód. FIPE: {fipe.codigoFipe}</Text>
              {!fipe.anoExato && fipe.anoSolicitado && (
                <View style={styles.fipeAviso}>
                  <MaterialCommunityIcons name="information-outline" size={12} color="#8A6400" />
                  <Text style={styles.fipeAvisoText}>
                    Ano {fipe.anoSolicitado} não encontrado na FIPE.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.fipeIndisponivel}>
              <MaterialCommunityIcons name="web-off" size={14} color="#AAA" />
              <Text style={styles.fipeIndisponivelText}>Tabela FIPE temporariamente indisponível</Text>
            </View>
          )}

          <View style={styles.resumoRow}>
            <View style={styles.resumoBadge}>
              <MaterialCommunityIcons name="check-circle" size={15} color={VERDE} />
              <Text style={[styles.resumoText, { color: VERDE }]}>
                {disponiveis} disponíveis
              </Text>
            </View>
            <View style={styles.resumoBadge}>
              <MaterialCommunityIcons name="minus-circle" size={15} color={CINZA} />
              <Text style={[styles.resumoText, { color: CINZA }]}>
                {total - disponiveis} não disponíveis
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Especificações</Text>

          {resultado.especificacoes.map((spec, i) => (
            <View key={i} style={styles.specRow}>
              <View style={styles.specLabelCol}>
                <Text style={styles.specLabel}>{spec.atributo}</Text>
              </View>
              <View style={styles.specValueCol}>
                {spec.disponivel ? (
                  <Text style={styles.specValue}>{spec.valor}</Text>
                ) : (
                  <View style={styles.ndBadge}>
                    <Text style={styles.ndText}>Não disponível</Text>
                  </View>
                )}
              </View>
            </View>
          ))}

          <View style={styles.rodape}>
            <MaterialCommunityIcons name="database-outline" size={14} color="#AAA" />
            <Text style={styles.rodapeText}>
              Dados provenientes da base interna. Verifique com o fabricante para confirmação oficial.
            </Text>
          </View>
        </ScrollView>
      )}
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
  centralized: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: { marginTop: 16, fontSize: 14, color: '#888' },
  erroTitulo: { fontSize: 18, fontWeight: '700', color: FORD_BLUE, marginTop: 16, textAlign: 'center' },
  erroTexto: { fontSize: 13, color: '#888', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  voltarBtn: {
    marginTop: 24,
    backgroundColor: FORD_BLUE,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  voltarBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  scroll: { backgroundColor: '#F4F6FA', flexGrow: 1, padding: 20, paddingBottom: 40 },
  vehicleCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  vehicleName: { fontSize: 18, fontWeight: '700', color: FORD_BLUE },
  vehicleVersion: { fontSize: 13, color: '#888', marginTop: 3 },
  fipeCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C5D8F5',
  },
  fipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  fipeHeaderText: { fontSize: 11, fontWeight: '700', color: '#1A5FA8', letterSpacing: 0.3, textTransform: 'uppercase' },
  fipeValor: { fontSize: 22, fontWeight: '800', color: FORD_BLUE, marginBottom: 2 },
  fipeSub: { fontSize: 12, color: '#555', marginBottom: 2 },
  fipeCodigo: { fontSize: 11, color: '#999' },
  fipeAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fipeAvisoText: { fontSize: 11, color: '#8A6400', flex: 1 },
  fipeIndisponivel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  fipeIndisponivelText: { fontSize: 12, color: '#AAA' },
  resumoRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  resumoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  resumoText: { fontSize: 12, fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FORD_BLUE,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  specRow: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  specLabelCol: { flex: 1, marginRight: 10 },
  specLabel: { fontSize: 13, color: '#555', fontWeight: '600' },
  specValueCol: { flex: 1.4, alignItems: 'flex-end' },
  specValue: { fontSize: 13, color: '#1A1A1A', fontWeight: '500', textAlign: 'right' },
  ndBadge: { backgroundColor: '#F0F0F0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  ndText: { fontSize: 11, color: '#999', fontWeight: '500' },
  rodape: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  rodapeText: { flex: 1, fontSize: 11, color: '#BBB', lineHeight: 16 },
});
