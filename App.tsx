import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// Screens
import HomeScreen from './app/screens/HomeScreen';
import Details from './app/screens/Details';
import Todos from './app/screens/Todos';
import Auth from './app/screens/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { FIRESTORE_AUTH } from './firebaseConfig';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIRESTORE_AUTH, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Auth'}>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Details" component={Details} />
        <RootStack.Screen name="Todos" component={Todos} />
        <RootStack.Screen name="Auth" component={Auth} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
