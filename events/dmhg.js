const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const moment = require('moment');
require('moment/locale/tr');
moment.locale('tr');

const db = require('croxydb');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const roleID = db.get(`otorol_${member.guild.id}`);
    const role = member.guild.roles.cache.get(roleID);

    const canvas = createCanvas(800, 300);
    const ctx = canvas.getContext('2d');

    const background = await loadImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.wallpapersden.com%2Fimage%2Fdownload%2Fitachi-uchiha-4k-naruto-red-night_bmZsaWWUmZqaraWkpJRobWllrWZubGo.jpg&f=1&nofb=1&ipt=1bef489c12fc55b8bf1836427b3145a36c952c190ab1229bc822d616bed5b3cf');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Hoş Geldin, ${member.user.username}!`, 50, 60);
    ctx.font = '22px sans-serif';
    ctx.fillText(`Hesap oluşturulma: ${moment(member.user.createdAt).format('LLL')}`, 50, 100);
    ctx.fillText(`Güvenlik durumu: ${moment().diff(member.user.createdAt, 'days') > 7 ? 'Güvenli ✅' : 'Şüpheli ⚠️'}`, 50, 127);
    ctx.fillText(`ID: ${member.id}`, 50, 180);
    ctx.fillText(`Verilen Rol: ${role ? role.name : 'Ayarlanmamış'}`, 50, 220);
    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png' }));
    ctx.beginPath();
    ctx.arc(700, 90, 64, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 636, 26, 128, 128);
    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'hosgeldin.png' });
    const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Sunucumuza hoş geldin!')
      .setDescription(`Kuralları okumayı unutma, sana **${role ? role.name : 'bir rol'}** verildi.`)
      .setImage('attachment://hosgeldin.png')
      .setFooter({ text: 'UnPixel Bots | Developed by physics' });

    try {
      await member.send({ embeds: [embed], files: [attachment] });
    } catch (err) {
      console.log('DM gönderilemedi:', err.message);
    }

    if (role) await member.roles.add(role).catch(console.error);
  }
};
