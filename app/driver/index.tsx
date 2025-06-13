import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function DriverHome() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Driver Panel</Text>
      <Button title="Start/End Shift" onPress={() => router.push('/driver/shift')} />
      <Button title="Log Expenses" onPress={() => router.push('/driver/expenses')} />
      <Button title="View Weekly Summary" onPress={() => router.push('/driver/summary')} />
    </View>
  );
}
