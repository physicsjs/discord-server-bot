const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('Sunucudaki tüm banlanmış kullanıcıları listeler.'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısın.', ephemeral: true });
    }

    try {
      await interaction.deferReply();
      const bans = await interaction.guild.bans.fetch();
      if (bans.size === 0) {
        return interaction.editReply({ content: 'Sunucuda banlanmış hiç kullanıcı yok.', ephemeral: true });
      }
      const banList = bans.map(ban => `${ban.user.tag} (${ban.user.id})`).join('\n');

      return interaction.editReply({
        embeds: [
          {
            title: '📜 Ban Listesi',
            color: 0xFF0000,
            description: banList,
            footer: { text: `Toplam Banlı Kullanıcı: ${bans.size}` },
            timestamp: new Date()
          }
        ]
      });
    } catch (err) {
      return interaction.reply({ content: 'Ban listesi alınırken bir hata oluştu.', ephemeral: true });
    }
  }
};
