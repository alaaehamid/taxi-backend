import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, View } from 'react-native';

export default function DriverLayout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const id = await AsyncStorage.getItem('driver_id');

      if (!id && segments[1] !== 'login') {
        router.replace('/driver/login');
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [segments]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('driver_id');
    await AsyncStorage.removeItem('driver_name');
    router.replace('/');
  };

  if (checkingAuth) return null;

  return (
    <>
      <View style={{ padding: 10, backgroundColor: '#eee', alignItems: 'flex-end' }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <Stack />
    </>
  );
}
