const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unbanall')
    .setDescription('Sunucudaki tüm yasaklı kullanıcıların yasaklarını kaldırır.'),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için **Yasakları Yönet** yetkisine sahip olmalısınız!',
        ephemeral: true
      });
    }

    try {
      const bans = await interaction.guild.bans.fetch();

      if (bans.size === 0) {
        return interaction.reply({
          content: 'Sunucuda yasaklı kullanıcı bulunmamaktadır.',
          ephemeral: true
        });
      }
      await Promise.all(
        bans.map(async (ban) => {
          await interaction.guild.members.unban(ban.user);
        })
      );
      return interaction.reply({
        content: 'Tüm yasaklı kullanıcıların yasakları kaldırıldı!',
        ephemeral: false
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'Bir hata oluştu! Yasakları kaldırırken bir sorun oldu.',
        ephemeral: true
      });
    }
  },
};
