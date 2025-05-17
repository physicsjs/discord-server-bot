const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reklam')
    .setDescription('Belirtilen kanala bannerlı bir reklam mesajı gönderir.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Mesajın gönderileceği kanal')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('mesaj')
        .setDescription('Gönderilecek mesaj (\\n ile alt satır)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('banner')
        .setDescription('Mesajda kullanılacak banner görseli URL\'si (opsiyonel)')
        .setRequired(false)),

  async execute(interaction) {
    // YÖNETİCİ İZNİ KONTROLÜ
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return await interaction.reply({ content: '❌ Bu komutu kullanmak için yönetici iznine sahip olmalısın.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('kanal');
    const messageText = interaction.options.getString('mesaj').replace(/\\n/g, '\n');
    const bannerURL = interaction.options.getString('banner') || 'https://cdn.discordapp.com/attachments/1151578970480787467/1219047424569362442/standard_2.gif';

    const embed = new EmbedBuilder()
      .setTitle('📢 Yeni Reklam!')
      .setDescription(messageText)
      .setColor(0x800080)
      .setImage(bannerURL)
      .setFooter({ text: `UnPixel Dev | Discord Hizmetleri` });

    try {
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: `✅ Reklam başarıyla ${channel} kanalına gönderildi!`, ephemeral: true });
    } catch (error) {
      console.error('Hata:', error);
      await interaction.reply({ content: '❌ Mesaj gönderilirken bir hata oluştu.', ephemeral: true });
    }
  }
};
