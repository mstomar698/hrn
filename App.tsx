import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// Screens
import HomeScreen from './app/screens/HomeScreen';
import Details from './app/screens/Details';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Details" component={Details} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
