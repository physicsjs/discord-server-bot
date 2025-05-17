const { SlashCommandBuilder } = require('discord.js');

function süreyiMsYap(süreStr) {
  const süreRegex = /^(\d+)(s|m|h|d)$/;
  const eşleşme = süreStr.match(süreRegex);
  if (!eşleşme) return null;

  const sayı = parseInt(eşleşme[1]);
  const birim = eşleşme[2];

  const çarpanlar = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return sayı * çarpanlar[birim];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('çekiliş')
    .setDescription('Çekiliş başlatır.')
    .addStringOption(option =>
      option.setName('süre')
        .setDescription('Çekiliş süresi (örnek: 10s, 5m, 2h, 1d)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('ödül')
        .setDescription('Çekiliş ödülü')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'Bu komutu sadece yöneticiler kullanabilir.', ephemeral: true });
    }

    const süreStr = interaction.options.getString('süre');
    const ödül = interaction.options.getString('ödül');

    const süreMs = süreyiMsYap(süreStr);
    if (!süreMs || süreMs <= 0) {
      return interaction.reply({ content: 'Geçerli bir süre girin! (örn: 10s, 5m, 2h, 1d)', ephemeral: true });
    }

    const mesaj = await interaction.reply({
      embeds: [{
        title: `🎉 Çekiliş Başladı!`,
        description: `Ödül: **${ödül}**\nSüre: **${süreStr}**\nKatılmak için 🎉 tepkisine tıkla!`,
        color: 0x2ecc71,
        footer: { text: 'Unpixel Çekiliş Sistemi' }
      }],
      fetchReply: true
    });

    await mesaj.react('🎉');

    setTimeout(async () => {
      const msg = await interaction.channel.messages.fetch(mesaj.id);
      const reaction = msg.reactions.cache.get('🎉');
      await reaction.users.fetch();

      const katılanlar = reaction.users.cache.filter(u => !u.bot).map(u => u.id);
      if (katılanlar.length === 0) {
        return interaction.followUp('Kimse katılmadı, çekiliş iptal edildi.');
      }

      const kazananID = katılanlar[Math.floor(Math.random() * katılanlar.length)];
      interaction.followUp(`🎉 Tebrikler <@${kazananID}>! **${ödül}** kazandın!`);
    }, süreMs);
  }
};
