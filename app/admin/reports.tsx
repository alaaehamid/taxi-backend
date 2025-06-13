import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PERIODS = ['all', 'last 7 days', 'this month', 'custom'];

export default function AdminReports() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [mode, setMode] = useState<'driver' | 'car'>('driver');

  const [selectedId, setSelectedId] = useState('');
  const [period, setPeriod] = useState('last 7 days');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetch('https://taxi-backend-mxtf.onrender.com/drivers').then(res => res.json()).then(setDrivers);
    fetch('https://taxi-backend-mxtf.onrender.com/cars').then(res => res.json()).then(setCars);
  }, []);

  const getDateRange = (): [string | null, string | null] => {
    const today = new Date();
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    if (period === 'all') return [null, null];

    if (period === 'last 7 days') {
      const from = new Date(endOfToday.getTime() - 6 * 86400000);
      return [from.toISOString(), endOfToday.toISOString()];
    }

    if (period === 'this month') {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return [from.toISOString(), endOfToday.toISOString()];
    }

    // custom
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return [from.toISOString(), to.toISOString()];
    }

    return [null, null];
  };

  const fetchReport = async () => {
    if (!selectedId) return;
    setLoading(true);
    const [from, to] = getDateRange();

    const query = from && to ? `?from=${from}&to=${to}` : '';
    const id = selectedId;

    if (mode === 'driver') {
      const [shifts, expenses] = await Promise.all([
        fetch(`https://taxi-backend-mxtf.onrender.com/shifts/${id}${query}`).then(res => res.json()),
        fetch(`https://taxi-backend-mxtf.onrender.com/expenses/driver/${id}${query}`).then(res => res.json()),
      ]);

      const totalHours = shifts.reduce((sum: number, s: any) => {
        if (!s.end_time) return sum;
        const start = new Date(s.start_time).getTime();
        const end = new Date(s.end_time).getTime();
        return sum + (end - start) / 3600000;
      }, 0);

      const totalExpenses = expenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);

      setReportData({
        type: 'driver',
        totalHours,
        totalExpenses,
        shiftCount: shifts.length,
        avgShift: shifts.length ? totalHours / shifts.length : 0,
        attendance: shifts.map((s: { start_time: string }) => s.start_time.slice(0, 10)),
      });
    } else {
      const [shifts, expenses] = await Promise.all([
        fetch(`https://taxi-backend-mxtf.onrender.com/shifts`).then(res => res.json()),
        fetch(`https://taxi-backend-mxtf.onrender.com/expenses${query}`).then(res => res.json()),
      ]);

      const carShifts = shifts.filter((s: any) => s.car_id.toString() === id);
      const carExpenses = expenses.filter((e: any) => e.car_id?.toString() === id);
      const driversUsed = [...new Set(carShifts.map((s: any) => s.driver_id))];

      setReportData({
        type: 'car',
        totalShifts: carShifts.length,
        totalExpenses: carExpenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0),
        driversUsed,
      });
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Admin Reports</Text>

      <Text>Report Type:</Text>
      <Picker selectedValue={mode} onValueChange={setMode}>
        <Picker.Item label="Driver" value="driver" />
        <Picker.Item label="Car" value="car" />
      </Picker>

      {mode === 'driver' && (
        <>
          <Text>Select Driver:</Text>
          <Picker selectedValue={selectedId} onValueChange={setSelectedId}>
            <Picker.Item label="-- Choose Driver --" value="" />
            {drivers.map(d => (
              <Picker.Item key={d.id} label={d.name} value={d.id.toString()} />
            ))}
          </Picker>
        </>
      )}

      {mode === 'car' && (
        <>
          <Text>Select Car:</Text>
          <Picker selectedValue={selectedId} onValueChange={setSelectedId}>
            <Picker.Item label="-- Choose Car --" value="" />
            {cars.map(c => (
              <Picker.Item
                key={c.id}
                label={`${c.license_plate} (${c.make} ${c.model})`}
                value={c.id.toString()}
              />
            ))}
          </Picker>
        </>
      )}

      <Text>Time Period:</Text>
      <Picker selectedValue={period} onValueChange={setPeriod}>
        {PERIODS.map(p => <Picker.Item key={p} label={p} value={p} />)}
      </Picker>

      {period === 'custom' && (
        <View>
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

      <Button title="Generate Report" onPress={fetchReport} disabled={!selectedId} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {reportData && (
        <View style={{ marginTop: 20 }}>
          {reportData.type === 'driver' ? (
            <>
              <Text>Total Working Hours: {reportData.totalHours.toFixed(2)}</Text>
              <Text>Total Expenses: €{reportData.totalExpenses.toFixed(2)}</Text>
              <Text>Number of Shifts: {reportData.shiftCount}</Text>
              <Text>Average Shift Length: {reportData.avgShift.toFixed(2)} hrs</Text>
              <Text>Attendance Days:</Text>
              {reportData.attendance.map((date: string, i: number) => (
                <Text key={i}> - {date}</Text>
              ))}
            </>
          ) : (
            <>
              <Text>Total Shifts: {reportData.totalShifts}</Text>
              <Text>Total Expenses: €{reportData.totalExpenses.toFixed(2)}</Text>
              <Text>Drivers Used: {reportData.driversUsed.join(', ')}</Text>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}
