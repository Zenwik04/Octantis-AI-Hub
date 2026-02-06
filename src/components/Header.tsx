import React from 'react';
import { Hexagon, Bell, Settings, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-octantis-800 bg-octantis-950/80 backdrop-blur-md print:hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Hexagon className="h-5 w-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Octantis <span className="text-blue-400">AI-Hub</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="text-white hover:text-blue-400 transition-colors">Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Proyectos</a>
          <a href="#" className="hover:text-white transition-colors">Insights</a>
          <a href="#" className="hover:text-white transition-colors">Reportes</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1px]">
            <div className="h-full w-full rounded-full bg-octantis-950 flex items-center justify-center">
               <User className="h-4 w-4 text-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};