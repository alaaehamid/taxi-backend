import { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';

export default function ShiftScreen() {
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  // ⚠️ Hardcoded for now — in future: select these from a dropdown
  const driver_id = 1;
  const car_id = 1;

  const startShift = async () => {
    try {
      console.log('Logging shift with driver_id:', driver_id);

      const res = await fetch('https://taxi-backend-mxtf.onrender.com/shifts/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id, car_id }),
      });

      if (!res.ok) throw new Error('Failed to start shift');
      const data = await res.json();

      setShiftId(data.id);
      setStartTime(new Date(data.start_time).toLocaleTimeString());
      setEndTime(null);

      Alert.alert('Shift Started', `Shift ID: ${data.id}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not start shift');
    }
  };

  const endShift = async () => {
    if (!shiftId) return Alert.alert('No active shift');

    try {
      const res = await fetch('https://taxi-backend-mxtf.onrender.com/shifts/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shift_id: shiftId }),
      });

      if (!res.ok) throw new Error('Failed to end shift');
      const data = await res.json();

      setEndTime(new Date(data.end_time).toLocaleTimeString());
      Alert.alert('Shift Ended', `Duration saved`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not end shift');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
      <Text style={{ fontSize: 18 }}>Shift Tracker</Text>
      <Button title="Start Shift" onPress={startShift} />
      <Button title="End Shift" onPress={endShift} />
      {startTime && <Text>Started: {startTime}</Text>}
      {endTime && <Text>Ended: {endTime}</Text>}
    </View>
  );
}
