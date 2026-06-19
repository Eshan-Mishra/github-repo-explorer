import { useEffect } from 'react';
import { pingHealth } from '../lib/api';

// Render's free tier sleeps after ~15 min idle, so ping well under that window
// to keep the backend warm while the app is open.
const PING_INTERVAL_MS = 10 * 60 * 1000;

export function useKeepAlive() {
  useEffect(() => {
    pingHealth();
    const id = setInterval(pingHealth, PING_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
}
