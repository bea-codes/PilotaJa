import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { studentsService, uploadService, Student } from '../services/api';
import { UserSession } from '../services/auth';

type Props = {
  navigation: any;
  session: UserSession;
  onLogout: () => void;
};

type EditableField = 'nome' | 'email' | 'telefone' | null;

export default function ProfileScreen({ navigation, session, onLogout }: Props) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  
  const [originalData, setOriginalData] = useState({ nome: '', email: '', telefone: '', foto: null as string | null });
  const [editingField, setEditingField] = useState<EditableField>(null);
  
  const nomeRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const telefoneRef = useRef<TextInput>(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      if (!session.studentId) {
        setNome(session.profile?.name || '');
        setOriginalData({ nome: session.profile?.name || '', email: '', telefone: '', foto: null });
        return;
      }
      const data = await studentsService.getById(session.studentId);
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
      setNome(session.profile?.name || '');
      setOriginalData({ nome: session.profile?.name || '', email: '', telefone: '', foto: null });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return nome !== originalData.nome || 
           email !== originalData.email || 
           telefone !== originalData.telefone ||
           foto !== originalData.foto;
  };

  const handleFieldPress = (field: EditableField) => {
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para alterar a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar foto.');
      return;
    }

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
    Alert.alert('Alterar Foto', 'Escolha uma opção', [
      { text: 'Tirar Foto', onPress: handleTakePhoto },
      { text: 'Escolher da Galeria', onPress: handlePickImage },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório');
      return;
    }

    if (!session.studentId) {
      Alert.alert('Erro', 'Sessão inválida');
      return;
    }

    setSaving(true);
    try {
      const updateData: any = {};
      if (nome !== originalData.nome) updateData.name = nome;
      if (email !== originalData.email) updateData.email = email;
      if (telefone !== originalData.telefone) updateData.phone = telefone;
      
      if (foto !== originalData.foto && foto && !foto.startsWith('http')) {
        const uploadResult = await uploadService.uploadImage(foto);
        updateData.photoUrl = uploadService.getImageUrl(uploadResult.id);
      } else if (foto !== originalData.foto && foto) {
        updateData.photoUrl = foto;
      }
      
      const updatedStudent = await studentsService.update(session.studentId, updateData);
      
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
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onLogout },
    ]);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePhotoPress} style={styles.avatarContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(nome || 'U')}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{nome}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <View style={styles.infoCard}>
            {/* Nome */}
            <TouchableOpacity style={styles.infoRow} onPress={() => handleFieldPress('nome')}>
              <Text style={styles.infoIcon}>👤</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                {editingField === 'nome' ? (
                  <TextInput
                    ref={nomeRef}
                    style={styles.infoInput}
                    value={nome}
                    onChangeText={setNome}
                    onBlur={handleFieldBlur}
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.infoValue}>{nome}</Text>
                )}
              </View>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Email */}
            <TouchableOpacity style={styles.infoRow} onPress={() => handleFieldPress('email')}>
              <Text style={styles.infoIcon}>📧</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>E-mail</Text>
                {editingField === 'email' ? (
                  <TextInput
                    ref={emailRef}
                    style={styles.infoInput}
                    value={email}
                    onChangeText={setEmail}
                    onBlur={handleFieldBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.infoValue}>{email || 'Não informado'}</Text>
                )}
              </View>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Telefone */}
            <TouchableOpacity style={styles.infoRow} onPress={() => handleFieldPress('telefone')}>
              <Text style={styles.infoIcon}>📱</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                {editingField === 'telefone' ? (
                  <TextInput
                    ref={telefoneRef}
                    style={styles.infoInput}
                    value={telefone}
                    onChangeText={setTelefone}
                    onBlur={handleFieldBlur}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{telefone || 'Não informado'}</Text>
                )}
              </View>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Categoria (não editável) */}
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🚗</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Categoria</Text>
                <Text style={styles.infoValue}>{student?.desiredCategory || 'B'}</Text>
              </View>
            </View>
          </View>
        </View>

        {hasChanges() && (
          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={styles.menuText}>Alterar Senha</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuText}>Notificações</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuText, styles.logoutText]}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#007AFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerSpacer: { width: 60 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 12, color: '#666' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  avatarSection: { alignItems: 'center', paddingVertical: 24, backgroundColor: '#007AFF' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 14, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  editBadgeText: { fontSize: 14 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 12, textTransform: 'uppercase' },
  infoCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  infoValue: { fontSize: 16, color: '#1a1a1a' },
  infoInput: { fontSize: 16, color: '#1a1a1a', padding: 0, margin: 0, borderBottomWidth: 1, borderBottomColor: '#007AFF' },
  editIcon: { fontSize: 14, opacity: 0.5 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 48 },
  saveButton: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 8, alignItems: 'center' },
  saveButtonDisabled: { backgroundColor: '#a5d6a7' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  menuCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 16, color: '#1a1a1a' },
  menuArrow: { fontSize: 20, color: '#ccc' },
  logoutText: { color: '#f44336' },
  bottomPadding: { height: 40 },
});
