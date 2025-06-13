import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#4e91fc' }]} onPress={() => router.push('/admin/drivers')}>
        <Text style={styles.buttonText}>Manage Drivers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#34c38f' }]} onPress={() => router.push('/admin/cars')}>
        <Text style={styles.buttonText}>Manage Cars</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#f1b44c' }]} onPress={() => router.push('/admin/reports')}>
        <Text style={styles.buttonText}>Generate Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#f46a6a' }]} onPress={() => router.push('/admin/expenses')}>
        <Text style={styles.buttonText}>View Expenses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#6f42c1' }]} onPress={() => router.push('/admin/shifts')}>
        <Text style={styles.buttonText}>View Shift Logs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
