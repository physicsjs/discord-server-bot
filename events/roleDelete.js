const { AuditLogEvent } = require('discord.js');
const config = require('../config.json');

const roleDeleteMap = new Map();

module.exports = {
  name: 'roleDelete',

  async execute(role) {
    const fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.RoleDelete,
    });

    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) return;

    const { executor } = deletionLog;
    const whitelist = config.whitelist || [];
    if (whitelist.includes(executor.id)) return;
    if (!executor || executor.bot) return;

    const now = Date.now();
    const key = `${executor.id}-${role.guild.id}`;

    if (!roleDeleteMap.has(key)) {
      roleDeleteMap.set(key, []);
    }

    const timestamps = roleDeleteMap.get(key).filter(ts => now - ts < 60000);
    timestamps.push(now);
    roleDeleteMap.set(key, timestamps);

    if (timestamps.length >= 2) {
      const member = await role.guild.members.fetch(executor.id).catch(() => null);
      if (member && member.bannable) {
        await member.ban({ reason: 'Guard Sistemi: 60 saniyede 2+ rol silme' });
        roleDeleteMap.delete(key);
        console.log(`${executor.tag} banlandı! (2+ rol silme)`);
      }
    }
  }
};
