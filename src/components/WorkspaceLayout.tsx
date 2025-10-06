'use client';

import { ReactNode } from 'react';
import SideNav from './SideNav';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      <SideNav />
      <main className="ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
