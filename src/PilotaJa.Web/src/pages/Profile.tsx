import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IMaskInput } from 'react-imask';

// Mock user data - will come from auth later
const mockUser = {
  id: '3f9753ac-c27d-41f9-900e-be71732d2b0d',
  name: 'Ana Costa',
  email: 'ana.costa@email.com',
  phone: '(11) 98888-1111',
  taxId: '123.456.789-00',
  dateOfBirth: '1995-05-15',
  photoUrl: null as string | null,
};

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(mockUser);

  const handleSave = () => {
    setUser(form);
    setEditing(false);
    // TODO: API call to save
    alert('Perfil atualizado! (mock)');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const calculateAge = (dateStr: string) => {
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="PilotaJá" className="h-10" />
          </Link>
          <Link to="/" className="text-gray-400 hover:text-white">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl p-8">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-4">
              {user.photoUrl 
                ? <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                : '👤'
              }
            </div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400">Aluno desde 2024</p>
          </div>

          {/* Form / Display */}
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Nome completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Telefone</label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={form.phone}
                  unmask={false}
                  onAccept={(value) => setForm({ ...form, phone: value })}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">CPF</label>
                <IMaskInput
                  mask="000.000.000-00"
                  value={form.taxId}
                  unmask={false}
                  onAccept={(value) => setForm({ ...form, taxId: value })}
                  placeholder="000.000.000-00"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Data de nascimento</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  💾 Salvar
                </button>
                <button
                  onClick={() => { setForm(user); setEditing(false); }}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">📧 E-mail</span>
                <span className="text-white">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">📱 Telefone</span>
                <span className="text-white">{user.phone}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">🆔 CPF</span>
                <span className="text-white">{user.taxId}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">🎂 Nascimento</span>
                <span className="text-white">
                  {formatDate(user.dateOfBirth)} ({calculateAge(user.dateOfBirth)} anos)
                </span>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mt-6"
              >
                ✏️ Editar Perfil
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link 
            to="/instructors"
            className="bg-gray-800 hover:bg-gray-750 rounded-xl p-6 text-center transition"
          >
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-white font-medium">Buscar Instrutor</div>
          </Link>
          <Link 
            to="/my-appointments"
            className="bg-gray-800 hover:bg-gray-750 rounded-xl p-6 text-center transition"
          >
            <div className="text-3xl mb-2">📅</div>
            <div className="text-white font-medium">Minhas Aulas</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
