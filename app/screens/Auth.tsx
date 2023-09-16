import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth as FirebaseAuth,
} from 'firebase/auth';
import { FIRESTORE_AUTH } from '../../firebaseConfig';

interface AuthProps {
  navigation: any; 
}

const Auth: React.FC<AuthProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginOrSignup = async () => {
    try {
      if (!email || !password) {
        console.error('Email and password are required.');
        return;
      }

      try {
        const user = await signInWithEmailAndPassword(
          FIRESTORE_AUTH,
          email,
          password
        );
        navigation.navigate('Home');
      } catch (signInError) {
        const newAccount = await createUserWithEmailAndPassword(
          FIRESTORE_AUTH,
          email,
          password
        );

        console.log('New account:', newAccount);
        Alert.alert(
          'Success!',
          'Account created successfully. Check your Email!!'
        );
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login or Create an Account</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLoginOrSignup}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleLoginOrSignup}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Auth;
