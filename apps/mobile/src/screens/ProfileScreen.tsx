import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { studentsService, uploadService, Student } from '../services/api';
import { MOCK_USER } from '../config/user';

type Props = {
  navigation: any;
  onLogout: () => void;
};

export default function ProfileScreen({ navigation, onLogout }: Props) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Campos editáveis
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  
  // Valores originais para comparar
  const [originalData, setOriginalData] = useState({ nome: '', email: '', telefone: '', foto: null as string | null });
  
  // Campo sendo editado
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // Refs para inputs
  const nomeRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const telefoneRef = useRef<TextInput>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (!MOCK_USER.studentId) {
        setNome(MOCK_USER.name);
        setOriginalData({ nome: MOCK_USER.name, email: '', telefone: '', foto: null });
        return;
      }
      const data = await studentsService.getById(MOCK_USER.studentId);
      setStudent(data);
      setNome(data.name || '');
      setEmail(data.email || '');
      setTelefone(data.phone || '');
      setFoto(data.photoUrl || null);
      setOriginalData({ 
        nome: data.name || '', 
        email: data.email || '', 
        telefone: data.phone || '',
        foto: data.photoUrl || null 
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setNome(MOCK_USER.name);
      setOriginalData({ nome: MOCK_USER.name, email: '', telefone: '', foto: null });
    } finally {
      setLoading(false);
    }
  };

  // Verifica se há alterações
  const hasChanges = () => {
    return nome !== originalData.nome || 
           email !== originalData.email || 
           telefone !== originalData.telefone ||
           foto !== originalData.foto;
  };

  const handleFieldPress = (field: string) => {
    setEditingField(field);
    setTimeout(() => {
      if (field === 'nome') nomeRef.current?.focus();
      if (field === 'email') emailRef.current?.focus();
      if (field === 'telefone') telefoneRef.current?.focus();
    }, 100);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handlePickImage = async () => {
    // Pede permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para alterar a foto.');
      return;
    }

    // Abre a galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    // Pede permissão
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar foto.');
      return;
    }

    // Abre a câmera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFoto(result.assets[0].uri);
    }
  };

  const handlePhotoPress = () => {
    Alert.alert(
      'Alterar Foto',
      'Escolha uma opção',
      [
        { text: 'Tirar Foto', onPress: handleTakePhoto },
        { text: 'Escolher da Galeria', onPress: handlePickImage },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      // Prepare data for update
      const updateData: any = {};
      if (nome !== originalData.nome) updateData.name = nome;
      if (email !== originalData.email) updateData.email = email;
      if (telefone !== originalData.telefone) updateData.phone = telefone;
      
      // If photo changed and is a local URI, upload it
      if (foto !== originalData.foto && foto && foto.startsWith('file://')) {
        const uploadResult = await uploadService.uploadImage(foto);
        updateData.photoUrl = uploadService.getImageUrl(uploadResult.id);
      } else if (foto !== originalData.foto) {
        updateData.photoUrl = foto;
      }
      
      // Call update API
      const updatedStudent = await studentsService.update(MOCK_USER.studentId, updateData);
      
      // Update local state with server photo URL
      const newFotoUrl = updatedStudent.photoUrl || foto;
      setStudent(updatedStudent);
      setFoto(newFotoUrl);
      setOriginalData({ nome, email, telefone, foto: newFotoUrl });
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          {/* Avatar */}
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handlePhotoPress}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(nome || MOCK_USER.nome)}
                  </Text>
                </View>
              )}
              <View style={styles.editAvatarButton}>
                <Text style={styles.editAvatarText}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.changePhotoText}>Toque para alterar a foto</Text>
          </View>

          {/* Informações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            <View style={styles.infoCard}>
              {/* Nome */}
              <TouchableOpacity 
                style={styles.infoRow} 
                onPress={() => handleFieldPress('nome')}
                activeOpacity={0.7}
              >
                <Text style={styles.infoIcon}>👤</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nome</Text>
                  {editingField === 'nome' ? (
                    <TextInput
                      ref={nomeRef}
                      style={styles.input}
                      value={nome}
                      onChangeText={setNome}
                      onBlur={handleFieldBlur}
                      placeholder="Seu nome"
                      autoCapitalize="words"
                      returnKeyType="done"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{nome || 'Toque para editar'}</Text>
                  )}
                </View>
                {editingField !== 'nome' && <Text style={styles.editIcon}>✏️</Text>}
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Email */}
              <TouchableOpacity 
                style={styles.infoRow} 
                onPress={() => handleFieldPress('email')}
                activeOpacity={0.7}
              >
                <Text style={styles.infoIcon}>📧</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>E-mail</Text>
                  {editingField === 'email' ? (
                    <TextInput
                      ref={emailRef}
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      onBlur={handleFieldBlur}
                      placeholder="seu@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="done"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{email || 'Toque para editar'}</Text>
                  )}
                </View>
                {editingField !== 'email' && <Text style={styles.editIcon}>✏️</Text>}
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Telefone */}
              <TouchableOpacity 
                style={styles.infoRow} 
                onPress={() => handleFieldPress('telefone')}
                activeOpacity={0.7}
              >
                <Text style={styles.infoIcon}>📱</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  {editingField === 'telefone' ? (
                    <TextInput
                      ref={telefoneRef}
                      style={styles.input}
                      value={telefone}
                      onChangeText={setTelefone}
                      onBlur={handleFieldBlur}
                      placeholder="(11) 99999-9999"
                      keyboardType="phone-pad"
                      returnKeyType="done"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{telefone || 'Toque para editar'}</Text>
                  )}
                </View>
                {editingField !== 'telefone' && <Text style={styles.editIcon}>✏️</Text>}
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Category (not editable) */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🚗</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Categoria</Text>
                  <Text style={styles.infoValue}>{student?.desiredCategory || 'B'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Botão Salvar (só aparece quando há alterações) */}
          {hasChanges() && (
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>💾 Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Configurações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            
            <View style={styles.optionsCard}>
              <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionIcon}>🔔</Text>
                <Text style={styles.optionText}>Notificações</Text>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionIcon}>🔒</Text>
                <Text style={styles.optionText}>Alterar Senha</Text>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionIcon}>📄</Text>
                <Text style={styles.optionText}>Termos de Uso</Text>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionIcon}>❓</Text>
                <Text style={styles.optionText}>Ajuda</Text>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Sair */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Sair da Conta</Text>
          </TouchableOpacity>

          <Text style={styles.version}>PilotaJá v1.0.0</Text>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 60,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  editAvatarText: {
    fontSize: 18,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    marginTop: 2,
  },
  input: {
    fontSize: 16,
    color: '#1a1a1a',
    marginTop: 2,
    padding: 8,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  editIcon: {
    fontSize: 14,
    opacity: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 48,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  optionArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  logoutText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 24,
  },
  bottomPadding: {
    height: 40,
  },
});
