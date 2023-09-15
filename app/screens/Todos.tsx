import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
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
  where,query
} from 'firebase/firestore';
import { FIRESTORE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

export interface Todo {
  email: string;
  title: string;
  text: string;
  status: string;
  id: string;
}

const Todos = ({ navigation }: any) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<any>('');
  const [todoContent, setTodoContent] = useState<any>('');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const user = FIRESTORE_AUTH.currentUser;
  // console.log(user);
  if (!user) {
    console.error('User not authenticated.');
    navigation.navigate('Auth');
  }

  const checkIfTitleExists = (newTitle: string) => {
    return todos.some((existingTodo) => existingTodo.title === newTitle);
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

    const userEmail = user.email;
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
    const todoRef = collection(FIRESTORE_DB, 'todos');

    const q = query(todoRef, where('email', '==', user.email)); 
    const subscriber = onSnapshot(q , {
      next: (snapshot) => {
        const todos: Todo[] = [];
        snapshot.docs.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo);
        });
        setTodos(todos);
      },
    });
    return () => subscriber();
  }, []);

  return (
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
          keyExtractor={(todo: Todo) => todo.id}
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

      {/* <Button onPress={() => navigation.navigate('Details')} title="Details" /> */}
    </View>
  );
};

export default Todos;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    overflow: 'scroll',
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
    padding: 16,
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
});
