const { Events, PermissionsBitField } = require('discord.js');

const mentionMap = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const userId = message.author.id;
    if (message.mentions.everyone) {
      const now = Date.now();
      const data = mentionMap.get(userId) || [];
      const recent = data.filter(ts => now - ts < 60000);
      recent.push(now);

      mentionMap.set(userId, recent);

      if (recent.length >= 3) {
        try {
          await message.guild.members.ban(userId, { reason: '@everyone spam koruması (3/60sn)' });
          mentionMap.delete(userId);
          console.log(`${message.author.tag} banlandı (everyone spam).`);
        } catch (err) {
          console.error('Ban işlemi başarısız:', err);
        }
      }
    }
  }
};
