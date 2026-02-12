
import express from 'express';
import fs from 'fs';
import path from 'path';
import process from 'process';

const app = express();

// Directory to save heap snapshots
const HEAP_DIR = '/tmp/heapdumps';
if (!fs.existsSync(HEAP_DIR)) {
  fs.mkdirSync(HEAP_DIR, { recursive: true });
}

// Security token for remote trigger
const SECRET = 'change-me';

// --- Trigger heap snapshot ---
app.post('/debug/heapdump', (req, res) => {
  try {
    if (req.headers['x-heap-secret'] !== SECRET) {
      return res.status(403).send('Forbidden');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(HEAP_DIR, `heap-${timestamp}.heapsnapshot`);

    

    // Node 22 built-in V8 snapshot
    const v8 = require('node:v8');
    v8.writeHeapSnapshot(filename);

    return res.send({ message: 'Heap snapshot triggered', file: filename });
  } catch (err) {
    console.error('Heap snapshot failed', err);
    return res.status(500).send('Heap snapshot failed');
  }
});

// --- List existing heap snapshots ---
app.get('/debug/heapdumps', (req, res) => {
  try {
    if (req.headers['x-heap-secret'] !== SECRET) {
      return res.status(403).send('Forbidden');
    }
    console.log(process.pid);
    console.log(process.memoryUsage());
    const files = fs.readdirSync(HEAP_DIR).filter(f => f.endsWith('.heapsnapshot'));
    return res.send(files);
  } catch (err) {
    console.error('Failed to list heap snapshots', err);
    return res.status(500).send('Failed to list heap snapshots');
  }
});

// --- Download a specific heap snapshot ---
app.get('/debug/heapdump/:file', (req, res) => {
  try {
    if (req.headers['x-heap-secret'] !== SECRET) {
      return res.status(403).send('Forbidden');
    }

    const filePath = path.join(HEAP_DIR, req.params.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    return res.download(filePath);
  } catch (err) {
    console.error('Failed to download heap snapshot', err);
    return res.status(500).send('Failed to download heap snapshot');
  }
});

// --- Optional cleanup: delete snapshots older than N ms ---
const CLEANUP_INTERVAL_MS = 24 * 3600 * 1000; // 24h
setInterval(() => {
  try {
    const files = fs.readdirSync(HEAP_DIR).filter(f => f.endsWith('.heapsnapshot'));
    const now = Date.now();
    files.forEach(f => {
      const filePath = path.join(HEAP_DIR, f);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > CLEANUP_INTERVAL_MS) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old heap snapshot: ${filePath}`);
      }
    });
  } catch (err) {
    console.error('Error cleaning old heap snapshots', err);
  }
}, CLEANUP_INTERVAL_MS);

export default app;
