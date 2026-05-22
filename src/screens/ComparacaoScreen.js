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
import { buscarPrecoFipe } from '../services/fipeService';
import { notificarComparacaoRealizada } from '../services/notificacaoService';
import { FORD_BLUE } from '../theme';

const VERDE_BG = '#E6F4EC';
const VERDE_TEXT = '#1A6B3A';
const AMARELO_BG = '#FFF8E1';
const AMARELO_TEXT = '#8A6400';
const CINZA_BG = '#F2F2F2';
const CINZA_TEXT = '#888';

export default function ComparacaoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const veiculos = (() => { try { return params.veiculos ? JSON.parse(params.veiculos) : []; } catch { return []; } })();
  const atributos = (() => { try { return params.atributos ? JSON.parse(params.atributos) : []; } catch { return []; } })();

  const [resultados, setResultados] = useState(null);
  const [precosFipe, setPrecosFipe] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [dados, fipes] = await Promise.all([
          Promise.all(veiculos.map((v) => buscarEspecificacoes(v.marca, v.modelo, v.versao, atributos))),
          Promise.all(veiculos.map((v) => buscarPrecoFipe(v.marca, v.modelo, v.versao))),
        ]);
        const naoEncontrado = dados.findIndex((d) => d === null);
        if (naoEncontrado !== -1) {
          const v = veiculos[naoEncontrado];
          setErro(`Veículo "${v.marca} ${v.modelo}" não encontrado na base de dados.`);
          return;
        }
        setResultados(dados);
        setPrecosFipe(fipes);
        notificarComparacaoRealizada(
          `${dados[0].veiculo.marca} ${dados[0].veiculo.modelo}`,
          `${dados[1].veiculo.marca} ${dados[1].veiculo.modelo}`
        ).catch(() => {});
      } catch (e) {
        setErro(e.message ?? 'Erro ao consultar os dados.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comparação Técnica</Text>
        <View style={{ width: 26 }} />
      </View>

      {carregando ? (
        <View style={styles.centralized}>
          <ActivityIndicator size="large" color={FORD_BLUE} />
          <Text style={styles.loadingText}>Comparando veículos...</Text>
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
        <ScrollView stickyHeaderIndices={[0]} contentContainerStyle={styles.scroll}>

          {/* Cabeçalho fixo com os veículos */}
          <View style={styles.veiculosHeader}>
            <View style={styles.atributoHeaderCol} />
            {resultados.map((r, idx) => (
              <View key={idx} style={[styles.veiculoCol, idx === 0 && styles.refCol]}>
                {idx === 0 ? (
                  <View style={styles.refBadge}>
                    <MaterialCommunityIcons name="star" size={10} color={FORD_BLUE} />
                    <Text style={styles.refBadgeText}>REFERÊNCIA</Text>
                  </View>
                ) : (
                  <View style={styles.concorrenteBadge}>
                    <Text style={styles.concorrenteBadgeText}>CONCORRENTE</Text>
                  </View>
                )}
                <Text style={[styles.veiculoMarca, idx === 0 && styles.refMarca]}>
                  {r.veiculo.marca}
                </Text>
                <Text style={[styles.veiculoModelo, idx === 0 && styles.refModelo]}>
                  {r.veiculo.modelo}
                </Text>
                <Text style={styles.veiculoVersao}>{r.veiculo.versao}</Text>
              </View>
            ))}
          </View>

          {/* Legenda */}
          <View style={styles.legendaContainer}>
            <Text style={styles.legendaTitulo}>Legenda:</Text>
            <View style={styles.legendaPills}>
              <View style={[styles.legendaPill, { backgroundColor: VERDE_BG }]}>
                <View style={[styles.legendaDot, { backgroundColor: VERDE_TEXT }]} />
                <Text style={[styles.legendaLabel, { color: VERDE_TEXT }]}>Igual</Text>
              </View>
              <View style={[styles.legendaPill, { backgroundColor: AMARELO_BG }]}>
                <View style={[styles.legendaDot, { backgroundColor: AMARELO_TEXT }]} />
                <Text style={[styles.legendaLabel, { color: AMARELO_TEXT }]}>Diferente</Text>
              </View>
              <View style={[styles.legendaPill, { backgroundColor: CINZA_BG }]}>
                <View style={[styles.legendaDot, { backgroundColor: CINZA_TEXT }]} />
                <Text style={[styles.legendaLabel, { color: CINZA_TEXT }]}>N/D</Text>
              </View>
            </View>
          </View>

          {/* Linha de preço FIPE */}
          {precosFipe.some((f) => f !== null) && (
            <View style={styles.fipeRow}>
              <View style={styles.atributoCol}>
                <View style={styles.fipeLabelWrapper}>
                  <MaterialCommunityIcons name="web" size={12} color="#1A5FA8" />
                  <Text style={styles.fipeAtributoLabel}>Preço FIPE</Text>
                </View>
                <Text style={styles.fipeAtributoSub}>Tabela oficial</Text>
              </View>
              {precosFipe.map((fipe, vIdx) => (
                <View key={vIdx} style={[styles.veiculoCol, vIdx === 0 && styles.refDataCol]}>
                  {fipe ? (
                    <>
                      <Text style={[styles.fipeValor, vIdx === 0 && styles.fipeValorRef]}>
                        {fipe.valor}
                      </Text>
                      <Text style={styles.fipeAno}>{fipe.anoModelo}</Text>
                      {!fipe.anoExato && fipe.anoSolicitado && (
                        <View style={styles.fipeAvisoInline}>
                          <MaterialCommunityIcons name="alert-circle-outline" size={10} color="#8A6400" />
                          <Text style={styles.fipeAvisoInlineText}>
                            Pedido: {fipe.anoSolicitado}
                          </Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.ndBadge}>
                      <Text style={styles.ndText}>N/D</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Linhas de especificação */}
          {atributos.map((atributo, atIdx) => {
            const specs = resultados.map((r) =>
              r.especificacoes.find((s) => s.atributo === atributo.label)
            );
            const todosDisponiveis = specs.every((s) => s?.disponivel);
            const valoresIguais =
              todosDisponiveis && specs.every((s) => s.valor === specs[0].valor);

            let rowBg = '#FFF';
            if (!todosDisponiveis) rowBg = CINZA_BG;
            else if (valoresIguais) rowBg = VERDE_BG;
            else rowBg = AMARELO_BG;

            const borderColor = !todosDisponiveis
              ? '#E0E0E0'
              : valoresIguais
              ? '#B2DFCA'
              : '#FFE082';

            return (
              <View
                key={atributo.id}
                style={[
                  styles.specRow,
                  { backgroundColor: rowBg, borderLeftColor: borderColor },
                  atIdx === atributos.length - 1 && styles.specRowLast,
                ]}
              >
                <View style={styles.atributoCol}>
                  <Text style={styles.atributoLabel}>{atributo.label}</Text>
                </View>

                {specs.map((spec, vIdx) => (
                  <View key={vIdx} style={[styles.veiculoCol, vIdx === 0 && styles.refDataCol]}>
                    {spec?.disponivel ? (
                      <Text
                        style={[
                          styles.specValue,
                          vIdx === 0 && styles.specValueRef,
                        ]}
                      >
                        {spec.valor}
                      </Text>
                    ) : (
                      <View style={styles.ndBadge}>
                        <Text style={styles.ndText}>N/D</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            );
          })}

          {/* Rodapé */}
          <View style={styles.rodape}>
            <MaterialCommunityIcons name="database-outline" size={13} color="#BCC" />
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

  scroll: { backgroundColor: '#F4F6FA', flexGrow: 1, paddingBottom: 32 },

  /* Cabeçalho dos veículos (sticky) */
  veiculosHeader: {
    flexDirection: 'row',
    backgroundColor: FORD_BLUE,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  atributoHeaderCol: { flex: 1.1 },
  veiculoCol: { flex: 1, alignItems: 'center', paddingHorizontal: 6 },
  refCol: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingVertical: 4,
  },
  refBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
    gap: 4,
    alignSelf: 'center',
  },
  refBadgeText: { color: FORD_BLUE, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  concorrenteBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
    alignSelf: 'center',
  },
  concorrenteBadgeText: { color: 'rgba(255,255,255,0.75)', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  veiculoMarca: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '500', textAlign: 'center' },
  refMarca: { color: '#FFF', fontWeight: '700' },
  veiculoModelo: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 1 },
  refModelo: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  veiculoVersao: { color: 'rgba(255,255,255,0.55)', fontSize: 11, textAlign: 'center', marginTop: 3 },

  /* Legenda */
  legendaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    gap: 10,
  },
  legendaTitulo: { fontSize: 11, color: '#AAA', fontWeight: '600' },
  legendaPills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  legendaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  legendaDot: { width: 7, height: 7, borderRadius: 4 },
  legendaLabel: { fontSize: 11, fontWeight: '600' },

  /* Linha FIPE */
  fipeRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#EEF4FF',
    borderBottomWidth: 2,
    borderBottomColor: '#C5D8F5',
    borderLeftWidth: 4,
    borderLeftColor: '#1A5FA8',
    alignItems: 'center',
  },
  fipeLabelWrapper: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  fipeAtributoLabel: { fontSize: 13, color: '#1A5FA8', fontWeight: '700' },
  fipeAtributoSub: { fontSize: 10, color: '#1A5FA8', opacity: 0.7 },
  fipeValor: { fontSize: 13, color: '#333', fontWeight: '700', textAlign: 'center' },
  fipeValorRef: { color: FORD_BLUE, fontSize: 14 },
  fipeAno: { fontSize: 10, color: '#888', textAlign: 'center', marginTop: 1 },
  fipeAvisoInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
    backgroundColor: '#FFF8E1',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  fipeAvisoInlineText: { fontSize: 9, color: '#8A6400' },

  /* Linhas de spec */
  specRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    borderLeftWidth: 4,
    alignItems: 'flex-start',
  },
  specRowLast: { borderBottomWidth: 0 },
  atributoCol: { flex: 1.1, paddingRight: 10 },
  atributoLabel: { fontSize: 13, color: '#444', fontWeight: '600', lineHeight: 18 },
  refDataCol: {
    backgroundColor: 'rgba(0,52,120,0.04)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  specValue: { fontSize: 13, color: '#333', fontWeight: '500', textAlign: 'center', lineHeight: 18 },
  specValueRef: { color: FORD_BLUE, fontWeight: '700' },
  ndBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  ndText: { fontSize: 11, color: '#999', fontWeight: '600' },

  /* Rodapé */
  rodape: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    margin: 20,
    paddingHorizontal: 4,
  },
  rodapeText: { flex: 1, fontSize: 11, color: '#BBB', lineHeight: 16 },
});
