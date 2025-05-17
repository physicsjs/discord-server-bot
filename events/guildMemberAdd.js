const { Events } = require('discord.js');
const db = require('croxydb');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const roleId = db.get(`otorol_${member.guild.id}`);
    if (!roleId) return;

    const role = member.guild.roles.cache.get(roleId);
    if (!role) return;

    try {
      await member.roles.add(role);
    } catch (error) {
      console.error(`[OTOROL] Rol eklenirken hata oluştu:`, error);
    }
  },
};