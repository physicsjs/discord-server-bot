const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolver')
    .setDescription('Bir kullanıcıya belirlediğin rolü verir.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Rol verilecek kullanıcı')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Verilecek rol')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const user = interaction.options.getMember('kullanıcı');
    const role = interaction.options.getRole('rol');

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: 'Benim **Rolleri Yönet** yetkim yok!',
        ephemeral: true
      });
    }

    if (!user) {
      return interaction.reply({
        content: 'Kullanıcı bulunamadı.',
        ephemeral: true
      });
    }

    if (user.roles.cache.has(role.id)) {
      return interaction.reply({
        content: 'Bu kullanıcı zaten bu role sahip.',
        ephemeral: true
      });
    }

    try {
      await user.roles.add(role);
      await interaction.reply({
        content: `✅ ${user} kullanıcısına **${role.name}** rolü verildi.`,
        ephemeral: false
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Rol verilirken bir hata oluştu.',
        ephemeral: true
      });
    }
  }
};
