import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  ScheduleScreen,
  MyLessonsScreen,
  ProfileScreen,
} from './src/screens';
import { authService, UserSession } from './src/services/auth';

type Screen = 'login' | 'register' | 'home' | 'schedule' | 'lessons' | 'profile';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedSession = await authService.getSession();
      if (savedSession) {
        setSession(savedSession);
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    await authService.logout();
    setSession(null);
    setCurrentScreen('login');
  };

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const navigation = {
    navigate,
    goBack: () => {
      if (currentScreen === 'register') {
        setCurrentScreen('login');
      } else {
        setCurrentScreen('home');
      }
    },
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const renderScreen = () => {
    // Auth screens (not logged in)
    if (!session) {
      switch (currentScreen) {
        case 'register':
          return (
            <RegisterScreen
              navigation={navigation}
              onRegisterSuccess={handleLoginSuccess}
            />
          );
        case 'login':
        default:
          return (
            <LoginScreen
              navigation={navigation}
              onLoginSuccess={handleLoginSuccess}
            />
          );
      }
    }

    // App screens (logged in)
    switch (currentScreen) {
      case 'schedule':
        return <ScheduleScreen navigation={navigation} session={session} />;
      case 'lessons':
        return <MyLessonsScreen navigation={navigation} session={session} />;
      case 'profile':
        return <ProfileScreen navigation={navigation} session={session} onLogout={handleLogout} />;
      case 'home':
      default:
        return <HomeScreen navigation={navigation} session={session} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
