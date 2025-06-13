// app/index.tsx
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Text style={{ fontSize: 24 }}>Welcome to FleetLogix</Text>
      <Button title="Admin Panel" onPress={() => router.push('/admin')} />
      <Button title="Driver Panel" onPress={() => router.push('/driver')} />
    </View>
  );
}
