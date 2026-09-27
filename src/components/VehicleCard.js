import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FORD_BLUE = '#003478';

export default function VehicleCard({ name, description, icon, tag, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={42} color={FORD_BLUE} />
      </View>
      <View style={styles.info}>
        {tag && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#003478',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconContainer: {
    width: 68,
    height: 68,
    backgroundColor: '#EEF3FF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: { flex: 1 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F0FE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  tagText: { color: FORD_BLUE, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  name: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 3 },
  description: { fontSize: 13, color: '#888', lineHeight: 18 },
});
