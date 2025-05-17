const { Events, AuditLogEvent, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

// Sayaçlar
const mentionCounts = new Map();
const kickCounts = new Map();
const channelDeleteCounts = new Map();
const roleDeleteCounts = new Map();

function increaseCount(map, userId) {
  const now = Date.now();
  const data = map.get(userId) || [];
  const filtered = data.filter(t => now - t < 60000);
  filtered.push(now);
  map.set(userId, filtered);
  return filtered.length;
}

function banUser(guild, userId, reason) {
  const member = guild.members.cache.get(userId);
  if (member) {
    member.ban({ reason: `Guard sistemi: ${reason}` }).catch(() => {});
  }
}

function isWhitelisted(userId) {
  return config.whitelist.includes(userId);
}

module.exports = [
  {
    name: Events.MessageCreate,
    async execute(message) {
      if (message.author.bot || !message.guild) return;
      if (!message.mentions.everyone) return;

      const userId = message.author.id;
      if (isWhitelisted(userId)) return;

      const count = increaseCount(mentionCounts, userId);
      if (count >= 3) {
        banUser(message.guild, userId, '60 saniyede 3 @everyone mention');
      }
    }
  },
  {
    name: Events.GuildAuditLogEntryCreate,
    async execute(entry, guild) {
      if (!guild) return;

      const { action, executorId } = entry;
      if (!executorId) return;
      if (isWhitelisted(executorId)) return;

      const countCheck = (map, limit, reason) => {
        const count = increaseCount(map, executorId);
        if (count >= limit) banUser(guild, executorId, reason);
      };

      switch (entry.action) {
        case AuditLogEvent.MemberKick:
          countCheck(kickCounts, 3, '60 saniyede 3 kullanıcı kick');
          break;
        case AuditLogEvent.ChannelDelete:
          countCheck(channelDeleteCounts, 3, '60 saniyede 3 kanal silme');
          break;
        case AuditLogEvent.RoleDelete:
          countCheck(roleDeleteCounts, 2, '60 saniyede 2 rol silme');
          break;
      }
    }
  }
];
