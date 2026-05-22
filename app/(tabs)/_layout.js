import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FORD_BLUE = '#003478';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
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
          shadowColor: FORD_BLUE,
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="sedas"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="esportivos"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car-sports" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="caminhonetes"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car-pickup" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
