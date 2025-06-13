import { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';

export default function AdminShifts() {
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://taxi-backend-mxtf.onrender.com/shifts')
      .then(res => res.json())
      .then(setShifts)
      .catch(console.error);
  }, []);

  const getDuration = (start: string, end: string) => {
    if (!end) return 'Ongoing';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diff = (endTime - startTime) / 1000 / 60; // mins
    return `${Math.floor(diff)} min`;
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10, fontWeight: 'bold' }}>Driver Shifts</Text>

      <FlatList
        data={shifts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              paddingBottom: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.driver_name}</Text>
            <Text>Start: {new Date(item.start_time).toLocaleString()}</Text>
            <Text>End: {item.end_time ? new Date(item.end_time).toLocaleString() : '—'}</Text>
            <Text>Duration: {getDuration(item.start_time, item.end_time)}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}
