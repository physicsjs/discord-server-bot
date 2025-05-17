const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Bir kullanıcıyı whitelist’e ekler.')
    .addUserOption(option => option.setName('whitelistkullanıcı').setDescription('Whitelist’e eklemek için kullanıcı seçin').setRequired(true)),

  async execute(interaction) {
    if (interaction.user.id !== config.ownerID) {
      return interaction.reply({ content: 'Bu komutu yalnızca bot sahibi kullanabilir.', ephemeral: true });
    }

    const user = interaction.options.getUser('whitelistkullanıcı');
    
    if (user.bot) {
      return interaction.reply({ content: 'Botları whitelist\'e ekleyemezsiniz.', ephemeral: true });
    }

    if (!config.whitelist) {
      config.whitelist = [];
    }
    if (config.whitelist.includes(user.id)) {
      return interaction.reply({ content: `${user.tag} zaten whitelist'te.`, ephemeral: true });
    }
    config.whitelist.push(user.id);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    return interaction.reply({ content: `${user.tag} başarıyla whitelist\'e eklendi.`, ephemeral: true });
  }
};
