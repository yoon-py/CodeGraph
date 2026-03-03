export interface AnalysisFlow {
  id: string;
  name: string;
  description: string;
  nodeIds: string[];
  color: string;
}

export const analysisFlows: AnalysisFlow[] = [
  {
    id: 'flow-mobile-checkin',
    name: 'Mobile Check-in',
    description: 'User submits a check-in from the mobile app to the backend.',
    nodeIds: ['mobileApp', 'worker', 'userDb'],
    color: '#4f9cf9',
  },
  {
    id: 'flow-scheduled-alert',
    name: 'Scheduled Alert',
    description: 'Cron triggers the worker → AlertProcessor fans out to all notifiers.',
    nodeIds: [
      'scheduler',
      'worker',
      'alertProcessor',
      'pushReminder',
      'emailNotifier',
      'smsNotifier',
      'userDb',
      'eventStore',
    ],
    color: '#f97316',
  },
  {
    id: 'flow-push-delivery',
    name: 'Push Notification',
    description: 'NEW: PushReminder sends Expo push notification to mobile device.',
    nodeIds: ['alertProcessor', 'pushReminder', 'expoService', 'mobileApp', 'userDb'],
    color: '#a855f7',
  },
  {
    id: 'flow-email-alert',
    name: 'Email Alert',
    description: 'AlertProcessor dispatches email notification via Resend.',
    nodeIds: ['alertProcessor', 'emailNotifier', 'resendApi'],
    color: '#22c55e',
  },
  {
    id: 'flow-sms-alert',
    name: 'SMS Alert',
    description: 'AlertProcessor dispatches SMS notification via Twilio.',
    nodeIds: ['alertProcessor', 'smsNotifier', 'twilioApi'],
    color: '#eab308',
  },
];
