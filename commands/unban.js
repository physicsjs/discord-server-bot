const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Bir kullanıcının yasağını kaldırır.')
    .addStringOption(option =>
      option.setName('kullanıcıid')
        .setDescription('Yasağını kaldırmak istediğiniz kullanıcının ID\'sini girin.')
        .setRequired(true)),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için **Yasakları Yönet** yetkisine sahip olmalısınız!',
        ephemeral: true
      });
    }

    const userId = interaction.options.getString('kullanıcıid');
    
    try {
      const user = await interaction.guild.members.unban(userId);
      console.log(`${user.tag} kullanıcısının yasağı başarıyla kaldırıldı!`);

      const unbanLogChannel = await interaction.guild.channels.fetch(config.unbanLogChannelId);
      if (unbanLogChannel && unbanLogChannel.isTextBased()) {
        const logEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('Bir Kullanıcının Yasağı Kaldırıldı!')
          .setDescription(`${user.tag} kullanıcısının yasağı kaldırıldı!`)
          .addFields(
            { name: 'Kullanıcı:', value: user.tag, inline: true },
            { name: 'Kullanıcı ID:', value: user.id, inline: true },
          )
          .setFooter({ text: `Yasağını Kaldıran: ${interaction.user.tag}` })
          .setTimestamp();

        await unbanLogChannel.send({ embeds: [logEmbed] });
      } else {
        console.error("Unban log kanalı geçerli bir text kanalı değil.");
      }
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Kullanıcının Yasağı Kaldırıldı!')
        .setDescription(`${user.tag} kullanıcısının yasağı başarıyla kaldırıldı!`)
        .addFields(
          { name: 'Kullanıcı:', value: user.tag, inline: true },
          { name: 'Kullanıcı ID:', value: user.id, inline: true },
        )
        .setFooter({ text: `Yasağını Kaldıran: ${interaction.user.tag}` })
        .setTimestamp()
        .setImage('https://i.pinimg.com/originals/96/bd/dd/96bdddc91c08908687be27e7a598dfa2.gif');

      return interaction.reply({
        embeds: [embed],
        ephemeral: false
      });
    } catch (error) {
      console.error("Hata Detayı: ", error);
      return interaction.reply({
        content: `Bir hata oluştu! Kullanıcının yasağını kaldırırken bir sorun oluştu. Detay: ${error.message}`,
        ephemeral: true
      });
    }
  },
};
