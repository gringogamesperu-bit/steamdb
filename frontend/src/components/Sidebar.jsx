import React from 'react';
import { motion } from 'framer-motion';
import { Home, GitCompare, Database, SteamIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'changes', label: 'Changes', icon: GitCompare },
  { id: 'browser', label: 'App Browser', icon: Database },
];

export const Sidebar = ({ activeSection, onSectionChange }) => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-cyan-500/20 flex flex-col"
    >
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Steam Tracker</h1>
            <p className="text-xs text-cyan-400" style={{ fontFamily: 'Inter, sans-serif' }}>AppID Monitor</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              data-testid={`nav-${item.id}`}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-cyan-500/20">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20">
          <p className="text-xs text-slate-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Data Source</p>
          <p className="text-sm text-cyan-300 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Steam Web API</p>
        </div>
      </div>
    </motion.div>
  );
};