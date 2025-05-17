const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Bulunduğun kanalı kilitler.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
      });

      const embed = new EmbedBuilder()
        .setTitle('🔒 Kanal Kilitlendi')
        .setDescription(`Bu kanal artık mesaj gönderimine kapatıldı.`)
        .setColor('Red')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('Kanal kilitlenirken hata:', err);
      await interaction.reply({
        content: '❌ Kanal kilitlenirken bir hata oluştu.',
        ephemeral: true
      });
    }
  }
};
