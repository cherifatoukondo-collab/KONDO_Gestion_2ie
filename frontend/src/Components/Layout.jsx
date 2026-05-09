import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ marginLeft: '260px', flex: 1, padding: '2rem', background: '#f4f6f9' }}>
          <Outlet />
        </main>
      </div>
      <div style={{ marginLeft: '260px' }}>
        <Footer />
      </div>
    </div>
  );
}
