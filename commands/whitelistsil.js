const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelistsil')
    .setDescription('Bir kullanıcıyı whitelist\'ten çıkarır.')
    .addUserOption(option => option.setName('kullanıcı').setDescription('Whitelist\'ten çıkarılacak kullanıcıyı seçin').setRequired(true)),

  async execute(interaction) {
    if (interaction.user.id !== config.ownerID) {
      return interaction.reply({ content: 'Bu komutu yalnızca bot sahibi kullanabilir.', ephemeral: true });
    }

    const user = interaction.options.getUser('kullanıcı');
  
    if (user.bot) {
      return interaction.reply({ content: 'Botları whitelist\'ten çıkaramazsınız.', ephemeral: true });
    }
    const userIndex = config.whitelist.indexOf(user.id);
    if (userIndex === -1) {
      return interaction.reply({ content: `${user.tag} zaten whitelist\'te değil.`, ephemeral: true });
    }
    config.whitelist.splice(userIndex, 1);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    return interaction.reply({ content: `${user.tag} başarıyla whitelist\'ten çıkarıldı.`, ephemeral: true });
  }
};
