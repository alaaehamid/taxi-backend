import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, Modal, Pressable } from 'react-native';

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDriverModal, setNewDriverModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    address: '',
    license_number: '',
    username: '',
    password: ''
  });

  const fetchDrivers = async () => {
    const res = await fetch('https://taxi-backend-mxtf.onrender.com/drivers');
    const data = await res.json();
    setDrivers(data);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert('Delete Driver', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await fetch(`https://taxi-backend-mxtf.onrender.com/drivers/${id}`, { method: 'DELETE' });
          fetchDrivers();
        },
      },
    ]);
  };

  const handleEdit = (driver: any) => {
    setEditingDriver({ ...driver });
    setModalVisible(true);
  };

  const saveEdit = async () => {
    const { id, name, phone, address, license_number, username, password } = editingDriver;

    await fetch(`https://taxi-backend-mxtf.onrender.com/drivers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address, license_number, username, password }),
    });

    setModalVisible(false);
    fetchDrivers();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Manage Drivers</Text>
      <Button title="Add Driver" onPress={() => setNewDriverModal(true)} />

      <FlatList
        data={drivers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderColor: '#ccc',
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>License: {item.license_number}</Text>
            <Text>Username: {item.username}</Text>

            <View style={{ flexDirection: 'row', marginTop: 5, gap: 10 }}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />

      {/* Edit Driver Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000000aa' }}>
          <View style={{ backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Edit Driver</Text>

            <TextInput
              placeholder="Name"
              value={editingDriver?.name}
              onChangeText={text => setEditingDriver({ ...editingDriver, name: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Phone"
              value={editingDriver?.phone}
              onChangeText={text => setEditingDriver({ ...editingDriver, phone: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Address"
              value={editingDriver?.address}
              onChangeText={text => setEditingDriver({ ...editingDriver, address: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="License Number"
              value={editingDriver?.license_number}
              onChangeText={text => setEditingDriver({ ...editingDriver, license_number: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Username"
              value={editingDriver?.username}
              onChangeText={text => setEditingDriver({ ...editingDriver, username: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Password"
              value={editingDriver?.password}
              onChangeText={text => setEditingDriver({ ...editingDriver, password: text })}
              secureTextEntry
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />

            <Button title="Save" onPress={saveEdit} />
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add New Driver Modal */}
      <Modal
        visible={newDriverModal}
        animationType="slide"
        transparent
        onRequestClose={() => setNewDriverModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000000aa' }}>
          <View style={{ backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Add New Driver</Text>

            <TextInput
              placeholder="Name"
              value={newDriver.name}
              onChangeText={text => setNewDriver({ ...newDriver, name: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Phone"
              value={newDriver.phone}
              onChangeText={text => setNewDriver({ ...newDriver, phone: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Address"
              value={newDriver.address}
              onChangeText={text => setNewDriver({ ...newDriver, address: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="License Number"
              value={newDriver.license_number}
              onChangeText={text => setNewDriver({ ...newDriver, license_number: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Username"
              value={newDriver.username}
              onChangeText={text => setNewDriver({ ...newDriver, username: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Password"
              value={newDriver.password}
              onChangeText={text => setNewDriver({ ...newDriver, password: text })}
              secureTextEntry
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />

            <Button
              title="Add"
              onPress={async () => {
                await fetch('https://taxi-backend-mxtf.onrender.com/drivers', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newDriver),
                });
                setNewDriverModal(false);
                fetchDrivers();
                setNewDriver({ name: '', phone: '', address: '', license_number: '', username: '', password: '' });
              }}
            />
            <Pressable onPress={() => setNewDriverModal(false)}>
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
