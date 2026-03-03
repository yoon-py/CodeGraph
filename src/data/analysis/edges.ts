import type { GraphEdge } from '../../types/graph';

/**
 * 엣지 라벨은 짧게 유지합니다. 상세 의미는 우측 패널 Inspector에서 확인.
 * 라벨 축약 기준:
 *   HTTP API      → HTTP
 *   push notification → push
 *   * * * * *     → cron
 *   processDueAlerts() → invoke
 *   read/write    → r/w
 *   query overdue → query
 *   dispatch (NEW) → dispatch ★
 *   write event   → append
 *   read tokens   → tokens
 *   POST /push/send → /push/send
 *   update count  → update
 *   send email    → email
 *   send SMS      → SMS
 */
export const analysisEdges: GraphEdge[] = [
  // Mobile App connections
  { id: 'e-mobile-worker', source: 'mobileApp', target: 'worker', type: 'call', label: 'HTTP' },
  { id: 'e-expo-mobile', source: 'expoService', target: 'mobileApp', type: 'event', label: 'push' },

  // Scheduler connections
  { id: 'e-scheduler-worker', source: 'scheduler', target: 'worker', type: 'schedule', label: 'cron' },

  // Worker connections
  { id: 'e-worker-alertprocessor', source: 'worker', target: 'alertProcessor', type: 'call', label: 'invoke' },
  { id: 'e-worker-userdb', source: 'worker', target: 'userDb', type: 'data', label: 'r/w' },

  // AlertProcessor connections
  { id: 'e-alertprocessor-userdb', source: 'alertProcessor', target: 'userDb', type: 'data', label: 'query' },
  { id: 'e-alertprocessor-email', source: 'alertProcessor', target: 'emailNotifier', type: 'call', label: 'dispatch' },
  { id: 'e-alertprocessor-sms', source: 'alertProcessor', target: 'smsNotifier', type: 'call', label: 'dispatch' },
  { id: 'e-alertprocessor-push', source: 'alertProcessor', target: 'pushReminder', type: 'call', label: 'dispatch ★' },
  { id: 'e-alertprocessor-eventstore', source: 'alertProcessor', target: 'eventStore', type: 'data', label: 'append' },

  // PushReminder connections (NEW)
  { id: 'e-push-userdb', source: 'pushReminder', target: 'userDb', type: 'data', label: 'tokens' },
  { id: 'e-push-expo', source: 'pushReminder', target: 'expoService', type: 'call', label: '/push/send' },

  // Email Notifier connections
  { id: 'e-email-resend', source: 'emailNotifier', target: 'resendApi', type: 'call', label: 'email' },

  // SMS Notifier connections
  { id: 'e-sms-twilio', source: 'smsNotifier', target: 'twilioApi', type: 'call', label: 'SMS' },

  // UserDB - PushReminder write back (merged: just show one data edge with 'r/w' label)
  { id: 'e-push-userdb-write', source: 'pushReminder', target: 'userDb', type: 'data', label: 'update' },
];
