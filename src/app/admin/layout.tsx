import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — Tushar Maurya Portfolio',
  description: 'Portfolio admin panel — manage projects, skills, and messages.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
