import { View, Text } from 'react-native';
import React from 'react';

const Details = () => {
  return (
    <View>
      <Text>Details</Text>
      <Text>{process.env.FIREBASE_API_KEY}</Text>
    </View>
  );
};

export default Details;
