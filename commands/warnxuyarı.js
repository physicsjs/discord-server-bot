const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Bir kullanıcıya uyarı verir.')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Uyarı verilecek kullanıcı')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('verilecekuyarırolu')
        .setDescription('Verilecek uyarı rolü')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('sebep')
        .setDescription('Uyarının sebebi')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep');
    const member = await interaction.guild.members.fetch(user.id);

    const warnRole = interaction.options.getRole('verilecekuyarırolu');

    try {
      await member.roles.add(warnRole);

      const embed = new EmbedBuilder()
        .setTitle('Uyarı Verildi!')
        .setDescription(`${user.tag} kullanıcısına **${reason}** sebebiyle uyarı verildi. Verilen rol: **${warnRole.name}**`)
        .setColor(0xff0000)
        .setFooter({ text: 'UnPixel Bot | Uyarı Sistemi' });
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Uyarı verme hatası:', error);
      await interaction.reply({ content: '❌ Uyarı verirken bir hata oluştu.', ephemeral: true });
    }
  }
};
