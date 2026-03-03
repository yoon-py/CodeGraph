import type { Edge } from '@xyflow/react';

export const blueprintEdges: Edge[] = [
  // Mobile → Worker
  {
    id: 'be-mobile-worker',
    source: 'bp-mobile',
    sourceHandle: 'mobile-out-api',
    target: 'bp-worker',
    targetHandle: 'worker-in-http',
    type: 'smoothstep',
    label: 'HTTP API',
    data: { edgeType: 'call' },
  },
  // Expo → Mobile (push delivery)
  {
    id: 'be-expo-mobile',
    source: 'bp-expoapi',
    sourceHandle: 'expo-out-mobile',
    target: 'bp-mobile',
    targetHandle: 'mobile-in-push',
    type: 'smoothstep',
    label: 'push',
    data: { edgeType: 'event' },
  },
  // Scheduler → Worker
  {
    id: 'be-sched-worker',
    source: 'bp-scheduler',
    sourceHandle: 'sched-out',
    target: 'bp-worker',
    targetHandle: 'worker-in-cron',
    type: 'smoothstep',
    label: '* * * * *',
    data: { edgeType: 'schedule' },
  },
  // Worker → AlertProcessor
  {
    id: 'be-worker-ap',
    source: 'bp-worker',
    sourceHandle: 'worker-out-processor',
    target: 'bp-alertprocessor',
    targetHandle: 'ap-in',
    type: 'smoothstep',
    label: 'processDueAlerts()',
    data: { edgeType: 'call' },
  },
  // Worker → UserDB
  {
    id: 'be-worker-userdb',
    source: 'bp-worker',
    sourceHandle: 'worker-out-db',
    target: 'bp-userdb',
    targetHandle: 'userdb-in-worker',
    type: 'smoothstep',
    label: 'read/write',
    data: { edgeType: 'data' },
  },
  // AlertProcessor → PushReminder (NEW)
  {
    id: 'be-ap-push',
    source: 'bp-alertprocessor',
    sourceHandle: 'ap-out-push',
    target: 'bp-pushreminder',
    targetHandle: 'push-in',
    type: 'smoothstep',
    label: 'dispatch (NEW)',
    data: { edgeType: 'call', isNew: true },
  },
  // AlertProcessor → EmailNotifier
  {
    id: 'be-ap-email',
    source: 'bp-alertprocessor',
    sourceHandle: 'ap-out-email',
    target: 'bp-emailnotifier',
    targetHandle: 'email-in',
    type: 'smoothstep',
    label: 'dispatch',
    data: { edgeType: 'call' },
  },
  // AlertProcessor → SMSNotifier
  {
    id: 'be-ap-sms',
    source: 'bp-alertprocessor',
    sourceHandle: 'ap-out-sms',
    target: 'bp-smsnotifier',
    targetHandle: 'sms-in',
    type: 'smoothstep',
    label: 'dispatch',
    data: { edgeType: 'call' },
  },
  // AlertProcessor → EventStore
  {
    id: 'be-ap-eventstore',
    source: 'bp-alertprocessor',
    sourceHandle: 'ap-out-db',
    target: 'bp-eventstore',
    targetHandle: 'es-in',
    type: 'smoothstep',
    label: 'write event',
    data: { edgeType: 'data' },
  },
  // PushReminder → UserDB
  {
    id: 'be-push-userdb',
    source: 'bp-pushreminder',
    sourceHandle: 'push-out-db',
    target: 'bp-userdb',
    targetHandle: 'userdb-in-push',
    type: 'smoothstep',
    label: 'update count',
    data: { edgeType: 'data' },
  },
  // PushReminder → Expo API
  {
    id: 'be-push-expo',
    source: 'bp-pushreminder',
    sourceHandle: 'push-out-expo',
    target: 'bp-expoapi',
    targetHandle: 'expo-in',
    type: 'smoothstep',
    label: 'POST /push/send',
    data: { edgeType: 'call' },
  },
  // EmailNotifier → Resend
  {
    id: 'be-email-resend',
    source: 'bp-emailnotifier',
    sourceHandle: 'email-out',
    target: 'bp-resend',
    targetHandle: 'resend-in',
    type: 'smoothstep',
    label: 'send email',
    data: { edgeType: 'call' },
  },
  // SMSNotifier → Twilio
  {
    id: 'be-sms-twilio',
    source: 'bp-smsnotifier',
    sourceHandle: 'sms-out',
    target: 'bp-twilio',
    targetHandle: 'twilio-in',
    type: 'smoothstep',
    label: 'send SMS',
    data: { edgeType: 'call' },
  },
  // AlertProcessor → UserDB
  {
    id: 'be-ap-userdb',
    source: 'bp-alertprocessor',
    sourceHandle: 'ap-in',
    target: 'bp-userdb',
    targetHandle: 'userdb-in-ap',
    type: 'smoothstep',
    label: 'query overdue',
    data: { edgeType: 'data' },
  },
];
