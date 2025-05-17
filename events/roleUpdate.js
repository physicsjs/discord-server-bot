const { AuditLogEvent, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'roleUpdate',

  async execute(oldRole, newRole) {
    // Eğer rol sonradan yönetici yetkisi aldıysa
    const oldAdmin = oldRole.permissions.has(PermissionsBitField.Flags.Administrator);
    const newAdmin = newRole.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!oldAdmin && newAdmin) {
      const fetchedLogs = await newRole.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleUpdate,
      });

      const updateLog = fetchedLogs.entries.find(entry =>
        entry.target.id === newRole.id &&
        Date.now() - entry.createdTimestamp < 5000
      );

      if (!updateLog) return;

      const { executor } = updateLog;
      const whitelist = config.whitelist || [];
      if (whitelist.includes(executor.id)) return;
      if (!executor || executor.bot) return;

      const member = await newRole.guild.members.fetch(executor.id).catch(() => null);
      if (member && member.bannable) {
        await member.ban({ reason: 'Guard Sistemi: Bir role yönetici yetkisi verdi' });
        console.log(`[GUARD] ${executor.tag} banlandı (admin yetkisi verdiği için)`);
      }
    }
  }
};
