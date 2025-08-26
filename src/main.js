import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { translateText } from './groq.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --- 言語ユーティリティ ---
const LABEL = { ja: 'JA', en: 'EN', ko: 'KR', zh: 'ZH' };
const NORMALIZE = (s) => {
  const x = String(s || '').trim().toLowerCase();
  if (['ja','jp','japanese','nihongo','日本語'].includes(x)) return 'ja';
  if (['en','eng','english','英語'].includes(x)) return 'en';
  if (['ko','kr','korean','한국어','韓国語'].includes(x)) return 'ko';
  if (['zh','cn','chinese','中文','中国語','漢語'].includes(x)) return 'zh';
  return null;
};
// 入力言語の簡易検出（優先度: JA > KO > ZH > EN）
function detectLang(s) {
  // JA: ひらがな/カタカナ/半角ｶﾅ/拡張
  const hasJa =
    /[\u3040-\u309F]/.test(s) ||
    /[\u30A0-\u30FF]/.test(s) ||
    /[\uFF66-\uFF9F]/.test(s) ||
    /[\u31F0-\u31FF]/.test(s);

  // KO: ハングル
  const hasKo =
    /[\u1100-\u11FF]/.test(s) ||
    /[\u3130-\u318F]/.test(s) ||
    /[\uAC00-\uD7A3]/.test(s);

  // ZH: CJK（漢字）※かな/カナを含む
  const hasZh =
    /[\u4E00-\u9FFF]/.test(s) ||
    /[\u3400-\u4DBF]/.test(s);

  if (hasJa) return 'ja';
  if (hasKo) return 'ko';
  if (hasZh) return 'zh';
  return 'en';
}

// --- /target をユーザー単位で保持 ---
const userTarget = new Map(); // userId -> 'ja'|'en'|'ko'|'zh'
const getTarget = (uid) => userTarget.get(uid) || 'en';

// スラッシュコマンド一覧
const commands = [
  new SlashCommandBuilder()
    .setName('translate')
    .setDescription('テキストを翻訳します（入力言語→/target 設定言語）')
    .addStringOption(o => o.setName('text').setDescription('翻訳する内容').setRequired(true)),
  new SlashCommandBuilder()
    .setName('target')
    .setDescription('翻訳ターゲット言語を変更します')
    .addStringOption(o =>
      o.setName('lang')
       .setDescription('言語')
       .setRequired(true)
       .addChoices(
         { name: '日本語 (ja)', value: 'ja' },
         { name: 'English (en)', value: 'en' },
         { name: '한국어 (ko)', value: 'ko' },
         { name: '中文 (zh)', value: 'zh' },
       )
    )
].map(c => c.toJSON());

client.once('clientReady', async () => {
  console.log(`Bot is ready as ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
  console.log('スラッシュコマンド登録完了');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'target') {
    const raw = interaction.options.getString('lang');
    const norm = NORMALIZE(raw) || raw;
    if (!['ja','en','ko','zh'].includes(norm)) {
      return interaction.reply('対応しているのは ja/en/ko/zh だけ。');
    }
    userTarget.set(interaction.user.id, norm);
    return interaction.reply(`翻訳ターゲット言語を「${LABEL[norm]}」に設定した。`);
  }

  if (interaction.commandName === 'translate') {
    const text = interaction.options.getString('text');
    const src = detectLang(text);
    const tgt = getTarget(interaction.user.id);

    await interaction.deferReply();

    try {
      let translated = '';
      if (src === tgt) {
        translated = text;
      } else {
        translated = await translateText(text, tgt);
      }

      const lines = [
        `[${LABEL[src]}] ${text}`,
        `[${LABEL[tgt]}] ${translated}`,
      ].join('\n');

      const embed = {
        author: { name: interaction.user.username, icon_url: interaction.user.displayAvatarURL() },
        description: lines
      };
      await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      await interaction.editReply('翻訳中にエラーが発生した。');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);



