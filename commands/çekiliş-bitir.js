const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('çekiliş-bitir')
    .setDescription('Devam eden bir çekilişi erkenden bitirir.')
    .addStringOption(option =>
      option.setName('mesaj_id')
        .setDescription('Çekiliş mesajının ID\'si')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'Bu komutu sadece yöneticiler kullanabilir.', ephemeral: true });
    }

    const mesajID = interaction.options.getString('mesaj_id');

    let mesaj;
    try {
      mesaj = await interaction.channel.messages.fetch(mesajID);
    } catch (err) {
      return interaction.reply({ content: 'Geçerli bir mesaj ID\'si girin.', ephemeral: true });
    }

    const reaction = mesaj.reactions.cache.get('🎉');
    if (!reaction) {
      return interaction.reply({ content: 'Bu mesajda 🎉 reaksiyonu bulunamadı.', ephemeral: true });
    }

    await reaction.users.fetch();
    const katılanlar = reaction.users.cache.filter(u => !u.bot).map(u => u.id);

    if (katılanlar.length === 0) {
      return interaction.reply('Çekilişe kimse katılmamış.');
    }

    const kazananID = katılanlar[Math.floor(Math.random() * katılanlar.length)];

    return interaction.reply(`🎉 Erken bitirildi! Kazanan: <@${kazananID}>`);
  }
};
