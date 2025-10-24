import { useState } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Navbar } from './Navbar/Navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <Navbar isCollapsed={isCollapsed} />
      
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          isCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
