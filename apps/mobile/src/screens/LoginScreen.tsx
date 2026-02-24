import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/auth';

type Props = {
  navigation: any;
  onLoginSuccess: (session: any) => void;
};

export default function LoginScreen({ navigation, onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    try {
      const session = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });
      
      onLoginSuccess(session);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'E-mail ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>🚗 PilotaJá</Text>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>Entre para agendar suas aulas</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerLink}
              onPress={() => navigation.navigate('register')}
            >
              <Text style={styles.registerLinkText}>
                Não tem conta? <Text style={styles.registerLinkBold}>Criar agora</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#007AFF' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
  form: { width: '100%' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: '#007AFF', fontSize: 14 },
  button: { backgroundColor: '#007AFF', borderRadius: 12, padding: 18, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#99c9ff' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  registerLink: { alignItems: 'center', marginTop: 24 },
  registerLinkText: { fontSize: 16, color: '#666' },
  registerLinkBold: { color: '#007AFF', fontWeight: '600' },
});
