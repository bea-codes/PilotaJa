import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { api } from '../services/api';

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface InstructorDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseCategory: string;
  hourlyRate: number;
  photoUrl?: string;
  bio?: string;
  rating: number;
  totalLessons: number;
  city: string;
  state: string;
  serviceRadiusKm: number;
  availabilities: Availability[];
}

interface Appointment {
  id: string;
  studentName: string;
  dateTime: string;
  durationMinutes: number;
  status: string;
}

interface AppointmentsResponse {
  appointments: Appointment[];
  totalCount: number;
}

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const weekDaysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function InstructorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);

  const { data: instructor, isLoading, error } = useQuery({
    queryKey: ['instructor', id],
    queryFn: () => api.get<InstructorDetail>(`/api/instructors/${id}`).then(r => r.data)
  });

  // Fetch appointments for the 7-day window
  const { data: appointmentsData } = useQuery({
    queryKey: ['instructor-appointments', id],
    queryFn: () => api.get<AppointmentsResponse>(`/api/instructors/${id}/appointments`).then(r => r.data),
    enabled: !!id
  });

  // Generate 7 days: 3 past + today + 3 future
  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointmentsData?.appointments.forEach(apt => {
      const dateKey = apt.dateTime.split('T')[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(apt);
    });
    return map;
  }, [appointmentsData]);

  const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
  const isToday = (date: Date) => formatDateKey(date) === formatDateKey(new Date());
  const isPast = (date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0));

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !instructor) return;
    
    setBooking(true);
    try {
      const dateTime = `${selectedDate}T${selectedTime}:00`;
      await api.post('/api/appointments', {
        instructorId: instructor.id,
        studentId: '00000000-0000-0000-0000-000000000001', // TODO: logged user
        dateTime,
        durationMinutes: 50
      });
      alert('Agendamento criado! Aguardando confirmação do instrutor.');
      navigate('/instructors');
    } catch (err) {
      alert('Erro ao criar agendamento');
    } finally {
      setBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">Erro ao carregar instrutor</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="PilotaJá" className="h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to={`/instructor-dashboard/${id}`} className="text-yellow-400 hover:text-yellow-300 text-sm">
              🔧 Dashboard
            </Link>
            <Link to="/instructors" className="text-gray-400 hover:text-white">
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl">
              {instructor.photoUrl 
                ? <img src={instructor.photoUrl} alt={instructor.name} className="w-full h-full rounded-full object-cover" />
                : '👤'
              }
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{instructor.name}</h1>
              <p className="text-gray-400">📍 {instructor.city}, {instructor.state}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">⭐ {instructor.rating.toFixed(1)}</div>
              <div className="text-gray-400 text-sm">Avaliação</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{instructor.totalLessons}</div>
              <div className="text-gray-400 text-sm">Aulas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">R$ {instructor.hourlyRate.toFixed(2)}</div>
              <div className="text-gray-400 text-sm">por hora</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            {instructor.bio && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-3">Sobre</h2>
                <p className="text-gray-400">{instructor.bio}</p>
              </div>
            )}

            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-3">Informações</h2>
              <ul className="space-y-2 text-gray-400">
                <li><strong>CNH:</strong> Categoria {instructor.licenseCategory}</li>
                <li><strong>Atende em:</strong> até {instructor.serviceRadiusKm}km</li>
                <li><strong>Telefone:</strong> {instructor.phone}</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-3">Horário de Trabalho</h2>
              <ul className="space-y-1 text-gray-400 text-sm">
                {instructor.availabilities.map((a, i) => (
                  <li key={i}>
                    <strong>{weekDays[a.dayOfWeek]}:</strong> {a.startTime} - {a.endTime}
                  </li>
                ))}
              </ul>
            </div>

            {/* 7-day Agenda */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">📅 Agenda (7 dias)</h2>
              <div className="space-y-3">
                {weekDates.map(date => {
                  const dateKey = formatDateKey(date);
                  const dayAppointments = appointmentsByDate.get(dateKey) || [];
                  const past = isPast(date);
                  const today = isToday(date);
                  
                  return (
                    <div 
                      key={dateKey} 
                      className={`rounded-lg p-3 ${today ? 'bg-blue-900/30 border border-blue-500' : past ? 'bg-gray-700/50 opacity-60' : 'bg-gray-700'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${today ? 'text-blue-400' : 'text-white'}`}>
                          {weekDaysShort[date.getDay()]} {date.getDate()}/{date.getMonth() + 1}
                          {today && <span className="ml-2 text-xs bg-blue-500 px-2 py-0.5 rounded">HOJE</span>}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {dayAppointments.length === 0 ? 'Livre' : `${dayAppointments.length} aula${dayAppointments.length > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      
                      {dayAppointments.length > 0 && (
                        <div className="space-y-1">
                          {dayAppointments
                            .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
                            .map(apt => {
                              const time = new Date(apt.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                              const statusColor = apt.status === 'Confirmed' ? 'text-green-400' : apt.status === 'Pending' ? 'text-yellow-400' : 'text-gray-400';
                              const statusIcon = apt.status === 'Confirmed' ? '✅' : apt.status === 'Pending' ? '⏳' : apt.status === 'Completed' ? '🏁' : '❌';
                              return (
                                <div key={apt.id} className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-300">{time}</span>
                                  <span className={statusColor}>{statusIcon}</span>
                                  <span className="text-gray-400 truncate">{apt.durationMinutes}min</span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking */}
          <div className="bg-gray-800 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">📅 Agendar Aula</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Data</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Horário</label>
                <input 
                  type="time" 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between text-gray-400">
                  <span>Duração</span>
                  <span>50 minutos</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg mt-2">
                  <span>Total</span>
                  <span className="text-green-400">R$ {(instructor.hourlyRate * 50/60).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || booking}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition"
              >
                {booking ? 'Agendando...' : '📅 Confirmar Agendamento'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
