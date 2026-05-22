import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissao() {
  if (Platform.OS === 'web') return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function notificarComparacaoRealizada(veiculo1, veiculo2) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Comparação técnica concluída',
      body: `${veiculo1} vs ${veiculo2} · Toque para ver o resultado.`,
      data: { tipo: 'comparacao' },
    },
    trigger: null,
  });
}
