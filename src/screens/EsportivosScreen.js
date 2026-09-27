import CategoryScreen from '../components/CategoryScreen';

export default function EsportivosScreen({ navigation }) {
  return (
    <CategoryScreen
      navigation={navigation}
      categoria="esportivo"
      titulo="Esportivos"
      icone="car-sports"
      tag="ESPORTIVO"
    />
  );
}
