const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('istatistik')
    .setDescription('Botun istatistiklerini gösterir'),

  async execute(interaction) {
    const botUptime = moment.duration(interaction.client.uptime).humanize();
    const memberCount = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const serverCount = interaction.client.guilds.cache.size;
    const ping = interaction.client.ws.ping;
    const systemOS = os.platform();

    const embed = new EmbedBuilder()
      .setTitle('Bot İstatistikleri')
      .setColor('Random')
      .addFields(
        { name: 'Sunucu Sayısı', value: `${serverCount} sunucu`, inline: true },
        { name: 'Üye Sayısı', value: `${memberCount} üye`, inline: true },
        { name: 'Çalışma Süresi', value: botUptime, inline: true },
        { name: 'Bot Ping (MS)', value: `${ping} ms`, inline: true },
        { name: 'İşlemci', value: `${os.cpus()[0].model}`, inline: true },
        { name: 'RAM Kullanımı', value: `${Math.round(os.freemem() / 1024 / 1024)} MB`, inline: true },
        { name: 'İşletim Sistemi', value: systemOS === 'win32' ? 'Windows' : systemOS === 'linux' ? 'Linux' : 'macOS', inline: true }
      )
      .setFooter({ text: ' Unpixel Bot İstatistikleri' });

    await interaction.reply({ embeds: [embed] });
  }
};
