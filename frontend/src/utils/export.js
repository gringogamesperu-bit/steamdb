import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export const exportToJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, filename);
};

export const exportToCSV = (data, filename) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

export const exportToTXT = (data, filename) => {
  let text = '';
  data.forEach(item => {
    text += `AppID: ${item.appid} | Name: ${item.name}\n`;
  });
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  saveAs(blob, filename);
};