import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function RoleLogin() {
  const router = useRouter();
  const [role, setRole] = useState<'driver' | 'admin'>('driver');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!username || !password) {
      return Alert.alert('Please fill in all fields');
    }

    setLoading(true);
    const url =
      role === 'admin'
        ? 'https://taxi-backend-mxtf.onrender.com/auth/admin-login'
        : 'https://taxi-backend-mxtf.onrender.com/auth/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Invalid username or password');
      const data = await res.json();

      if (role === 'admin') {
        await AsyncStorage.setItem('admin_id', data.admin_id.toString());
        await AsyncStorage.setItem('admin_name', data.name);
        router.replace('/admin');
      } else {
        await AsyncStorage.setItem('driver_id', data.driver_id.toString());
        await AsyncStorage.setItem('driver_name', data.name);
        router.replace('/driver');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER / MOTIVATION */}
      <Text style={styles.title}>🚖 Welcome to FleetLogix</Text>
      <Text style={styles.subtitle}>
        "Drive smarter. Track better. Relax more."
      </Text>

      <Text style={styles.description}>
        A complete fleet management solution for your drivers, expenses, and shifts.
        Join a smarter way to manage your operations.
      </Text>

      {/* Show Login Toggle */}
      {!showLogin && (
        <Pressable style={styles.loginButton} onPress={() => setShowLogin(true)}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </Pressable>
      )}

      {/* Login Form */}
      {showLogin && (
        <View style={styles.loginForm}>
          <Text style={styles.formTitle}>Login to Continue</Text>

          <Text style={styles.label}>Role</Text>
          <Picker
            selectedValue={role}
            onValueChange={val => setRole(val)}
            style={styles.picker}
          >
            <Picker.Item label="Driver" value="driver" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button title="Login" onPress={login} />
          )}

          <Pressable onPress={() => setShowLogin(false)}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A', // matte dark blue
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFD700', // gold
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    color: '#E0C97F', // light gold
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#CCCCCC',
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#F4B400', // deep gold
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#0D1B2A', // contrast dark background
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginForm: {
    marginTop: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFD700',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFD700',
  },
  picker: {
    marginBottom: 15,
    backgroundColor: '#1B263B',
    color: '#FFD700',
    borderRadius: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
    marginBottom: 15,
    paddingVertical: 5,
    color: '#fff',
  },
  cancel: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 15,
  },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f1f3f6',
//     padding: 20,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#222',
//   },
//   subtitle: {
//     fontSize: 16,
//     fontStyle: 'italic',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#555',
//   },
//   description: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#666',
//     paddingHorizontal: 10,
//   },
//   loginButton: {
//     backgroundColor: '#007aff',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     alignSelf: 'center',
//   },
//   loginButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   loginForm: {
//     marginTop: 30,
//   },
//   formTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   label: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   picker: {
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 15,
//     paddingVertical: 5,
//   },
//   cancel: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 15,
//   },
// });
