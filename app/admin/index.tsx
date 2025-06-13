import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminHome() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Admin Panel</Text>
      <Button title="Manage Drivers" onPress={() => router.push('/admin/drivers')} />
      <Button title="Manage Cars" onPress={() => router.push('/admin/cars')} />
      <Button title="Generate Reports" onPress={() => router.push('/admin/reports')} />
      <Button title="View Expenses" onPress={() => router.push('/admin/expenses')} />
       <Button title="View Shift Logs" onPress={() => router.push('/admin/shifts')} />
    </View>
  );
}

