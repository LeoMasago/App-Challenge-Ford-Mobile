import { View, Text, StyleSheet } from 'react-native';

export default function FordLogo({ size = 'large', color = '#FFFFFF' }) {
  const scale = size === 'small' ? 0.6 : 1;
  return (
    <View
      style={[
        styles.oval,
        {
          borderColor: color,
          width: 160 * scale,
          height: 80 * scale,
          borderRadius: 50 * scale,
        },
      ]}
    >
      <Text style={[styles.text, { color, fontSize: 36 * scale }]}>Ford</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  oval: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
