import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Instrutores from './pages/Instrutores';
import InstrutorDetalhe from './pages/InstrutorDetalhe';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instrutores" element={<Instrutores />} />
          <Route path="/instrutores/:id" element={<InstrutorDetalhe />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
