import type { BlueprintNodeData } from '../../types/blueprint';
import type { Node } from '@xyflow/react';

export type BlueprintNode = Node<BlueprintNodeData>;

export const blueprintNodes: BlueprintNode[] = [
  {
    id: 'bp-mobile',
    type: 'mobileNode',
    position: { x: 50, y: 160 },
    data: {
      label: 'Mobile App',
      sublabel: 'Expo React Native',
      file: 'App.tsx',
      ports: [
        { id: 'mobile-out-api', label: 'HTTP', side: 'right', type: 'output' },
        { id: 'mobile-in-push', label: 'Push', side: 'left', type: 'input' },
      ],
    },
  },
  {
    id: 'bp-scheduler',
    type: 'schedulerNode',
    position: { x: 50, y: 380 },
    data: {
      label: 'Scheduler',
      sublabel: '* * * * * (cron)',
      file: 'workers.js:cron',
      ports: [
        { id: 'sched-out', label: 'trigger', side: 'right', type: 'output' },
      ],
    },
  },
  {
    id: 'bp-worker',
    type: 'inServiceNode',
    position: { x: 320, y: 240 },
    data: {
      label: 'InService Worker',
      sublabel: 'fetch handler',
      file: 'workers.js:1',
      ports: [
        { id: 'worker-in-http', label: 'HTTP', side: 'left', type: 'input' },
        { id: 'worker-in-cron', label: 'cron', side: 'left', type: 'input' },
        { id: 'worker-out-processor', label: 'invoke', side: 'right', type: 'output' },
        { id: 'worker-out-db', label: 'D1', side: 'bottom', type: 'output' },
      ],
    },
  },
  {
    id: 'bp-alertprocessor',
    type: 'alertProcessorNode',
    position: { x: 600, y: 100 },
    data: {
      label: 'Alert Processor',
      sublabel: 'processDueAlerts :764',
      file: 'workers.js:764',
      isModified: true,
      ports: [
        { id: 'ap-in', label: 'call', side: 'left', type: 'input' },
        { id: 'ap-out-email', label: 'email', side: 'right', type: 'output' },
        { id: 'ap-out-sms', label: 'sms', side: 'right', type: 'output' },
        { id: 'ap-out-push', label: 'push', side: 'right', type: 'output' },
        { id: 'ap-out-db', label: 'events', side: 'bottom', type: 'output' },
      ],
    },
  },
  {
    id: 'bp-pushreminder',
    type: 'notifierNode',
    position: { x: 900, y: 40 },
    data: {
      label: 'Push Reminder',
      sublabel: 'sendPushReminders :907',
      file: 'workers.js:907',
      isNew: true,
      ports: [
        { id: 'push-in', label: 'call', side: 'left', type: 'input' },
        { id: 'push-out-expo', label: 'Expo API', side: 'right', type: 'output' },
        { id: 'push-out-db', label: 'D1 write', side: 'bottom', type: 'output' },
      ],
    },
  },
  {
    id: 'bp-emailnotifier',
    type: 'notifierNode',
    position: { x: 900, y: 220 },
    data: {
      label: 'Email Notifier',
      sublabel: 'sendAlertEmail :612',
      file: 'workers.js:612',
      ports: [
        { id: 'email-in', label: 'call', side: 'left', type: 'input' },
        { id: 'email-out', label: 'Resend', side: 'right', type: 'output' },
      ],
    },
  },
  {
    id: 'bp-smsnotifier',
    type: 'notifierNode',
    position: { x: 900, y: 360 },
    data: {
      label: 'SMS Notifier',
      sublabel: 'sendAlertSMS :680',
      file: 'workers.js:680',
      ports: [
        { id: 'sms-in', label: 'call', side: 'left', type: 'input' },
        { id: 'sms-out', label: 'Twilio', side: 'right', type: 'output' },
      ],
    },
  },
  {
    id: 'bp-userdb',
    type: 'eventStoreNode',
    position: { x: 600, y: 420 },
    data: {
      label: 'User DB',
      sublabel: 'D1 SQLite',
      isModified: true,
      ports: [
        { id: 'userdb-in-worker', label: 'rw', side: 'left', type: 'input' },
        { id: 'userdb-in-ap', label: 'read', side: 'top', type: 'input' },
        { id: 'userdb-in-push', label: 'rw', side: 'right', type: 'input' },
      ],
    },
  },
  {
    id: 'bp-eventstore',
    type: 'eventStoreNode',
    position: { x: 900, y: 500 },
    data: {
      label: 'Event Store',
      sublabel: 'D1 append-only',
      ports: [
        { id: 'es-in', label: 'write', side: 'left', type: 'input' },
      ],
    },
  },
  {
    id: 'bp-expoapi',
    type: 'externalApiNode',
    position: { x: 1180, y: 40 },
    data: {
      label: 'Expo Push Service',
      sublabel: 'exp.host/--/api/v2',
      ports: [
        { id: 'expo-in', label: 'POST', side: 'left', type: 'input' },
        { id: 'expo-out-mobile', label: 'push', side: 'bottom', type: 'output' },
      ],
    },
  },
  {
    id: 'bp-resend',
    type: 'externalApiNode',
    position: { x: 1180, y: 220 },
    data: {
      label: 'Resend API',
      sublabel: 'api.resend.com',
      ports: [
        { id: 'resend-in', label: 'POST', side: 'left', type: 'input' },
      ],
    },
  },
  {
    id: 'bp-twilio',
    type: 'externalApiNode',
    position: { x: 1180, y: 360 },
    data: {
      label: 'Twilio API',
      sublabel: 'api.twilio.com',
      ports: [
        { id: 'twilio-in', label: 'POST', side: 'left', type: 'input' },
      ],
    },
  },
];
