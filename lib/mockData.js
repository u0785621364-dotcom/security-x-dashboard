export const MOCK_USER = { id: '291490158', username: 'Kimon', discriminator: '0001', avatar: null };
export const MOCK_SERVERS = [
  { id: '112233445566778899', name: 'Main HQ', icon: 'HQ', members: 842, owner: true, admin: true, botInstalled: true, botOnline: true, botRoleOk: true, botRoleName: 'Security X', botRolePos: 18, highestRolePos: 12 },
  { id: '998877665544332211', name: 'Community Hub', icon: 'CH', members: 310, owner: false, admin: true, botInstalled: true, botOnline: true, botRoleOk: false, botRoleName: 'Security X', botRolePos: 5, highestRolePos: 14 },
  { id: '554433221100998877', name: 'Dev Testing', icon: 'DT', members: 28, owner: true, admin: true, botInstalled: true, botOnline: true, botRoleOk: true, botRoleName: 'Security X', botRolePos: 10, highestRolePos: 4 },
  { id: '123456789012345678', name: 'Partner Network', icon: 'PN', members: 1204, owner: false, admin: true, botInstalled: false, botOnline: false, botRoleOk: false, botRoleName: null, botRolePos: 0, highestRolePos: 20 },
];
export const METRICS = { serversProtected: 24, actionsBlocked: 15892, threatsNeutralized: 3456, botsKicked: 2345, uptime: '99.9%' };
export const PROTECTION = { antibot: true, antiraid: true, joinProtection: true, inviteProtection: true, automated: true };
export const ACTIVITY = [
  { event: 'Bot Blocked', user: 'SuspiciousBot#1234', action: 'Join Attempt Blocked', severity: 'high', time: '2 min ago' },
  { event: 'Raid Detected', user: 'Multiple Users', action: 'Mass Join Blocked', severity: 'critical', time: '15 min ago' },
  { event: 'Alt Account Detected', user: 'User#5678', action: 'Account Blocked', severity: 'moderate', time: '1 hour ago' },
  { event: 'Invite Blocked', user: 'Spammer#9911', action: 'Invite Deleted · 24h timeout', severity: 'moderate', time: '2 hours ago' },
  { event: 'Bot Removed', user: 'NukeTool#0001', action: 'Unauthorized app kicked', severity: 'high', time: '3 hours ago' },
];
export const CHART_POINTS = [280, 270, 290, 310, 340, 380, 420, 480, 520, 560, 600, 640, 680, 700];
export const MINI = { joinsBlocked: 1234, spamMessages: 456, raidAttempts: 789, altAccounts: 321 };
export const LOGS = [
  { id: 'evt_8f2a1c', ts: '2026-08-19 18:42:11', type: 'BOT_BLOCKED', actor: 'Security X', target: 'SuspiciousBot#1234', action: 'Kick', reason: 'Unauthorized application', result: 'Success', severity: 'high' },
  { id: 'evt_7b3d2e', ts: '2026-08-19 18:28:03', type: 'RAID', actor: 'Security X', target: '12 accounts', action: 'Lockdown', reason: 'Join velocity exceeded', result: 'Success', severity: 'critical' },
  { id: 'evt_6c4e3f', ts: '2026-08-19 17:15:44', type: 'INVITE', actor: 'Security X', target: 'Spammer#9911', action: 'Timeout 24h', reason: 'Invite link posted', result: 'Success', severity: 'moderate' },
];
export const DEFAULT_SETTINGS = { antibotSensitivity: 'high', antiraid: true, joinProtection: true, inviteProtection: true, autoKickBots: true, autoBanMalicious: true, removeInvites: true, lockdownOnRaid: true, discordNotifications: true, dashboardNotifications: true, securityAlerts: true, timezone: 'Europe/Berlin' };
