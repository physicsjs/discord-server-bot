const { AuditLogEvent } = require('discord.js');
const config = require('../config.json');

const kickMap = new Map();

module.exports = {
  name: 'guildMemberKick',

  async execute(kickedMember) {
    const fetchedLogs = await kickedMember.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    });

    const kickLog = fetchedLogs.entries.first();
    if (!kickLog) return;

    const { executor } = kickLog;

    const whitelist = config.whitelist || [];
    if (whitelist.includes(executor.id)) return;
    if (!executor || executor.bot) return;

    const now = Date.now();
    const key = `${executor.id}-${kickedMember.guild.id}`;

    if (!kickMap.has(key)) {
      kickMap.set(key, []);
    }

    const timestamps = kickMap.get(key).filter(ts => now - ts < 60000);
    timestamps.push(now);
    kickMap.set(key, timestamps);

    if (timestamps.length >= 2) {
      const member = await kickedMember.guild.members.fetch(executor.id).catch(() => null);
      if (member && member.bannable) {
        await member.ban({ reason: 'Guard Sistemi: 60 saniyede 2+ kişi kickleme' });
        kickMap.delete(key);
        console.log(`${executor.tag} banlandı! (2+ kickleme)`);
      }
    }
  }
};
