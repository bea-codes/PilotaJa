import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { instructorsService, lessonsService, Instructor } from '../services/api';
import { MOCK_USER } from '../config/user';

type Props = { navigation: any };

export default function ScheduleScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    while (dates.length < 5) {
      const date = new Date(today);
      date.setDate(today.getDate() + count);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dates.push({ day: days[dayOfWeek], date: date.getDate().toString().padStart(2, '0'), full: date.toISOString().split('T')[0] });
      }
      count++;
    }
    return dates;
  };

  const dates = getDates();
  const times = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

  useEffect(() => { loadInstructors(); }, []);

  const loadInstructors = async () => {
    try {
      const data = await instructorsService.list(MOCK_USER.drivingSchoolId);
      setInstructors(data);
    } catch (error) {
      setInstructors([
        { _id: '1', name: 'Carlos Silva', email: '', phone: '', drivingSchoolId: '' },
        { _id: '2', name: 'Maria Santos', email: '', phone: '', drivingSchoolId: '' },
        { _id: '3', name: 'João Oliveira', email: '', phone: '', drivingSchoolId: '' },
      ]);
    } finally { setLoading(false); }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !selectedInstructor) {
      Alert.alert('Atenção', 'Selecione data, horário e instrutor');
      return;
    }
    setSubmitting(true);
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const [hour, minute] = selectedTime.split(':').map(Number);
      const dateTimeLocal = new Date(year, month - 1, day, hour, minute, 0);
      
      await lessonsService.create({
        drivingSchoolId: MOCK_USER.drivingSchoolId,
        studentId: MOCK_USER.studentId,
        instructorId: selectedInstructor,
        dateTime: dateTimeLocal.toISOString(),
        duration: 50,
        type: 'practical',
      });
      Alert.alert('Aula Agendada! ✅', `Sua aula foi agendada para ${selectedDate} às ${selectedTime}`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível agendar a aula');
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Carregando...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Text style={styles.backText}>← Voltar</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Aula</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Escolha o dia</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.datesRow}>
              {dates.map((d) => (
                <TouchableOpacity key={d.full} style={[styles.dateCard, selectedDate === d.full && styles.dateCardSelected]} onPress={() => setSelectedDate(d.full)}>
                  <Text style={[styles.dateDay, selectedDate === d.full && styles.dateTextSelected]}>{d.day}</Text>
                  <Text style={[styles.dateNumber, selectedDate === d.full && styles.dateTextSelected]}>{d.date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕐 Escolha o horário</Text>
          <View style={styles.timesGrid}>
            {times.map((time) => (
              <TouchableOpacity key={time} style={[styles.timeCard, selectedTime === time && styles.timeCardSelected]} onPress={() => setSelectedTime(time)}>
                <Text style={[styles.timeText, selectedTime === time && styles.timeTextSelected]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🏫 Escolha o instrutor</Text>
          {instructors.map((instructor) => (
            <TouchableOpacity key={instructor._id} style={[styles.instructorCard, selectedInstructor === instructor._id && styles.instructorCardSelected]} onPress={() => setSelectedInstructor(instructor._id)}>
              <View style={styles.instructorAvatar}><Text style={styles.instructorAvatarText}>{instructor.name.charAt(0)}</Text></View>
              <View style={styles.instructorInfo}><Text style={styles.instructorName}>{instructor.name}</Text></View>
              {selectedInstructor === instructor._id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.scheduleButton, submitting && styles.scheduleButtonDisabled]} onPress={handleSchedule} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.scheduleButtonText}>Confirmar Agendamento</Text>}
        </TouchableOpacity>
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
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginBottom: 16 },
  datesRow: { flexDirection: 'row' },
  dateCard: { width: 64, height: 80, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 2, borderColor: 'transparent' },
  dateCardSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  dateDay: { fontSize: 14, color: '#666', marginBottom: 4 },
  dateNumber: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  dateTextSelected: { color: '#fff' },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  timeCard: { width: '30%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12, marginRight: '3%', borderWidth: 2, borderColor: 'transparent' },
  timeCardSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  timeText: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  timeTextSelected: { color: '#fff' },
  instructorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  instructorCardSelected: { borderColor: '#007AFF' },
  instructorAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  instructorAvatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  instructorInfo: { flex: 1 },
  instructorName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  checkmark: { fontSize: 24, color: '#007AFF', fontWeight: 'bold' },
  scheduleButton: { backgroundColor: '#007AFF', borderRadius: 12, padding: 18, margin: 16, alignItems: 'center' },
  scheduleButtonDisabled: { backgroundColor: '#99c9ff' },
  scheduleButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  bottomPadding: { height: 40 },
});
