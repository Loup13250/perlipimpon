import { useState, useCallback, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

export type LogAction =
  | 'ARTICLE_CREATED'
  | 'ARTICLE_UPDATED'
  | 'ARTICLE_DELETED'
  | 'BULK_DELETE'
  | 'CONFIG_SAVED'
  | 'CATEGORIES_SAVED'
  | 'DEMO_INJECTED'
  | 'LOGIN'
  | 'LOGOUT';

export interface ActivityLog {
  id: string;
  date: string;        // ISO string
  action: LogAction;
  detail: string;
  icon: string;
}

const LOGS_COLLECTION = 'logs';
const MAX_LOGS = 50;

const actionIcons: Record<LogAction, string> = {
  ARTICLE_CREATED:   'create',
  ARTICLE_UPDATED:   'update',
  ARTICLE_DELETED:   'delete',
  BULK_DELETE:       'bulk_delete',
  CONFIG_SAVED:      'config',
  CATEGORIES_SAVED:  'categories',
  DEMO_INJECTED:     'demo',
  LOGIN:             'login',
  LOGOUT:            'logout',
};

export function useLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, LOGS_COLLECTION),
      orderBy('date', 'desc'),
      limit(MAX_LOGS)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date instanceof Timestamp
            ? data.date.toDate().toISOString()
            : (data.date as string),
          action: data.action as LogAction,
          detail: data.detail as string,
          icon: actionIcons[data.action as LogAction] ?? 'info',
        } as ActivityLog;
      });
      setLogs(fetched);
      setLogsLoading(false);
    }, (error) => {
      console.error('[Firebase] Erreur Logs:', error);
      setLogsLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Enregistre une nouvelle action dans Firestore
   */
  const addLog = useCallback(async (action: LogAction, detail: string) => {
    try {
      await addDoc(collection(db, LOGS_COLLECTION), {
        date: Timestamp.now(),
        action,
        detail,
        icon: actionIcons[action] ?? 'info',
      });
    } catch (e) {
      console.error('[Firebase] Erreur écriture log:', e);
    }
  }, []);

  return { logs, logsLoading, addLog };
}
