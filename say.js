const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('message').setDescription('whatever you want the bot to say').setRequired(true)),

    async execute(interaction) {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) { return interaction.reply({ content: 'nah you cant use this', ephemeral: true }); }

        const now = Date.now();
        const last = cooldowns.get(interaction.user.id);

        if (last && now - last < 10000) { const left = Math.ceil((10000 - (now - last)) / 1000); return interaction.reply({ content: `chill, wait ${left}s`, ephemeral: true }); }

        const msg = interaction.options.getString('message');
        cooldowns.set(interaction.user.id, now); // idk

        await interaction.channel.send(msg);
        await interaction.reply({ content: 'done', ephemeral: true });

        setTimeout(() => { interaction.deleteReply().catch(() => { }); }, 3000);
    }
};