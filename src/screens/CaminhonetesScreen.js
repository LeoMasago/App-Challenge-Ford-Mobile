import CategoryScreen from '../components/CategoryScreen';

export default function CaminhonetesScreen({ navigation }) {
  return (
    <CategoryScreen
      navigation={navigation}
      categoria="caminhonete"
      titulo="Caminhonetes"
      icone="car-pickup"
      tag="CAMINHONETE"
    />
  );
}
