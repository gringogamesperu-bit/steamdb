import React, { useState, useEffect } from 'react';
import '@/App.css';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { Changes } from '@/components/Changes';
import { AppBrowser } from '@/components/AppBrowser';
import { getAppData, saveAppData, fetchSteamAppList, compareAppLists } from '@/utils/db';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [appData, setAppData] = useState({
    currentAppList: [],
    previousAppList: [],
    lastUpdated: null,
    changes: { addedApps: [], removedApps: [] }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const data = await getAppData();
      setAppData(data);
      
      // If no data exists, fetch initial data
      if (!data.lastUpdated) {
        await handleUpdate(true);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsInitialLoad(false);
    }
  };

  const handleUpdate = async (isInitial = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    const toastId = toast.loading(isInitial ? 'Fetching initial Steam AppList...' : 'Updating Steam AppList...');
    
    try {
      const newAppList = await fetchSteamAppList();
      
      const currentData = await getAppData();
      const previousList = currentData.currentAppList || [];
      
      let changes = { addedApps: [], removedApps: [] };
      if (previousList.length > 0) {
        changes = compareAppLists(previousList, newAppList);
      }
      
      const updatedData = {
        id: 'main',
        currentAppList: newAppList,
        previousAppList: previousList,
        lastUpdated: new Date().toISOString(),
        changes
      };
      
      await saveAppData(updatedData);
      setAppData(updatedData);
      
      toast.success(
        isInitial 
          ? `Loaded ${newAppList.length.toLocaleString()} apps` 
          : `Updated! Found ${changes.addedApps.length} new and ${changes.removedApps.length} removed apps`,
        { id: toastId }
      );
    } catch (error) {
      console.error('Error updating app list:', error);
      toast.error('Failed to update AppList. Please try again.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard appData={appData} onUpdate={handleUpdate} isLoading={isLoading} />;
      case 'changes':
        return <Changes appData={appData} />;
      case 'browser':
        return <AppBrowser appData={appData} />;
      default:
        return <Dashboard appData={appData} onUpdate={handleUpdate} isLoading={isLoading} />;
    }
  };

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Loading Steam Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <Toaster richColors position="top-right" theme="dark" />
      
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;