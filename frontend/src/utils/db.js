import Dexie from 'dexie';

const db = new Dexie('SteamAppIDTracker');

db.version(1).stores({
  appData: 'id'
});

export const getAppData = async () => {
  const data = await db.appData.get('main');
  return data || {
    id: 'main',
    currentAppList: [],
    previousAppList: [],
    lastUpdated: null,
    changes: {
      addedApps: [],
      removedApps: []
    }
  };
};

export const saveAppData = async (data) => {
  await db.appData.put({ ...data, id: 'main' });
};

export const fetchSteamAppList = async () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const response = await fetch(`${BACKEND_URL}/api/steam/applist`);
  if (!response.ok) {
    throw new Error('Failed to fetch Steam AppList');
  }
  const data = await response.json();
  return data.applist.apps;
};

export const compareAppLists = (oldList, newList) => {
  const oldMap = new Map(oldList.map(app => [app.appid, app]));
  const newMap = new Map(newList.map(app => [app.appid, app]));
  
  const addedApps = [];
  const removedApps = [];
  
  // Find new apps
  newMap.forEach((app, appid) => {
    if (!oldMap.has(appid)) {
      addedApps.push(app);
    }
  });
  
  // Find removed apps
  oldMap.forEach((app, appid) => {
    if (!newMap.has(appid)) {
      removedApps.push(app);
    }
  });
  
  return { addedApps, removedApps };
};

export default db;