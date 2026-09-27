import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { loginUser, registerUser } from '../firebase/authService';
import { migrarPrecos } from '../firebase/migratePrecos';
import { solicitarPermissao } from '../services/notificacaoService';
import FordLogo from '../components/FordLogo';
import { FORD_BLUE, FORD_BLUE_MID, FORD_BLUE_GRADIENT as FORD_BLUE_LIGHT } from '../theme';

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      migrarPrecos().catch(() => {});
      solicitarPermissao();
      router.replace('/(tabs)/sedas');
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(email.trim(), password);
      migrarPrecos().catch(() => {});
      solicitarPermissao();
      router.replace('/(tabs)/sedas');
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={['#001f4d', '#003478', '#004fa3']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <FordLogo />
            <Text style={styles.tagline}>Move Forward</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabPill}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'login' && styles.tabActive]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'cadastro' && styles.tabActive]}
                onPress={() => setActiveTab('cadastro')}
              >
                <Text style={[styles.tabText, activeTab === 'cadastro' && styles.tabTextActive]}>
                  Cadastro
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#AAA"
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#AAA"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={activeTab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={[FORD_BLUE_LIGHT, FORD_BLUE_MID]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Aguarde...' : activeTab === 'login' ? 'Entrar' : 'Cadastrar-se'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {activeTab === 'login' && (
              <TouchableOpacity
                style={styles.forgotContainer}
                onPress={() => router.push('/esqueci-senha')}
              >
                <View style={styles.dividerLine} />
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                <View style={styles.dividerLine} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  inner: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 36 },
  tagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    letterSpacing: 3,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tabPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 21,
  },
  tabActive: { backgroundColor: '#FFFFFF' },
  tabText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 15 },
  tabTextActive: { color: FORD_BLUE },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#222' },
  eyeIcon: { padding: 4 },
  button: { borderRadius: 12, overflow: 'hidden', marginTop: 4, marginBottom: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  forgotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  forgotText: { color: 'rgba(255,255,255,0.75)', marginHorizontal: 12, fontSize: 13 },
});
