import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Line 1: Logo & Main Info */}
        <div className="footer-line footer-line-1">
          <div className="footer-brand">
            <i className="bi bi-mortarboard-fill"></i>
            <span className="footer-title">2IE - Institut International d'Ingénierie de l'Eau et de l'Environnement</span>
          </div>
          <div className="footer-contact">
            <span><i className="bi bi-telephone me-1"></i>+226 259863148</span>
            <span className="separator">|</span>
            <span><i className="bi bi-envelope me-1"></i>contact@2ie.org</span>
          </div>
        </div>

        {/* Line 2: Additional Info */}
        <div className="footer-line footer-line-2">
          <span><i className="bi bi-geo-alt me-1"></i>Ouagadougou, Burkina Faso</span>
          <span className="separator">•</span>
          <span><i className="bi bi-globe me-1"></i>www.2ie.org</span>
          <span className="separator">•</span>
          <span><span className="badge bg-primary">v1.0.0</span></span>
        </div>

        {/* Line 3: Copyright & Legal */}
        <div className="footer-line footer-line-3">
          <span className="footer-copyright">
            © {currentYear} 2IE. Tous droits réservés.
          </span>
          <div className="footer-links">
            <a href="#" className="footer-link">Politique de confidentialité</a>
            <span className="separator">•</span>
            <a href="#" className="footer-link">Conditions</a>
            <span className="separator">•</span>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
