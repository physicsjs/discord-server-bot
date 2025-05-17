const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Bulunduğun kanalı açar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: true,
      });

      const embed = new EmbedBuilder()
        .setTitle('🔓 Kanal Açıldı')
        .setDescription(`Bu kanal artık mesaj gönderimine açık.`)
        .setColor('Green')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('Kanal açılırken hata:', err);
      await interaction.reply({
        content: '❌ Kanal açılırken bir hata oluştu.',
        ephemeral: true
      });
    }
  }
};
