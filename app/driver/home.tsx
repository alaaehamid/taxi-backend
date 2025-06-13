import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function DriverHome() {
  const router = useRouter();
  const [name, setName] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('driver_name').then(value => {
      if (value) setName(value);
    });
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace('/driver/login');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Welcome, {name || 'Driver'}
      </Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
