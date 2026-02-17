import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

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
          <Link to="/instructors" className="text-gray-400 hover:text-white">
            ← Voltar
          </Link>
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
              <h2 className="text-xl font-bold text-white mb-3">Disponibilidade</h2>
              <ul className="space-y-1 text-gray-400">
                {instructor.availabilities.map((a, i) => (
                  <li key={i}>
                    <strong>{weekDays[a.dayOfWeek]}:</strong> {a.startTime} - {a.endTime}
                  </li>
                ))}
              </ul>
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
