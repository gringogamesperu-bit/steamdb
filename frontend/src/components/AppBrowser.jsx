import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Virtuoso } from 'react-virtuoso';
import { exportToJSON, exportToCSV } from '@/utils/export';
import { toast } from 'sonner';

export const AppBrowser = ({ appData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('name');

  const apps = appData.currentAppList || [];

  const filteredAndSortedApps = useMemo(() => {
    let filtered = apps;
    
    if (searchTerm) {
      filtered = apps.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.appid.toString().includes(searchTerm)
      );
    }
    
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        return sortOrder === 'asc'
          ? a.appid - b.appid
          : b.appid - a.appid;
      }
    });
    
    return sorted;
  }, [apps, searchTerm, sortOrder, sortBy]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleExport = (format) => {
    const filename = `steam-applist-${Date.now()}`;
    try {
      if (format === 'json') {
        exportToJSON(filteredAndSortedApps, `${filename}.json`);
      } else if (format === 'csv') {
        exportToCSV(filteredAndSortedApps, `${filename}.csv`);
      }
      toast.success(`Exported ${filteredAndSortedApps.length} apps to ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const AppRow = ({ app, index }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-12 gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
      data-testid={`browser-app-${app.appid}`}
    >
      <div className="col-span-2">
        <p className="text-cyan-300 font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{app.appid}</p>
      </div>
      <div className="col-span-10">
        <p className="text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{app.name || 'Unnamed App'}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>App Browser</h2>
        <p className="text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>Browse all {apps.length.toLocaleString()} Steam AppIDs</p>
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            data-testid="search-browser-input"
            type="text"
            placeholder="Search by name or AppID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12 rounded-xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            data-testid="export-browser-json"
            onClick={() => handleExport('json')}
            className="bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <FileJson className="w-4 h-4 mr-2" />
            JSON
          </Button>
          <Button
            data-testid="export-browser-csv"
            onClick={() => handleExport('csv')}
            className="bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/50 border border-cyan-500/20 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/50 border-b border-cyan-500/20">
          <button
            data-testid="sort-by-appid"
            onClick={() => toggleSort('appid')}
            className="col-span-2 flex items-center gap-2 text-cyan-300 font-semibold hover:text-cyan-200 transition-colors"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            AppID
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button
            data-testid="sort-by-name"
            onClick={() => toggleSort('name')}
            className="col-span-10 flex items-center gap-2 text-cyan-300 font-semibold hover:text-cyan-200 transition-colors"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Name
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
        
        <div className="h-[650px]" data-testid="app-browser-list">
          {filteredAndSortedApps.length > 0 ? (
            <Virtuoso
              data={filteredAndSortedApps}
              itemContent={(index, app) => (
                <div className="p-2">
                  <AppRow app={app} index={index} />
                </div>
              )}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              No apps found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};