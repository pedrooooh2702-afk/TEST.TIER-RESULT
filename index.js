const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  SlashCommandBuilder,
  REST,
  Routes
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// ====== CONFIGURAÇÕES ======
const TOKEN = 'MTU2OTg0NjM1MjI5NTM2Njc4Nw.GVfTez.d3aYZpeo3PucClTZhYdNEJcAi2VLv0Fk4eX4wA';
const CLIENT_ID = '1569846352295366787'; // ID da aplicação
const GUILD_ID = '1518402568198553610'; // opcional (para registrar rápido)

// Link que o botão "Ver perfil completo" vai abrir
const LINK_PERFIL = 'https://seusite.com/perfil'; // troque pelo seu link

// ============================

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

// Registra o comando /resultado
const commands = [
  new SlashCommandBuilder()
    .setName('resultado')
    .setDescription('Envia o resultado de um teste')
    .addStringOption(opt => 
      opt.setName('jogador')
        .setDescription('Nick do jogador')
        .setRequired(true))
    .addStringOption(opt => 
      opt.setName('pais')
        .setDescription('País do jogador')
        .setRequired(true))
    .addStringOption(opt => 
      opt.setName('modo')
        .setDescription('Modo do teste (ex: Sword, Crystal, Pot, etc)')
        .setRequired(true))
    .addStringOption(opt => 
      opt.setName('tier_atual')
        .setDescription('Tier atual (ex: Low Tier 5)')
        .setRequired(true))
    .addStringOption(opt => 
      opt.setName('tier_anterior')
        .setDescription('Tier anterior (ex: Sem Ranque)')
        .setRequired(true))
    .addUserOption(opt => 
      opt.setName('tester')
        .setDescription('Quem testou')
        .setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registrando comandos...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Comandos registrados!');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'resultado') {
    const jogador = interaction.options.getString('jogador');
    const pais = interaction.options.getString('pais');
    const tierAtual = interaction.options.getString('tier_atual');
    const tierAnterior = interaction.options.getString('tier_anterior');
    const tester = interaction.options.getUser('tester');

    // Embed igual da SA
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31) // cor escura igual
      .setAuthor({ 
        name: `Resultado do teste de ${jogador}`,
        iconURL: `https://mc-heads.net/avatar/${jogador}`
      })
      .addFields(
        { name: 'Jogador:', value: jogador, inline: true },
        { name: 'País:', value: pais, inline: true },
        { name: 'Tier atual:', value: tierAtual, inline: true },
        { name: 'Tier anterior:', value: tierAnterior, inline: false },
        { name: 'Tester:', value: `<@${tester.id}>`, inline: false }
      )
      .setThumbnail(`https://mc-heads.net/avatar/${jogador}`)
      .setFooter({ 
        text: 'TEST TIER', // troque pelo nome do seu servidor
        iconURL: client.user.displayAvatarURL()
      })
      .setTimestamp();

    // Botão "Ver perfil completo"
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Ver perfil completo')
          .setStyle(ButtonStyle.Link)
          .setURL(`${LINK_PERFIL}/${jogador}`) // ou um link fixo
          .setEmoji('🔗')
      );

    const msg = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });

  }
});

client.login(TOKEN);