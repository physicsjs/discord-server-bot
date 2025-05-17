const { SlashCommandBuilder, PermissionFlagsBits, AuditLogEvent } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banbilgi')
    .setDescription('Bir kullanıcının sunucudan banlı olup olmadığını gösterir.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Ban bilgisi gösterilecek kullanıcıyı seçin.')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısın.', ephemeral: true });
    }

    const user = interaction.options.getUser('kullanıcı');

    try {
      const ban = await interaction.guild.bans.fetch(user.id);
      const fetchedLogs = await interaction.guild.fetchAuditLogs({
        limit: 5,
        type: AuditLogEvent.MemberBanAdd,
      });

      const banLog = fetchedLogs.entries.find(entry => entry.target.id === user.id);

      let executorInfo = 'Belirlenemedi';
      if (banLog) {
        executorInfo = `${banLog.executor.tag} (${banLog.executor.id})`;
      }

      return interaction.reply({
        embeds: [
          {
            title: '⛔ Ban Bilgisi',
            color: 0xFF0000,
            fields: [
              { name: '👤 Kullanıcı', value: `${user.tag} (${user.id})`, inline: false },
              { name: '🚫 Ban Sebebi', value: `${ban.reason || 'Belirtilmemiş'}`, inline: false },
              { name: '👮 Banlayan Kişi', value: executorInfo, inline: false },
            ],
            footer: { text: `İsteyen: ${interaction.user.tag}` },
            timestamp: new Date()
          }
        ]
      });
    } catch (err) {
      return interaction.reply({ content: `${user.tag} şu anda sunucudan banlı değil.`, ephemeral: true });
    }
  }
};
