const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anime-tahmin')
    .setDescription('Rastgele bir anime karakteri hakkında tahmin oyunu başlatır.'),

  async execute(interaction) {
    try {
      const query = `
        query {
          Page(page: ${Math.floor(Math.random() * 100)}, perPage: 1) {
            characters {
              name {
                full
              }
              image {
                large
              }
              media {
                nodes {
                  title {
                    romaji
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const character = data.data.Page.characters[0];
      const characterImage = character.image.large;
      const animeTitle = character.media.nodes[0].title.romaji.toLowerCase();

      const embed = new EmbedBuilder()
        .setTitle('🧠 Anime Tahmin Oyunu')
        .setDescription(`Bu karakter hangi animeye ait? 15 saniyen var!`)
        .setImage(characterImage)
        .setColor('Random');

      await interaction.reply({ embeds: [embed] });

      const filter = msg => msg.author.id === interaction.user.id;

      const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

      collector.on('collect', async msg => {
        const userAnswer = msg.content.toLowerCase();
        if (animeTitle.includes(userAnswer)) {
          await msg.reply('🎉 Doğru tahmin! Tebrikler!');
        } else {
          await msg.reply(`❌ Yanlış tahmin. Doğru cevap: **${animeTitle}**`);
        }
      });

      collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
          await interaction.followUp(`⏰ Süre doldu! Doğru cevap: **${animeTitle}**`);
        } else if (collected.size === 0) {
          await interaction.followUp('⏰ Süre doldu! Cevap gelmedi.');
        }
      });

    } catch (err) {
      console.error('Bir hata oluştu:', err);
      await interaction.reply({ content: '❌ Bir hata oluştu, tekrar deneyin.', ephemeral: true });
    }
  }
};
