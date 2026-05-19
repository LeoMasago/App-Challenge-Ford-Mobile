import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SedasScreen from '../screens/SedasScreen';
import EsportivosScreen from '../screens/EsportivosScreen';
import CaminhonetesScreen from '../screens/CaminhonetesScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
const Tab = createBottomTabNavigator();

const FORD_BLUE = '#003478';

const TAB_ICONS = {
  Sedas: 'car',
  Esportivos: 'car-sports',
  Caminhonetes: 'car-pickup',
  Historico: 'history',
};

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: FORD_BLUE,
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8ECF4',
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          shadowColor: '#003478',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name={TAB_ICONS[route.name]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Sedas" component={SedasScreen} />
      <Tab.Screen name="Esportivos" component={EsportivosScreen} />
      <Tab.Screen name="Caminhonetes" component={CaminhonetesScreen} />
      <Tab.Screen name="Historico" component={HistoricoScreen} />
    </Tab.Navigator>
  );
}
