import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, Modal, Pressable } from 'react-native';

export default function AdminCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCarModal, setNewCarModal] = useState(false);
  const [newCar, setNewCar] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
  });

  const fetchCars = async () => {
    const res = await fetch('https://taxi-backend-mxtf.onrender.com/cars');
    const data = await res.json();
    setCars(data);
  };

  useEffect(() => {
    fetchCars();
  }, []);

const handleDelete = async (id: number) => {
  console.log('Attempting to delete car with ID:', id); // DEBUG

  Alert.alert('Delete Car', 'Are you sure?', [
    { text: 'Cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          const response = await fetch(`https://taxi-backend-mxtf.onrender.com/cars/${id}`, {
            method: 'DELETE',
          });

          if (response.status === 204) {
            console.log('Car deleted successfully.');
            fetchCars();
          } else {
            const text = await response.text();
            console.error(`Failed to delete. Status: ${response.status}, Response: ${text}`);
            Alert.alert('Error', `Delete failed: ${text}`);
          }
        } catch (err) {
          console.error('Error deleting car:', err);
          Alert.alert('Error', 'Could not delete car.');
        }
      },
    },
  ]);
};


  const handleEdit = (car: any) => {
    setEditingCar({ ...car });
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingCar) return;
    const { id, license_plate, make, model, year } = editingCar;

    try {
      await fetch(`https://taxi-backend-mxtf.onrender.com/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_plate,
          make,
          model,
          year: parseInt(year),
        }),
      });
      setModalVisible(false);
      fetchCars();
    } catch (err) {
      console.error('Error updating car:', err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Manage Cars</Text>
      <Button title="Add Car" onPress={() => setNewCarModal(true)} />

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderColor: '#ccc',
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.license_plate}</Text>
            <Text>{item.make} {item.model} ({item.year})</Text>

            <View style={{ flexDirection: 'row', marginTop: 5, gap: 10 }}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000000aa' }}>
          <View style={{ backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Edit Car</Text>

            <TextInput
              placeholder="License Plate"
              value={editingCar?.license_plate}
              onChangeText={(text) => setEditingCar({ ...editingCar, license_plate: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Make"
              value={editingCar?.make}
              onChangeText={(text) => setEditingCar({ ...editingCar, make: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Model"
              value={editingCar?.model}
              onChangeText={(text) => setEditingCar({ ...editingCar, model: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Year"
              value={editingCar?.year?.toString()}
              onChangeText={(text) => setEditingCar({ ...editingCar, year: text })}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />

            <Button title="Save" onPress={saveEdit} />
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        visible={newCarModal}
        animationType="slide"
        transparent
        onRequestClose={() => setNewCarModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000000aa' }}>
          <View style={{ backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Add New Car</Text>

            <TextInput
              placeholder="License Plate"
              value={newCar.license_plate}
              onChangeText={(text) => setNewCar({ ...newCar, license_plate: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Make"
              value={newCar.make}
              onChangeText={(text) => setNewCar({ ...newCar, make: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Model"
              value={newCar.model}
              onChangeText={(text) => setNewCar({ ...newCar, model: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Year"
              value={newCar.year}
              onChangeText={(text) => setNewCar({ ...newCar, year: text })}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />

            <Button
              title="Add"
              onPress={async () => {
                try {
                  await fetch('https://taxi-backend-mxtf.onrender.com/cars', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...newCar,
                      year: parseInt(newCar.year),
                    }),
                  });
                  setNewCarModal(false);
                  fetchCars();
                  setNewCar({ license_plate: '', make: '', model: '', year: '' });
                } catch (err) {
                  console.error('Error adding car:', err);
                }
              }}
            />
            <Pressable onPress={() => setNewCarModal(false)}>
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
