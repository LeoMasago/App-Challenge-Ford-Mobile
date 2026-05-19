import CategoryScreen from '../components/CategoryScreen';

export default function SedasScreen({ navigation }) {
  return (
    <CategoryScreen
      navigation={navigation}
      categoria="sedan"
      titulo="Sedãs"
      icone="car"
      tag="SEDÃ"
    />
  );
}
