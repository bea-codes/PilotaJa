import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import MyLessonsScreen from './src/screens/MyLessonsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type Screen = 'login' | 'home' | 'schedule' | 'lessons' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const navigate = (screen: Screen) => setCurrentScreen(screen);
  const goBack = () => setCurrentScreen('home');
  const handleLogout = () => setCurrentScreen('login');

  return (
    <SafeAreaProvider>
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
      {currentScreen === 'profile' && (
        <ProfileScreen navigation={{ goBack }} onLogout={handleLogout} />
      )}
    </SafeAreaProvider>
  );
}
