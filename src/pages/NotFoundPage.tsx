import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 'var(--space-4xl) var(--space-xl)',
      background: 'var(--color-cream)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        fontSize: '12rem',
        fontWeight: '900',
        lineHeight: '1',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-gold)',
        opacity: 0.1,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        404
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <h1 style={{
          fontSize: 'var(--text-4xl)',
          color: 'var(--color-black)',
          fontFamily: 'var(--font-display)',
          marginBottom: 'var(--space-md)'
        }}>Oups, vous vous êtes égaré(e)</h1>
        
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--color-gray-500)',
          marginBottom: 'var(--space-2xl)',
          lineHeight: '1.6'
        }}>
          La création ou la page que vous cherchez n'existe pas ou a été déplacée.
          Mais rassurez-vous, de nombreuses autres merveilles vous attendent.
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn--primary btn--lg">
            Retourner à l'accueil
          </Link>
          <Link to="/creations" className="btn btn--outline btn--lg">
            Voir nos créations
          </Link>
        </div>
      </div>
    </div>
  );
}
