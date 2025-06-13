import { View, Text } from 'react-native';

export default function SummaryScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Weekly Summary</Text>
      <Text>— Hours worked: Coming soon</Text>
      <Text>— Total Expenses: Coming soon</Text>
      <Text>— Shifts This Week: Coming soon</Text>
    </View>
  );
}
