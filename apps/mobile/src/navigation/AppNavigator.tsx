import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LoginScreen,
  HomeScreen,
  ScheduleScreen,
  MyLessonsScreen,
} from '../screens';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Schedule: undefined;
  MyLessons: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{ title: 'Agendar Aula' }}
        />
        <Stack.Screen
          name="MyLessons"
          component={MyLessonsScreen}
          options={{ title: 'Minhas Aulas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
