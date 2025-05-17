const { AuditLogEvent } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    if (!member.user.bot) return;

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.BotAdd
    });

    const botLog = fetchedLogs.entries.first();
    if (!botLog) return;

    const { executor } = botLog;
    const whitelist = config.whitelist || [];
    if (whitelist.includes(executor.id)) return;
    try {
      const addedBot = await member.guild.members.fetch(member.id);
      if (addedBot.bannable) {
        await addedBot.ban({ reason: 'Guard: Yetkili bot eklendi' });
      }
      const adder = await member.guild.members.fetch(executor.id).catch(() => null);
      if (adder && adder.bannable) {
        await adder.ban({ reason: 'Guard: Sunucuya yetkili bot eklemek' });
        console.log(`[GUARD] ${executor.tag} ve eklediği bot banlandı.`);
      }
    } catch (err) {
      console.error('Bot ekleyeni banlarken hata:', err);
    }
  }
};
