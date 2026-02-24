import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { aulasService, Aula } from '../services/api';
import { MOCK_USER } from '../config/user';

type Props = {
  navigation: any;
};

export default function MyLessonsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAulas();
  }, []);

  const loadAulas = async () => {
    try {
      const data = await aulasService.listar({ alunoId: MOCK_USER.alunoId });
      setAulas(data);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
      setAulas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAulas();
  }, []);

  const handleCancelar = async (aulaId: string) => {
    Alert.alert(
      'Cancelar Aula',
      'Tem certeza que deseja cancelar esta aula?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await aulasService.cancelar(aulaId);
              loadAulas(); // Recarrega a lista
              Alert.alert('Sucesso', 'Aula cancelada');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível cancelar');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const upcomingLessons = aulas.filter(a => 
    ['agendada', 'confirmada'].includes(a.status) && new Date(a.dataHora) >= new Date()
  );
  const historyLessons = aulas.filter(a => 
    !['agendada', 'confirmada'].includes(a.status) || new Date(a.dataHora) < new Date()
  );

  const getStatusBadge = (status: Aula['status']) => {
    switch (status) {
      case 'agendada':
        return { text: 'Agendada', color: '#007AFF', bg: '#e6f2ff' };
      case 'confirmada':
        return { text: 'Confirmada', color: '#4CAF50', bg: '#e8f5e9' };
      case 'realizada':
        return { text: 'Realizada', color: '#4CAF50', bg: '#e8f5e9' };
      case 'cancelada':
        return { text: 'Cancelada', color: '#f44336', bg: '#ffebee' };
      case 'falta':
        return { text: 'Falta', color: '#ff9800', bg: '#fff3e0' };
      default:
        return { text: status, color: '#666', bg: '#f5f5f5' };
    }
  };

  const getInstrutorNome = (aula: Aula): string => {
    if (typeof aula.instrutorId === 'object' && aula.instrutorId?.nome) {
      return aula.instrutorId.nome;
    }
    return 'Instrutor';
  };

  const renderLesson = (aula: Aula) => {
    const badge = getStatusBadge(aula.status);
    const isUpcoming = ['agendada', 'confirmada'].includes(aula.status);
    
    return (
      <View key={aula._id} style={styles.lessonCard}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonDateTime}>
            <Text style={styles.lessonDate}>📅 {formatDate(aula.dataHora)}</Text>
            <Text style={styles.lessonTime}>🕐 {formatTime(aula.dataHora)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.color }]}>
              {badge.text}
            </Text>
          </View>
        </View>
        
        <View style={styles.lessonBody}>
          <Text style={styles.lessonType}>
            {aula.tipo === 'pratica' ? '🚗 Aula Prática' : 
             aula.tipo === 'simulador' ? '🎮 Simulador' : '📚 Aula Teórica'}
          </Text>
          <Text style={styles.instructorName}>👨‍🏫 {getInstrutorNome(aula)}</Text>
          <Text style={styles.lessonDuration}>{aula.duracao} minutos</Text>
        </View>

        {isUpcoming && (
          <View style={styles.lessonActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('schedule')}
            >
              <Text style={styles.actionButtonText}>Reagendar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelar(aula._id)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando aulas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Aulas</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'upcoming' && styles.tabTextActive
          ]}>
            Próximas ({upcomingLessons.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'history' && styles.tabTextActive
          ]}>
            Histórico ({historyLessons.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Aulas */}
      <ScrollView 
        style={styles.lessonsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'upcoming' ? (
          upcomingLessons.length > 0 ? (
            upcomingLessons.map(renderLesson)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Nenhuma aula agendada</Text>
              <TouchableOpacity 
                style={styles.scheduleNowButton}
                onPress={() => navigation.navigate('schedule')}
              >
                <Text style={styles.scheduleNowText}>Agendar Agora</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          historyLessons.length > 0 ? (
            historyLessons.map(renderLesson)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>Nenhuma aula no histórico</Text>
            </View>
          )
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007AFF',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  lessonsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonDateTime: {
    flexDirection: 'row',
  },
  lessonDate: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  lessonTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lessonBody: {
    marginBottom: 12,
  },
  lessonType: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    color: '#666',
  },
  lessonActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff5f5',
  },
  cancelButtonText: {
    color: '#f44336',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  scheduleNowButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  scheduleNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
