import { View, Text, StyleSheet } from 'react-native';
import HomeHeader from '../components/HomeHeader';

const FORD_BLUE = '#003478';

export default function EsportivosScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <HomeHeader navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>Esportivos</Text>
        <Text style={styles.subtitle}>Em breve os melhores esportivos Ford.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: FORD_BLUE },
  subtitle: { fontSize: 15, color: '#666', marginTop: 8 },
});
