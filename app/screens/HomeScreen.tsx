import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut, User } from 'firebase/auth';
import { FIRESTORE_AUTH } from '../../firebaseConfig';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const user: User | null = FIRESTORE_AUTH.currentUser;

  useEffect(() => {
    if (!user) {
      console.error('User not authenticated.');
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut(FIRESTORE_AUTH);
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Todo App</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.intro}>
        <Text style={styles.introText}>Welcome to the Todo App!</Text>
        {user && <Text style={styles.introEmail}>Email: {user.email}</Text>}
      </View>
      <TouchableOpacity
        style={styles.todoButton}
        onPress={() => navigation.navigate('Todos')}
      >
        <Text style={styles.todoButtonText}>Todos</Text>
      </TouchableOpacity>
      {showLogoutConfirmation && (
        <Modal
          visible={showLogoutConfirmation}
          transparent={true}
          animationType="slide"
          onRequestClose={cancelLogout}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Are you sure you want to log out?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={confirmLogout}
                  style={styles.confirmButton}
                >
                  <Text>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelLogout}
                  style={styles.cancelButton}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'grey',
    padding: 10,
    marginBottom: 160,
  },
  navTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderRadius: 25,
    padding: 10,
  },
  intro: {
    marginBottom: 16,
  },
  introText: {
    fontSize: 24,
  },
  introEmail: {
    fontSize: 18,
    marginVertical: 16,
    textAlign: 'center',
  },
  todoButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  todoButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    width: 100,
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width - 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
});
