import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo, Feather } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  where,
  query,
} from 'firebase/firestore';
import { FIRESTORE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { User, signOut } from 'firebase/auth';
interface TodoItem {
  email: string;
  title: string;
  text: string;
  status: string;
  id: string;
}

interface TodosProps {
  navigation: any;
}

const Todos: React.FC<TodosProps> = ({ navigation }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todo, setTodo] = useState<string>('');
  const [todoContent, setTodoContent] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] =
    useState<boolean>(false);

  const user: User | null = FIRESTORE_AUTH.currentUser;

  useEffect(() => {
    if (!user) {
      console.error('User not authenticated.');
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  const checkIfTitleExists = (newTitle: string) => {
    return todos.some((existingTodo) => existingTodo.title === newTitle);
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

  const closeErrorMessage = () => {
    setShowErrorMessage(false);
    setErrorMessage('');
  };

  const addToDo = async () => {
    const newTitle = todo.trim();
    if (newTitle === '') {
      return;
    }

    if (checkIfTitleExists(newTitle)) {
      setErrorMessage('Todo already exists.');
      setShowErrorMessage(true);
      return;
    }

    const userEmail = user!.email;
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, 'todos'), {
        title: newTitle,
        text: todoContent,
        status: 'pending',
        email: userEmail,
      });
      setTodo('');
      setTodoContent('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const renderTodo = ({ item }: any) => {
    const todoItemRef = doc(FIRESTORE_DB, `todos/${item.id}`);

    const toggleDone = async () => {
      try {
        await updateDoc(todoItemRef, {
          status: item.status === 'pending' ? 'done' : 'pending',
        });
      } catch (error) {
        console.error('Error toggling todo status:', error);
      }
    };

    const deleteTodo = async () => {
      try {
        await deleteDoc(todoItemRef);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={() => toggleDone()}>
          {item.status === 'pending' ? (
            <Entypo
              name="circle"
              size={24}
              color="white"
              style={styles.todoStatus}
            />
          ) : (
            <Ionicons
              name="md-checkmark-circle"
              size={24}
              color="green"
              style={styles.todoStatus}
            />
          )}
        </TouchableOpacity>
        <View style={styles.todoDetails}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Details', {
                title: item.title,
                text: item.text,
                taskId: item.id,
                wholeItem: item,
              })
            }
          >
            <Text style={styles.todoTitle}>{item.title}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => deleteTodo()}>
          <Ionicons name="md-trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const todoRef = collection(FIRESTORE_DB, 'todos');
    const q = query(todoRef, where('email', '==', user.email));

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        const todos: TodoItem[] = [];
        snapshot.docs.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...doc.data(),
          } as TodoItem);
        });
        setTodos(todos);
      },
    });
    return () => subscriber();
  }, [user]);

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navTitle}>Todo App</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          onChangeText={(text: string) => setTodo(text)}
          value={todo}
        />
        <TextInput
          style={styles.inputDescription}
          placeholder="Describe Task"
          onChangeText={(text: string) => setTodoContent(text)}
          value={todoContent}
          multiline={true}
          autoCorrect={true}
          spellCheck={true}
        />
        <Button
          onPress={() => addToDo()}
          title="Add todo"
          disabled={todo === ''}
        />

        {todos.length > 0 && (
          <FlatList
            data={todos}
            renderItem={renderTodo}
            keyExtractor={(todo: TodoItem) => todo.id}
            contentContainerStyle={styles.flatListContainer}
          />
        )}
        {showErrorMessage && (
          <View style={styles.errorMessageContainer}>
            <View style={styles.errorMessageContent}>
              <Text style={styles.errorMessageText}>{errorMessage}</Text>
              <TouchableOpacity onPress={closeErrorMessage}>
                <Ionicons name="md-close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
    </ScrollView>
  );
};

export default Todos;

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
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
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#c6c1c1',
    padding: 10,
    fontSize: 20,
    marginVertical: 8,
    marginTop: 16,
  },
  inputDescription: {
    borderWidth: 1,
    height: 120,
    borderRadius: 4,
    backgroundColor: '#c9c7c7',
    padding: 4,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 8,
    borderRadius: 8,
  },
  todoDetails: {
    flex: 1,
    marginLeft: 12,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoText: {
    fontSize: 14,
  },
  flatListContainer: {
    paddingHorizontal: 16,
    flexGrow: 1, // Allow the FlatList to grow and take up available space
  },
  todoStatus: {
    backgroundColor: 'lightgray',
    borderRadius: 50,
    padding: 4,
  },
  errorMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessageContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorMessageText: {
    marginBottom: 8,
    fontSize: 18,
    color: 'red',
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
