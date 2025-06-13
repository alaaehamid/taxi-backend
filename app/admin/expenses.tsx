import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EXPENSE_TYPES = ['all', 'fuel', 'maintenance', 'personal', 'parking', 'other'];
const PERIODS = ['all', 'last 7 days', 'this month', 'custom'];

const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);

export default function AdminExpenses() {
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [period, setPeriod] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchExpenses = async (from?: string, to?: string) => {
    let url = 'https://taxi-backend-mxtf.onrender.com/expenses';
    if (from && to) {
      url += `?from=${from}&to=${to}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setAllExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let filteredList = [...allExpenses];
    if (filterType !== 'all') {
      filteredList = filteredList.filter(e => e.type === filterType);
    }
    setFiltered(filteredList);
  }, [filterType, allExpenses]);

  const applyDateFilter = () => {
    if (period === 'all') {
      fetchExpenses();
    } else if (period === 'last 7 days') {
      const to = toISO(today);
      const from = toISO(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
      fetchExpenses(from, to);
    } else if (period === 'this month') {
      const from = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      const to = toISO(today);
      fetchExpenses(from, to);
    } else if (fromDate && toDate) {
      fetchExpenses(fromDate, toDate);
    }
  };

  const total = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Admin Expenses Report</Text>

      <Text>Expense Type:</Text>
      <Picker
        selectedValue={filterType}
        onValueChange={val => setFilterType(val)}
        style={{ marginBottom: 10 }}
      >
        {EXPENSE_TYPES.map(t => <Picker.Item key={t} label={t} value={t} />)}
      </Picker>

      <Text>Time Period:</Text>
      <Picker
        selectedValue={period}
        onValueChange={val => setPeriod(val)}
        style={{ marginBottom: 10 }}
      >
        {PERIODS.map(p => <Picker.Item key={p} label={p} value={p} />)}
      </Picker>

      {period === 'custom' && (
        <View style={{ marginBottom: 10 }}>
          <TextInput
            placeholder="From (YYYY-MM-DD)"
            value={fromDate}
            onChangeText={setFromDate}
            style={{ borderBottomWidth: 1, marginBottom: 5 }}
          />
          <TextInput
            placeholder="To (YYYY-MM-DD)"
            value={toDate}
            onChangeText={setToDate}
            style={{ borderBottomWidth: 1 }}
          />
        </View>
      )}

      <Button title="Apply Filter" onPress={applyDateFilter} />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Total: €{total.toFixed(2)}</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 6 }}>
            <Text>€{item.amount} — {item.type}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>{item.description}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}
