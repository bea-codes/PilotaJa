import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Instructors from './pages/Instructors';
import InstructorDetail from './pages/InstructorDetail';
import InstructorDashboard from './pages/InstructorDashboard';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/instructors/:id" element={<InstructorDetail />} />
          <Route path="/instructor-dashboard/:id" element={<InstructorDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
