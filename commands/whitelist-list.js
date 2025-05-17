const { SlashCommandBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist-list')
    .setDescription('Whitelist\'teki kullanıcıları listeler.'),

  async execute(interaction) {
    if (interaction.user.id !== config.ownerID) {
      return interaction.reply({ content: 'Bu komutu sadece bot sahibi kullanabilir.', ephemeral: true });
    }

    const whitelist = config.whitelist || [];

    if (whitelist.length === 0) {
      return interaction.reply({ content: 'Whitelist\'te hiç kullanıcı yok.', ephemeral: true });
    }

    const list = whitelist.map(id => `<@${id}>`).join('\n');

    return interaction.reply({
      embeds: [
        {
          color: 0x9146FF,
          title: 'Whitelist Listesi',
          description: list,
          footer: { text: `Toplam: ${whitelist.length} kullanıcı` }
        }
      ],
      ephemeral: true
    });
  }
};
