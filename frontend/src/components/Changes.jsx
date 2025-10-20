import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Download, FileJson, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Virtuoso } from 'react-virtuoso';
import { exportToJSON, exportToCSV, exportToTXT } from '@/utils/export';
import { toast } from 'sonner';

export const Changes = ({ appData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('added');

  const addedApps = appData.changes?.addedApps || [];
  const removedApps = appData.changes?.removedApps || [];

  const filterApps = (apps) => {
    if (!searchTerm) return apps;
    return apps.filter(app => 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appid.toString().includes(searchTerm)
    );
  };

  const filteredAdded = filterApps(addedApps);
  const filteredRemoved = filterApps(removedApps);

  const handleExport = (format, data, type) => {
    const filename = `steam-${type}-apps-${Date.now()}`;
    try {
      if (format === 'json') {
        exportToJSON(data, `${filename}.json`);
      } else if (format === 'csv') {
        exportToCSV(data, `${filename}.csv`);
      } else if (format === 'txt') {
        exportToTXT(data, `${filename}.txt`);
      }
      toast.success(`Exported ${data.length} apps to ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const AppRow = ({ app, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.01 }}
      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
      data-testid={`app-item-${app.appid}`}
    >
      <div className="flex-1">
        <p className="text-white font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{app.name || 'Unnamed App'}</p>
        <p className="text-sm text-slate-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>AppID: {app.appid}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Changes</h2>
        <p className="text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>Track new and removed AppIDs</p>
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            data-testid="search-changes-input"
            type="text"
            placeholder="Search by name or AppID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12 rounded-xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 rounded-xl">
          <TabsTrigger 
            data-testid="tab-added"
            value="added" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-600/20 data-[state=active]:text-green-300 transition-all duration-300"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            New Apps ({filteredAdded.length})
          </TabsTrigger>
          <TabsTrigger 
            data-testid="tab-removed"
            value="removed" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/20 data-[state=active]:to-red-600/20 data-[state=active]:text-rose-300 transition-all duration-300"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Removed Apps ({filteredRemoved.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="added" className="mt-6 space-y-4">
          <div className="flex gap-2">
            <Button
              data-testid="export-added-json"
              onClick={() => handleExport('json', filteredAdded, 'added')}
              variant="outline"
              className="border-green-500/30 text-green-300 hover:bg-green-500/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FileJson className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button
              data-testid="export-added-csv"
              onClick={() => handleExport('csv', filteredAdded, 'added')}
              variant="outline"
              className="border-green-500/30 text-green-300 hover:bg-green-500/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              data-testid="export-added-txt"
              onClick={() => handleExport('txt', filteredAdded, 'added')}
              variant="outline"
              className="border-green-500/30 text-green-300 hover:bg-green-500/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FileText className="w-4 h-4 mr-2" />
              TXT
            </Button>
          </div>
          
          <div className="h-[600px] rounded-2xl bg-slate-900/50 border border-green-500/20 overflow-hidden" data-testid="added-apps-list">
            {filteredAdded.length > 0 ? (
              <Virtuoso
                data={filteredAdded}
                itemContent={(index, app) => (
                  <div className="p-2">
                    <AppRow app={app} index={index} />
                  </div>
                )}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                No new apps found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="removed" className="mt-6 space-y-4">
          <div className="flex gap-2">
            <Button
              data-testid="export-removed-json"
              onClick={() => handleExport('json', filteredRemoved, 'removed')}
              variant="outline"
              className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FileJson className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button
              data-testid="export-removed-csv"
              onClick={() => handleExport('csv', filteredRemoved, 'removed')}
              variant="outline"
              className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              data-testid="export-removed-txt"
              onClick={() => handleExport('txt', filteredRemoved, 'removed')}
              variant="outline"
              className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FileText className="w-4 h-4 mr-2" />
              TXT
            </Button>
          </div>
          
          <div className="h-[600px] rounded-2xl bg-slate-900/50 border border-rose-500/20 overflow-hidden" data-testid="removed-apps-list">
            {filteredRemoved.length > 0 ? (
              <Virtuoso
                data={filteredRemoved}
                itemContent={(index, app) => (
                  <div className="p-2">
                    <AppRow app={app} index={index} />
                  </div>
                )}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                No removed apps found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};