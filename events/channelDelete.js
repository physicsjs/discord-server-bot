const { AuditLogEvent } = require('discord.js');
const config = require('../config.json');

const userActions = new Map();

function isWhitelisted(userId) {
  return config.whitelist.includes(userId);
}

module.exports = {
  name: 'channelDelete',
  async execute(channel) {
    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelDelete,
    });

    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) return;

    const { executor, createdTimestamp } = deletionLog;
    if (!executor || executor.bot || isWhitelisted(executor.id)) return;

    const now = Date.now();
    const userId = executor.id;

    if (!userActions.has(userId)) {
      userActions.set(userId, []);
    }

    const timestamps = userActions.get(userId).filter(ts => now - ts < 60000);
    timestamps.push(now);
    userActions.set(userId, timestamps);

    if (timestamps.length >= 3) {
      try {
        await channel.guild.members.ban(userId, { reason: '60 saniyede 3 kanal sildiği için banlandı.' });
        console.log(`[GUARD] ${executor.tag} kanal silme limiti aştı ve banlandı.`);
        userActions.delete(userId); // Temizle
      } catch (err) {
        console.error(`[GUARD] ${executor.tag} banlanamadı:`, err);
      }
    }
  }
};
