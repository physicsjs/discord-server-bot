const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kasa-ac')
    .setDescription('Rastgele bir CS:GO kasası açar ve içinden rastgele bir skin verir.'),

  async execute(interaction) {
    try {
      const cratesResponse = await axios.get('https://bymykel.github.io/CSGO-API/api/tr/crates.json');
      const crates = cratesResponse.data;

      const randomCrate = crates[Math.floor(Math.random() * crates.length)];

      const skins = randomCrate.contains;

      if (!skins || skins.length === 0) {
        return interaction.reply({ content: 'Seçilen kasa boş.', ephemeral: true });
      }

      const randomSkin = skins[Math.floor(Math.random() * skins.length)];

      const embed = {
        color: 0x0099ff,
        title: `${randomCrate.name} Kasası Açıldı!`,
        description: `🎉 Tebrikler! **${randomSkin.name}** kazandınız!`,
        image: {
          url: randomSkin.image
        },
        footer: {
          text: `Nadirlik: ${randomSkin.rarity.name}`
        }
      };

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.', ephemeral: true });
    }
  }
};
