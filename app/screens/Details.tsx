import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  deleteDoc,
  doc,
  updateDoc,
  Firestore,
} from 'firebase/firestore';
import { FIRESTORE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

interface DetailsProps {
  route: any;
  navigation: any;
}

const Details: React.FC<DetailsProps> = ({ route, navigation }) => {
  const { title: initialTitle, text: initialText, wholeItem } = route.params;
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const todoItemRef = doc(FIRESTORE_DB, 'todos', wholeItem.id);

  const saveChanges = async () => {
    try {
      if (!todoItemRef) {
        console.error('Task not found!');
        return;
      }
      await updateDoc(todoItemRef, {
        text: text,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const editDescription = () => {
    setIsEditing(true);
  };

  const toggleStatus = async () => {
    try {
      const newStatus = wholeItem.status === 'pending' ? 'done' : 'pending';
      await updateDoc(todoItemRef, {
        status: newStatus,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };
  
  const deleteTask = async () => {
    try {
      await deleteDoc(todoItemRef);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

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
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navTitle}>Todo App</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.text_container}>
        <View style={styles.new_description}>
          {isEditing ? null : (
            <TouchableOpacity onPress={editDescription} style={styles.editIcon}>
              <Ionicons name="md-create" size={24} color="blue" />
            </TouchableOpacity>
          )}
          {isEditing ? (
            <TextInput
              style={styles.headerInput}
              value={text}
              onChangeText={(newText) => setText(newText)}
              multiline={true}
              autoCorrect={true}
              spellCheck={true}
            />
          ) : (
            <Text style={styles.description}>{text}</Text>
          )}
          {isEditing ? (
            <Button title="Save" onPress={() => saveChanges()} />
          ) : null}
        </View>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={deleteTask}>
          <Ionicons name="md-trash" size={24} color="red" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleStatus}>
          <Ionicons
            name={
              wholeItem.status === 'pending'
                ? 'md-checkmark-circle'
                : 'md-close-circle'
            }
            size={24}
            color={wholeItem.status === 'pending' ? 'green' : 'red'}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="exit-outline" size={24} color="white" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'grey',
    padding: 10,
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
  text_container: {
    flex: 1,
    padding: 16,
    height: 60,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  new_description: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 16,
    height: 260,
  },
  icon: {
    marginLeft: 12,
    fontSize: 44,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 26,
  },
  headerInput: {
    fontSize: 18,
    marginBottom: 64,
    width: 300,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 8,
    marginTop: 24,
  },
  description: {
    fontSize: 18,
    marginBottom: 64,
    height: 120,
    width: 300,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 8,
    marginTop: 24,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

export default Details;
