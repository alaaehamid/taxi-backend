import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EXPENSE_TYPES = [
  { type: 'fuel', icon: 'gas-station' },
  { type: 'maintenance', icon: 'wrench' },
  { type: 'personal', icon: 'account' },
  { type: 'parking', icon: 'parking' },
  { type: 'other', icon: 'dots-horizontal' },
];

export default function ExpensesScreen() {
  const router = useRouter();

  const [driverId, setDriverId] = useState<string | null>(null);
  const [type, setType] = useState(EXPENSE_TYPES[0].type);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);

  const car_id = 1;

  useEffect(() => {
    AsyncStorage.getItem('driver_id').then(id => {
      if (id) setDriverId(id);
      else router.replace('/driver/login');
    });
  }, []);

  const handleAddExpense = async () => {
    if (!amount || isNaN(+amount)) {
      return Alert.alert('Please enter a valid amount');
    }

    if (!driverId) {
      return Alert.alert('You must be logged in to log expenses');
    }

    try {
      const res = await fetch('https://taxi-backend-mxtf.onrender.com/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_id: driverId,
          car_id,
          amount: parseFloat(amount),
          description,
          type,
        }),
      });

      if (!res.ok) throw new Error('Failed to log expense');
      const data = await res.json();

      setExpenses(prev => [data, ...prev]);
      setAmount('');
      setDescription('');
      setType(EXPENSE_TYPES[0].type);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not log expense');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log an Expense</Text>

      <Text style={styles.label}>Select Type:</Text>
      <View style={styles.typesRow}>
        {EXPENSE_TYPES.map(item => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.typeButton,
              type === item.type && styles.typeButtonActive,
            ]}
            onPress={() => setType(item.type)}
          >
            <Icon name={item.icon} size={20} color="white" />
            <Text style={styles.typeText}>{item.type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="e.g., Filled gas"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text style={styles.label}>Amount (€)</Text>
      <TextInput
        placeholder="e.g., 50"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleAddExpense} style={styles.submitBtn}>
        <Text style={styles.submitText}>Add Expense</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseText}>
              {item.timestamp?.slice(11, 16)} — €{item.amount} — {item.description}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fb',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  label: {
    fontWeight: '500',
    marginBottom: 5,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 10,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#6c757d',
    borderRadius: 20,
  },
  typeButtonActive: {
    backgroundColor: '#007bff',
  },
  typeText: {
    color: 'white',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 6,
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 30,
  },
  submitText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  expenseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  expenseText: {
    fontSize: 14,
  },
});
