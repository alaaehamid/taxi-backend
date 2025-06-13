import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminLayout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const id = await AsyncStorage.getItem('admin_id');
      if (!id && segments[1] !== 'login') {
        router.replace('/admin/login');
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [segments]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['admin_id', 'admin_name']);
    router.replace('/');
  };

  if (checkingAuth) return null;

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>admin</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
      <Stack />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5252',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
});
