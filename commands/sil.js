const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sil')
    .setDescription('Belirttiğiniz sayıda mesajı siler.')
    .addIntegerOption(option =>
      option.setName('sayı')
        .setDescription('Kaç mesaj silinsin?')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger('sayı');
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için **Mesajları Yönet** yetkisine sahip olmalısınız!',
        ephemeral: true
      });
    }

    try {
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `${amount} mesaj başarıyla silindi.`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Mesajları silerken bir hata oluştu.',
        ephemeral: true
      });
    }
  },
};
