import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import User type
import { FIRESTORE_AUTH } from './firebaseConfig';
import HomeScreen from './app/screens/HomeScreen';
import Details from './app/screens/Details';
import Todos from './app/screens/Todos';
import Auth from './app/screens/Auth';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Todos: undefined;
  Auth: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Use boolean or null for initial state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIRESTORE_AUTH, (user: User | null) => {
      // Convert user to boolean
      setIsAuthenticated(!!user); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {/* Check statuts before rerouti8ng */}
      <RootStack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Auth'}>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Details" component={Details} />
        <RootStack.Screen name="Todos" component={Todos} />
        <RootStack.Screen name="Auth" component={Auth} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
