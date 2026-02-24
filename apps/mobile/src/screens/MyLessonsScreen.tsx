import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

type Props = {
  navigation: any;
};

type Lesson = {
  id: string;
  date: string;
  time: string;
  instructor: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  rating?: number;
};

export default function MyLessonsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  // Mock data
  const lessons: Lesson[] = [
    { id: '1', date: '24/02', time: '15:00', instructor: 'Carlos Silva', status: 'upcoming' },
    { id: '2', date: '26/02', time: '10:00', instructor: 'Maria Santos', status: 'upcoming' },
    { id: '3', date: '28/02', time: '14:00', instructor: 'Carlos Silva', status: 'upcoming' },
    { id: '4', date: '20/02', time: '09:00', instructor: 'João Oliveira', status: 'completed', rating: 5 },
    { id: '5', date: '18/02', time: '15:00', instructor: 'Carlos Silva', status: 'completed', rating: 4 },
    { id: '6', date: '15/02', time: '10:00', instructor: 'Maria Santos', status: 'completed', rating: 5 },
    { id: '7', date: '12/02', time: '14:00', instructor: 'Carlos Silva', status: 'cancelled' },
  ];

  const upcomingLessons = lessons.filter(l => l.status === 'upcoming');
  const historyLessons = lessons.filter(l => l.status !== 'upcoming');

  const getStatusBadge = (status: Lesson['status']) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Agendada', color: '#007AFF', bg: '#e6f2ff' };
      case 'completed':
        return { text: 'Concluída', color: '#4CAF50', bg: '#e8f5e9' };
      case 'cancelled':
        return { text: 'Cancelada', color: '#f44336', bg: '#ffebee' };
    }
  };

  const renderLesson = (lesson: Lesson) => {
    const badge = getStatusBadge(lesson.status);
    return (
      <View key={lesson.id} style={styles.lessonCard}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonDateTime}>
            <Text style={styles.lessonDate}>📅 {lesson.date}</Text>
            <Text style={styles.lessonTime}>🕐 {lesson.time}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.color }]}>
              {badge.text}
            </Text>
          </View>
        </View>
        
        <View style={styles.lessonBody}>
          <Text style={styles.instructorName}>👨‍🏫 {lesson.instructor}</Text>
          {lesson.rating && (
            <Text style={styles.rating}>
              {'⭐'.repeat(lesson.rating)}{'☆'.repeat(5 - lesson.rating)}
            </Text>
          )}
        </View>

        {lesson.status === 'upcoming' && (
          <View style={styles.lessonActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Reagendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

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
      <ScrollView style={styles.lessonsContainer}>
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
          historyLessons.map(renderLesson)
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
  instructorName: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    letterSpacing: 2,
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
