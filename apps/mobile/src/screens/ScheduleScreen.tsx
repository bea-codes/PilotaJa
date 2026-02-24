import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

type Props = {
  navigation: any;
};

export default function ScheduleScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

  // Mock data
  const dates = [
    { day: 'Seg', date: '24', full: '2026-02-24' },
    { day: 'Ter', date: '25', full: '2026-02-25' },
    { day: 'Qua', date: '26', full: '2026-02-26' },
    { day: 'Qui', date: '27', full: '2026-02-27' },
    { day: 'Sex', date: '28', full: '2026-02-28' },
  ];

  const times = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

  const instructors = [
    { id: '1', name: 'Carlos Silva', rating: 4.9, lessons: 234 },
    { id: '2', name: 'Maria Santos', rating: 4.8, lessons: 189 },
    { id: '3', name: 'João Oliveira', rating: 4.7, lessons: 156 },
  ];

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !selectedInstructor) {
      Alert.alert('Atenção', 'Selecione data, horário e instrutor');
      return;
    }
    Alert.alert(
      'Aula Agendada! ✅',
      `Sua aula foi agendada para ${selectedDate} às ${selectedTime}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Seleção de Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Escolha o dia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.datesRow}>
            {dates.map((d) => (
              <TouchableOpacity
                key={d.full}
                style={[
                  styles.dateCard,
                  selectedDate === d.full && styles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(d.full)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === d.full && styles.dateTextSelected,
                ]}>{d.day}</Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === d.full && styles.dateTextSelected,
                ]}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Seleção de Horário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕐 Escolha o horário</Text>
        <View style={styles.timesGrid}>
          {times.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.timeCardSelected,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[
                styles.timeText,
                selectedTime === time && styles.timeTextSelected,
              ]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Seleção de Instrutor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍🏫 Escolha o instrutor</Text>
        {instructors.map((instructor) => (
          <TouchableOpacity
            key={instructor.id}
            style={[
              styles.instructorCard,
              selectedInstructor === instructor.id && styles.instructorCardSelected,
            ]}
            onPress={() => setSelectedInstructor(instructor.id)}
          >
            <View style={styles.instructorAvatar}>
              <Text style={styles.instructorAvatarText}>
                {instructor.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>{instructor.name}</Text>
              <Text style={styles.instructorStats}>
                ⭐ {instructor.rating} • {instructor.lessons} aulas
              </Text>
            </View>
            {selectedInstructor === instructor.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Agendar */}
      <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
        <Text style={styles.scheduleButtonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  datesRow: {
    flexDirection: 'row',
  },
  dateCard: {
    width: 64,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dateDay: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  dateTextSelected: {
    color: '#fff',
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeCardSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timeTextSelected: {
    color: '#fff',
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  instructorCardSelected: {
    borderColor: '#007AFF',
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructorAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  instructorStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  checkmark: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    margin: 16,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
