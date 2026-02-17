import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone?: string;
  dateTime: string;
  durationMinutes: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  price: number;
  notes?: string;
  meetingAddress?: string;
  createdAt: string;
}

interface AppointmentsResponse {
  appointments: Appointment[];
  totalCount: number;
}

const statusColors = {
  Pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  Confirmed: 'bg-green-500/20 text-green-300 border-green-500/50',
  Completed: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  Cancelled: 'bg-red-500/20 text-red-300 border-red-500/50'
};

const statusLabels = {
  Pending: '⏳ Pendente',
  Confirmed: '✅ Confirmado',
  Completed: '🏁 Concluído',
  Cancelled: '❌ Cancelado'
};

export default function InstructorDashboard() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['instructor-appointments', id],
    queryFn: () => api.get<AppointmentsResponse>(`/api/instructors/${id}/appointments`).then(r => r.data)
  });

  const updateStatus = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: string }) =>
      api.patch(`/api/appointments/${appointmentId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-appointments', id] });
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingAppointments = data?.appointments.filter(a => a.status === 'Pending') || [];
  const confirmedAppointments = data?.appointments.filter(a => a.status === 'Confirmed') || [];
  const pastAppointments = data?.appointments.filter(a => ['Completed', 'Cancelled'].includes(a.status)) || [];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="PilotaJá" className="h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Dashboard do Instrutor</span>
            <Link to="/instructors" className="text-blue-400 hover:text-blue-300">
              Ver como aluno →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">📋 Meus Agendamentos</h1>
        <p className="text-gray-400 mb-8">Gerencie suas aulas e confirme solicitações</p>

        {isLoading && (
          <div className="text-center text-gray-400 py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            Carregando...
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
            Erro ao carregar agendamentos. Verifique o ID do instrutor.
          </div>
        )}

        {/* Pending - requires action */}
        {pendingAppointments.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              ⏳ Aguardando Confirmação ({pendingAppointments.length})
            </h2>
            <div className="grid gap-4">
              {pendingAppointments.map(appointment => (
                <div key={appointment.id} className="bg-gray-800 rounded-xl p-6 border-l-4 border-yellow-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">👤</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{appointment.studentName}</h3>
                          {appointment.studentPhone && (
                            <p className="text-gray-400 text-sm">📞 {appointment.studentPhone}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-400 space-y-1">
                        <p>📅 {formatDate(appointment.dateTime)}</p>
                        <p>⏱️ {appointment.durationMinutes} minutos</p>
                        {appointment.meetingAddress && <p>📍 {appointment.meetingAddress}</p>}
                        {appointment.notes && <p className="italic">"{appointment.notes}"</p>}
                      </div>
                      <p className="text-green-400 font-bold mt-2">R$ {appointment.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus.mutate({ appointmentId: appointment.id, status: 'Confirmed' })}
                        disabled={updateStatus.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-50"
                      >
                        ✅ Confirmar
                      </button>
                      <button
                        onClick={() => updateStatus.mutate({ appointmentId: appointment.id, status: 'Cancelled' })}
                        disabled={updateStatus.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-50"
                      >
                        ❌ Recusar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Confirmed - upcoming */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
            ✅ Confirmados ({confirmedAppointments.length})
          </h2>
          {confirmedAppointments.length === 0 ? (
            <p className="text-gray-500">Nenhuma aula confirmada</p>
          ) : (
            <div className="grid gap-4">
              {confirmedAppointments.map(appointment => (
                <div key={appointment.id} className="bg-gray-800 rounded-xl p-6 border-l-4 border-green-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{appointment.studentName}</h3>
                      <div className="text-gray-400">
                        <p>📅 {formatDate(appointment.dateTime)}</p>
                        {appointment.meetingAddress && <p>📍 {appointment.meetingAddress}</p>}
                      </div>
                      <p className="text-green-400 font-bold mt-1">R$ {appointment.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => updateStatus.mutate({ appointmentId: appointment.id, status: 'Completed' })}
                      disabled={updateStatus.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-50"
                    >
                      🏁 Marcar Concluída
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        {pastAppointments.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-400 mb-4">📜 Histórico</h2>
            <div className="grid gap-3">
              {pastAppointments.slice(0, 10).map(appointment => (
                <div key={appointment.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-white">{appointment.studentName}</span>
                    <span className="text-gray-500 ml-3">{formatDate(appointment.dateTime)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {data && data.appointments.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">Nenhum agendamento ainda</h2>
            <p className="text-gray-400">Quando alunos solicitarem aulas, elas aparecerão aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}
