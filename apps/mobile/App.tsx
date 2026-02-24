import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import MyLessonsScreen from './src/screens/MyLessonsScreen';

type Screen = 'login' | 'home' | 'schedule' | 'lessons';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const navigate = (screen: Screen) => setCurrentScreen(screen);
  const goBack = () => setCurrentScreen('home');

  return (
    <>
      <StatusBar style="auto" />
      {currentScreen === 'login' && (
        <LoginScreen navigation={{ replace: () => navigate('home') }} />
      )}
      {currentScreen === 'home' && (
        <HomeScreen navigation={{ navigate }} />
      )}
      {currentScreen === 'schedule' && (
        <ScheduleScreen navigation={{ goBack }} />
      )}
      {currentScreen === 'lessons' && (
        <MyLessonsScreen navigation={{ navigate, goBack }} />
      )}
    </>
  );
}
