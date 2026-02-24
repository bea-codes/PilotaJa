import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lessonsService, Lesson } from '../services/api';
import { MOCK_USER } from '../config/user';

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
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

  const onRefresh = () => {
    setRefreshing(true);
    loadAulas();
  };

  // Calculate stats
  const upcomingLessons = lessons.filter(l => 
    ['scheduled', 'confirmed'].includes(l.status) && new Date(l.dateTime) >= new Date()
  );
  const completedLessons = lessons.filter(l => l.status === 'completed');
  const nextLesson = upcomingLessons.length > 0 ? upcomingLessons[0] : null;

  const stats = {
    completed: completedLessons.length,
    remaining: Math.max(0, 20 - completedLessons.length), // Assuming 20 lessons needed
    total: 20,
    upcoming: upcomingLessons.length,
  };

  const getInstrutorNome = (aula: Aula): string => {
    if (typeof aula.instrutorId === 'object' && aula.instrutorId?.nome) {
      return aula.instrutorId.nome;
    }
    return 'Instrutor';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dayStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (date.toDateString() === today.toDateString()) {
      dayStr = 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dayStr = 'Amanhã';
    }

    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dayStr}, ${timeStr}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {MOCK_USER.nome}! 👋</Text>
            <Text style={styles.subGreeting}>
              {stats.upcoming > 0 
                ? `Você tem ${stats.upcoming} aula${stats.upcoming > 1 ? 's' : ''} agendada${stats.upcoming > 1 ? 's' : ''}`
                : 'Pronto para agendar uma aula?'}
            </Text>
          </View>
        </View>

        {/* Próxima Aula */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Próxima Aula</Text>
          {loading ? (
            <ActivityIndicator color="#007AFF" style={{ marginVertical: 20 }} />
          ) : nextLesson ? (
            <>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonDate}>{formatDateTime(nextLesson.dateTime)}</Text>
                <Text style={styles.lessonDetail}>
                  {nextLesson.type === 'practical' ? '🚗 Aula Prática' : 
                   nextLesson.type === 'simulator' ? '🎮 Simulador' : '📚 Aula Teórica'}
                </Text>
                <Text style={styles.lessonDetail}>👨‍🏫 {getInstructorName(nextLesson)}</Text>
                <Text style={styles.lessonDetail}>⏱️ {nextLesson.duration} minutos</Text>
              </View>
              <TouchableOpacity 
                style={styles.cardButton}
                onPress={() => navigation.navigate('lessons')}
              >
                <Text style={styles.cardButtonText}>Ver detalhes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.noLessonText}>Nenhuma aula agendada</Text>
              <TouchableOpacity 
                style={styles.cardButton}
                onPress={() => navigation.navigate('schedule')}
              >
                <Text style={styles.cardButtonText}>Agendar agora</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Progresso */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Seu Progresso</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(100, (stats.completed / stats.total) * 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {stats.completed} de {stats.total} aulas concluídas
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.remaining}</Text>
              <Text style={styles.statLabel}>Restantes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.upcoming}</Text>
              <Text style={styles.statLabel}>Agendadas</Text>
            </View>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={styles.actionsContainer}>
          {/* Primeira linha - ações principais */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('schedule')}
            >
              <Text style={styles.actionIcon}>📆</Text>
              <Text style={styles.actionText}>Agendar Aula</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('lessons')}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>Minhas Aulas</Text>
            </TouchableOpacity>
          </View>

          {/* Segunda linha - ações secundárias */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Suporte</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('profile')}
            >
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  lessonInfo: {
    marginBottom: 16,
  },
  lessonDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  lessonDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  noLessonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  cardButton: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 8,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
