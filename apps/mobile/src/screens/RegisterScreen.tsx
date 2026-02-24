import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/auth';

type Props = {
  navigation: any;
  onRegisterSuccess: (session: any) => void;
};

export default function RegisterScreen({ navigation, onRegisterSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7,11)}`;
  };

  const formatCpf = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0,3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0,3)}.${numbers.slice(3,6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0,3)}.${numbers.slice(3,6)}.${numbers.slice(6,9)}-${numbers.slice(9,11)}`;
  };

  const handleRegister = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !cpf.trim() || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não conferem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const session = await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        cpf: cpf.trim(),
        password,
      });
      
      onRegisterSuccess(session);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível criar a conta');
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>🚗 PilotaJá</Text>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(11) 99999-9999"
                value={phone}
                onChangeText={(t) => setPhone(formatPhone(t))}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(t) => setCpf(formatCpf(t))}
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => navigation.navigate('login')}
            >
              <Text style={styles.loginLinkText}>
                Já tem conta? <Text style={styles.loginLinkBold}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#007AFF' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  logo: { fontSize: 40, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
  form: { flex: 1 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  button: { backgroundColor: '#007AFF', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#99c9ff' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  loginLink: { alignItems: 'center', marginTop: 24, marginBottom: 32 },
  loginLinkText: { fontSize: 16, color: '#666' },
  loginLinkBold: { color: '#007AFF', fontWeight: '600' },
});
