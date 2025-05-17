const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otorol-ayarla')
    .setDescription('Sunucuya girenlere otomatik verilecek rolü ayarlar.')
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Verilecek rolü seçin')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
  async execute(interaction) {
    const rol = interaction.options.getRole('rol');
    db.set(`otorol_${interaction.guild.id}`, rol.id);
    await interaction.reply({
      content: `✅ Otorol başarıyla ayarlandı: ${rol}`,
      ephemeral: true,
    });
  }
};
