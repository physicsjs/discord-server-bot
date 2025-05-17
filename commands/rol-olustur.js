const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-olustur')
    .setDescription('Yeni bir rol oluşturur.')
    .addStringOption(option => 
      option.setName('rol_adi')
        .setDescription('Oluşturulacak rolün adını girin')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const rolAdi = interaction.options.getString('rol_adi');

    try {
      const yeniRol = await interaction.guild.roles.create({
        name: rolAdi,
        reason: 'Yeni rol oluşturuldu.',
      });

      await interaction.reply({
        content: `✅ Rol başarıyla oluşturuldu: **${yeniRol.name}**`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Rol oluşturulurken bir hata oluştu:', error);
      await interaction.reply({
        content: '❌ Rol oluşturulurken bir hata oluştu.',
        ephemeral: true
      });
    }
  }
};
