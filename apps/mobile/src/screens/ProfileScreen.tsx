import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { alunosService, Aluno } from '../services/api';
import { MOCK_USER } from '../config/user';

type Props = {
  navigation: any;
  onLogout: () => void;
};

export default function ProfileScreen({ navigation, onLogout }: Props) {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Campos editáveis
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await alunosService.buscarPorId(MOCK_USER.alunoId);
      setAluno(data);
      setNome(data.nome || '');
      setEmail(data.email || '');
      setTelefone(data.telefone || '');
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      // Usa dados do mock se falhar
      setNome(MOCK_USER.nome);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      // TODO: Implementar API de atualização
      // await alunosService.atualizar(MOCK_USER.alunoId, { nome, email, telefone });
      
      // Por enquanto, só atualiza local
      setAluno(prev => prev ? { ...prev, nome, email, telefone } : null);
      setEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Restaura valores originais
    setNome(aluno?.nome || MOCK_USER.nome);
    setEmail(aluno?.email || '');
    setTelefone(aluno?.telefone || '');
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: onLogout,
        },
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
        {!editing ? (
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container}>
          {/* Avatar e Nome */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(nome || MOCK_USER.nome)}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Text style={styles.editAvatarText}>📷</Text>
              </TouchableOpacity>
            </View>
            {!editing ? (
              <>
                <Text style={styles.userName}>{nome}</Text>
                <Text style={styles.userStatus}>Aluno ativo</Text>
              </>
            ) : (
              <Text style={styles.editingLabel}>Editando perfil</Text>
            )}
          </View>

          {/* Informações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            <View style={styles.infoCard}>
              {/* Nome */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>👤</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nome</Text>
                  {editing ? (
                    <TextInput
                      style={styles.input}
                      value={nome}
                      onChangeText={setNome}
                      placeholder="Seu nome"
                      autoCapitalize="words"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{nome || 'Não informado'}</Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              {/* Email */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📧</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>E-mail</Text>
                  {editing ? (
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="seu@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{email || 'Não informado'}</Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              {/* Telefone */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📱</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  {editing ? (
                    <TextInput
                      style={styles.input}
                      value={telefone}
                      onChangeText={setTelefone}
                      placeholder="(11) 99999-9999"
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{telefone || 'Não informado'}</Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              {/* Categoria (não editável) */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🚗</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Categoria</Text>
                  <Text style={styles.infoValue}>{aluno?.categoriaDesejada || 'B'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Botões de Salvar/Cancelar quando editando */}
          {editing && (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Opções (só mostra quando não está editando) */}
          {!editing && (
            <>
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
            </>
          )}
          
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
  editButton: {
    padding: 4,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editAvatarText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  userStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  editingLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 48,
  },
  editActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#99c9ff',
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
