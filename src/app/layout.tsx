import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Tushar Maurya — Full Stack Developer & Creative Technologist',
  description: 'Portfolio of Tushar Maurya — Full stack developer specializing in immersive web experiences, 3D interfaces, React, Node.js, Python, and modern web technologies.',
  keywords: 'Tushar Maurya, Full Stack Developer, React, Next.js, Three.js, WebGL, Portfolio, Cyberpunk',
  openGraph: {
    title: 'Tushar Maurya — Full Stack Developer',
    description: 'Cinematic cyberpunk portfolio showcasing projects, skills, and creative web development.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#02020e',
              color: '#dff0ff',
              border: '1px solid rgba(0, 245, 255, 0.2)',
              borderRadius: '0',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              boxShadow: '0 0 30px rgba(0, 245, 255, 0.12)',
            },
            success: {
              iconTheme: { primary: '#00ff88', secondary: '#02020e' },
            },
            error: {
              iconTheme: { primary: '#ff0080', secondary: '#02020e' },
              style: {
                border: '1px solid rgba(255, 0, 128, 0.25)',
                boxShadow: '0 0 30px rgba(255, 0, 128, 0.12)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
