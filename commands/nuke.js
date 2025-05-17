const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Kanalın tüm mesajlarını siler ve kanalın nukelendiğini bildirir.'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için **Mesajları Yönet** yetkisine sahip olmalısınız!',
        ephemeral: true
      });
    }

    try {
      const messages = await interaction.channel.messages.fetch();
      await interaction.channel.bulkDelete(messages, true);

      const embed = new EmbedBuilder()
        .setColor('#FF0000') // Kırmızı renk
        .setTitle('Kanal Nukelendi!')
        .setDescription('Tüm mesajlar silindi!')
        .setFooter({ text: `UnPixel | Discord Hizmetleri` })
        .setTimestamp()
        .setImage('https://i.pinimg.com/originals/96/bd/dd/96bdddc91c08908687be27e7a598dfa2.gif');

      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Bir hata oluştu! Mesajları silerken bir sorun oluştu.',
        ephemeral: true
      });
    }
  },
};
