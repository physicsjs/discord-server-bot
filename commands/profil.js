const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Kullanıcının avatar ve banner resmini gösterir')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Profilini görüntülemek istediğin kullanıcı')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı') || interaction.user;

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} Profil`)
      .setColor('Random')
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields([
        {
          name: 'Avatar',
          value: `[Tıkla](${user.displayAvatarURL({ dynamic: true, size: 1024 })})`,
          inline: true,
        }
      ])
      .setFooter({ text: `${user.tag}` });
    try {
      const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });
      if (fetchedUser.banner) {
        embed.addFields([
          {
            name: 'Banner',
            value: `[Tıkla](${fetchedUser.bannerURL({ dynamic: true, size: 1024 })})`,
            inline: true,
          }
        ]);
        embed.setImage(fetchedUser.bannerURL({ dynamic: true, size: 1024 }));
      } else {
        embed.addFields([
          {
            name: 'Banner',
            value: 'Bu kullanıcının bannerı yok.',
            inline: true,
          }
        ]);
      }
    } catch (err) {
      embed.addFields([
        {
          name: 'Banner',
          value: 'Banner alınamadı.',
          inline: true,
        }
      ]);
    }

    await interaction.reply({ embeds: [embed] });
  }
};
