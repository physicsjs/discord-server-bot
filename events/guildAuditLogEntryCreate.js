const { Events, AuditLogEvent } = require('discord.js');

const actionMap = new Map();

const config = {
  channelDelete: { type: AuditLogEvent.ChannelDelete, limit: 3, time: 60000 },
  roleDelete: { type: AuditLogEvent.RoleDelete, limit: 2, time: 60000 },
  memberKick: { type: AuditLogEvent.MemberKick, limit: 3, time: 60000 },
};

module.exports = {
  name: Events.GuildAuditLogEntryCreate,
  async execute(entry) {
    const { executorId, target, createdTimestamp, action } = entry;
    if (!executorId || executorId === entry.guild.client.user.id) return;

    const now = Date.now();

    for (const [key, val] of Object.entries(config)) {
      if (action === val.type) {
        const data = actionMap.get(executorId)?.[key] || [];

        const filtered = data.filter(ts => now - ts < val.time);
        filtered.push(now);

        const existing = actionMap.get(executorId) || {};
        existing[key] = filtered;
        actionMap.set(executorId, existing);

        if (filtered.length >= val.limit) {
          try {
            await entry.guild.members.ban(executorId, { reason: `${key} limit aşıldı (${filtered.length}/${val.limit})` });
            actionMap.delete(executorId);
            console.log(`[GUARD] ${key} limiti aşıldı ve ${executorId} banlandı.`);
          } catch (err) {
            console.error(`[GUARD] ${key} için ban atılamadı:`, err);
          }
        }
      }
    }
  }
};
