import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FordLogo from './FordLogo';

const FORD_BLUE = '#003478';
const DRAWER_WIDTH = Dimensions.get('window').width * 0.55;

const MENU_ITEMS = [
  { icon: 'car', label: 'Sedãs', screen: 'Sedas' },
  { icon: 'car-sports', label: 'Esportivos', screen: 'Esportivos' },
  { icon: 'car-pickup', label: 'Caminhonetes', screen: 'Caminhonetes' },
  { icon: 'history', label: 'Histórico', screen: 'Historico' },
];

export default function HomeHeader({ navigation }) {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  function openDrawer() {
    setVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function closeDrawer(callback) {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      if (callback) callback();
    });
  }

  function handleLogout() {
    closeDrawer(() => {
      navigation.getParent()?.navigate('Login') ?? navigation.navigate('Login');
    });
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <FordLogo size="small" />
        <View style={{ width: 28 }} />
      </View>

      <Modal visible={visible} transparent animationType="none" onRequestClose={() => closeDrawer()}>
        <View style={styles.modalRoot}>
          <TouchableWithoutFeedback onPress={() => closeDrawer()}>
            <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.drawerHeader}>
              <FordLogo />
            </View>

            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => closeDrawer(() => navigation.navigate(item.screen))}
              >
                <MaterialCommunityIcons name={item.icon} size={22} color={FORD_BLUE} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={22} color="#CC0000" />
              <Text style={[styles.menuLabel, { color: '#CC0000' }]}>Sair</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: FORD_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  drawerHeader: {
    alignItems: 'center',
    backgroundColor: FORD_BLUE,
    marginHorizontal: -20,
    marginTop: -60,
    paddingTop: 50,
    paddingBottom: 24,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  menuLabel: {
    fontSize: 16,
    color: FORD_BLUE,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
});
