import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useEffect } from 'react';

import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
// import reminderService from './services/ReminderService';

import LandingPage from './pages/LandingPage';
import LanguageSelection from './pages/LanguageSelection';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MedicineReminder from './pages/MedicineReminder';
import NewsReader from './pages/NewsReader';
import MoodBased from './pages/MoodBased';
import MemoryAids from './pages/MemoryAids';
import Meditation from './pages/Meditation';
import EmergencyCalls from './pages/EmergencyCalls';
import DatabaseTest from './pages/DatabaseTest';
import VoiceAssistant from './components/VoiceAssistant';

function AppContent() {
  // const { currentLanguage } = useLanguage();

  // Temporarily disable reminder service for debugging
  /*
  useEffect(() => {
    // Start the global reminder service
    reminderService.start(currentLanguage.code);
    
    // Update language when it changes
    reminderService.updateLanguage(currentLanguage.code);
    
    console.log(`[App] Started global reminder service with language: ${currentLanguage.code}`);
    
    // Cleanup on unmount
    return () => {
      reminderService.stop();
    };
  }, [currentLanguage.code]);
  */

  return (
    <Router>
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.jpg')",
        }}
      >
        {/* Pink overlay */}
        <div className="absolute inset-0 bg-pink-500/40"></div>

        {/* Your original app content */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicine-reminder" element={<MedicineReminder />} />
            <Route path="/news-reader" element={<NewsReader />} />
            <Route path="/mood-based" element={<MoodBased />} />
            <Route path="/memory-aids" element={<MemoryAids />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/emergency-calls" element={<EmergencyCalls />} />
            <Route path="/database-test" element={<DatabaseTest />} />
          </Routes>
          <VoiceAssistant />
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
