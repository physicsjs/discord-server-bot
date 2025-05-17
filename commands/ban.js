const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı yasaklar.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Yasaklanacak kullanıcıyı seçin')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Yasaklanma sebebini belirtin')
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için **Yasakları Yönet** yetkisine sahip olmalısınız!',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Kullanıcı Yasaklandı!')
      .setDescription(`${user.tag} başarıyla yasaklandı!`)
      .addFields(
        { name: 'Sebep:', value: reason, inline: true },
        { name: 'Kullanıcı:', value: user.tag, inline: true },
      )
      .setFooter({ text: `Yasaklayan: ${interaction.user.tag}` })
      .setTimestamp()
      .setImage('https://i.pinimg.com/originals/96/bd/dd/96bdddc91c08908687be27e7a598dfa2.gif');

    const dmEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Yasaklama Bildirimi')
      .setDescription(`Merhaba **${user.tag}**, maalesef **${interaction.guild.name}** sunucusundan **yasaklandınız**.`)
      .addFields(
        { name: 'Sebep:', value: reason, inline: true },
        { name: 'Sunucu:', value: interaction.guild.name, inline: true }
      )
      .setFooter({ text: `Yasaklayan: ${interaction.user.tag}` })
      .setTimestamp();

    try {

      if (user) {
        try {
          await user.send({ embeds: [dmEmbed] });
        } catch (error) {
          console.error('DM gönderilirken bir hata oluştu:', error);
        }
      }
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply({
        embeds: [embed],
        ephemeral: false
      });
      const logChannel = await interaction.guild.channels.fetch(config.banLogChannelID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('Bir Kullanıcı Yasaklandı!')
          .setDescription(`**Kullanıcı:** ${user.tag} (${user.id})\n**Sebep:** ${reason}`)
          .setFooter({ text: `Yasaklayan: ${interaction.user.tag}` })
          .setTimestamp();
        await logChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'Bir hata oluştu! Kullanıcıyı yasaklarken bir sorun oluştu.',
        ephemeral: true
      });
    }
  },
};
