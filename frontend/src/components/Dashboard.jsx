import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Database, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const Dashboard = ({ appData, onUpdate, isLoading }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = [
    {
      label: 'Total Apps',
      value: formatNumber(appData.currentAppList?.length || 0),
      icon: Database,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30'
    },
    {
      label: 'New Apps',
      value: formatNumber(appData.changes?.addedApps?.length || 0),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'Removed Apps',
      value: formatNumber(appData.changes?.removedApps?.length || 0),
      icon: TrendingDown,
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Dashboard</h2>
          <p className="text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>Monitor Steam AppID changes in real-time</p>
        </div>
        <Button
          data-testid="update-appid-btn"
          onClick={onUpdate}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-6 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Updating...' : 'Update AppID List'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`p-6 rounded-2xl border backdrop-blur-sm ${stat.bgColor} ${stat.borderColor} shadow-xl`}
              data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
              <p className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 backdrop-blur-sm shadow-xl"
        data-testid="last-update-info"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Last Update</h3>
        </div>
        <p className="text-2xl font-bold text-cyan-300" style={{ fontFamily: 'Inter, sans-serif' }}>
          {formatDate(appData.lastUpdated)}
        </p>
        {appData.lastUpdated && (
          <p className="text-sm text-slate-400 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Data is stored locally using IndexedDB
          </p>
        )}
      </motion.div>
    </div>
  );
};