import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';

const Details = ({ route, navigation }: any) => {
  const { title: initialTitle, text: initialText, wholeItem } = route.params;
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default Details;
