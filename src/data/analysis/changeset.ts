import type { ChangeSet } from '../../types/analysis';

export const prChangeSet: ChangeSet = {
  prNumber: 42,
  prTitle: 'feat: Add Expo Push Reminder for overdue check-ins',
  prUrl: 'https://github.com/org/alarm/pull/42',
  changedNodeIds: ['alertProcessor', 'userDb'],
  newNodeIds: ['pushReminder'],
  removedNodeIds: [],
  diffStats: {
    additions: 187,
    deletions: 12,
    filesChanged: 4,
  },
};
