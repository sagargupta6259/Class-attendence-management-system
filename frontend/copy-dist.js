import fs from 'fs';
import path from 'path';

const src = path.resolve('dist');
const dest = path.resolve('../dist');

try {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log('Successfully synced dist to both frontend/dist and ./dist');
  }
} catch (err) {
  console.warn('Sync notice:', err.message);
}
