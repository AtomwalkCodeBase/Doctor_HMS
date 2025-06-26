import * as ImagePicker from 'expo-image-picker';
import { Button, View, Alert } from 'react-native';

export default function TestPicker() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button
        title="Pick Image"
        onPress={async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission denied');
            return;
          }
          let result = await ImagePicker.launchImageLibraryAsync();
          Alert.alert('Result', JSON.stringify(result));
        }}
      />
    </View>
  );
}