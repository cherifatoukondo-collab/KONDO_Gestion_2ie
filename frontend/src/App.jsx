import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute   from './Components/ProtectedRoute';
import Layout           from './Components/Layout';
import LoginPage        from './Pages/LoginPage';
import Dashboard        from './Pages/Dashboard';
import Ecoles from './Pages/Ecoles';
import Ajouter from './Pages/Ajouter';
import AnneesAcademiques from './Pages/Annees-academiques';
import Certificat from './Pages/Certificat';
import Civilites from './Pages/Civilites';
import Decisions from './Pages/Decisions';
import Cycles from './Pages/Cycles';
import Filieres from './Pages/Filieres';
import Parcours from './Pages/Parcours';
import Pays from './Pages/Pays';
import Specialites from './Pages/Specialites';
import Liste from './Pages/Liste';
import Resultats from './Pages/Resultats';
import Trombi from './Pages/Trombi';
import Inscriptions from './Pages/Inscriptions';



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Publique */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protégées avec sidebar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Ressources */}
              <Route path="/ressources/ecoles"             element={<Ecoles />} />
              <Route path="/ressources/filieres"           element={<Filieres />} />
              <Route path="/ressources/cycles"             element={<Cycles />} />
              <Route path="/ressources/specialites"        element={<Specialites />} />
              <Route path="/ressources/civilites"          element={<Civilites />} />
              <Route path="/ressources/pays"               element={<Pays />} />
              <Route path="/ressources/decisions"          element={<Decisions />} />
              <Route path="/ressources/annees-academiques" element={<AnneesAcademiques />} />
              <Route path="/ressources/parcours"           element={<Parcours />} />

              {/* Gestion Etudiants */}
              <Route path="/etudiants/ajouter"      element={<Ajouter />} />
              <Route path="/etudiants/resultats"    element={<Resultats />} />
              <Route path="/etudiants/trombi"       element={<Trombi />} />
              <Route path="/etudiants/liste"        element={<Liste />} />
              <Route path="/etudiants/certificat"   element={<Certificat />} />
              <Route path="/etudiants/inscriptions" element={<Inscriptions />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
