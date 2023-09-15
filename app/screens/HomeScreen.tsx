import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button onPress={() => navigation.navigate('Todos')} title="todos" />
    </View>
  );
};

export default HomeScreen;
