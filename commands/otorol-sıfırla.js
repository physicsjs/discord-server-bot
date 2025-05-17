const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otorol-sıfırla')
    .setDescription('Ayarlanmış otorolü sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const kontrol = db.get(`otorol_${interaction.guild.id}`);
    
    if (!kontrol) {
      return interaction.reply({
        content: '❌ Bu sunucu için ayarlanmış bir otorol bulunmuyor.',
        ephemeral: true
      });
    }

    db.delete(`otorol_${interaction.guild.id}`);
    return interaction.reply({
      content: '✅ Otorol başarıyla sıfırlandı.',
      ephemeral: true
    });
  }
};
