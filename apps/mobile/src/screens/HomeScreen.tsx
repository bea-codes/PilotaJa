import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  // Mock data
  const nextLesson = {
    date: 'Hoje, 15:00',
    instructor: 'Carlos Silva',
    vehicle: 'Fiat Mobi - ABC-1234',
  };

  const stats = {
    completed: 12,
    remaining: 8,
    total: 20,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Cassio! 👋</Text>
          <Text style={styles.subGreeting}>Pronto para mais uma aula?</Text>
        </View>
      </View>

      {/* Próxima Aula */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Próxima Aula</Text>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonDate}>{nextLesson.date}</Text>
          <Text style={styles.lessonDetail}>👨‍🏫 {nextLesson.instructor}</Text>
          <Text style={styles.lessonDetail}>🚗 {nextLesson.vehicle}</Text>
        </View>
        <TouchableOpacity style={styles.cardButton}>
          <Text style={styles.cardButtonText}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>

      {/* Progresso */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Seu Progresso</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(stats.completed / stats.total) * 100}%` }
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
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Aproveitamento</Text>
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

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 60,
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
    margin: '2%',
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
