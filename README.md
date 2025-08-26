# Groq Translate Discord Bot

## 概要
Groq APIとDiscordを連携した多言語翻訳Botです。スラッシュコマンドでテキストを翻訳し、ユーザーごとにターゲット言語を設定できます。

- `/translate` : 入力言語→ターゲット言語に翻訳
- `/target` : 翻訳ターゲット言語をユーザーごとに設定
- 4言語対応（日本語・英語・韓国語・中国語）
- 入力言語は自動判定（かな/カナ優先、日本語混在文も正確判定）
- Groq APIの訳文のみを表示、ラベルはBot側で固定

## 使い方
1. `.env` ファイルに以下を記述
   ```
   GROQ_API_KEY = GroqのAPIキー
   DISCORD_TOKEN = Discord Botトークン
   MODEL = 推奨モデル名
   ```
2. 依存パッケージをインストール
   ```
   npm install
   ```
3. Botを起動
   ```
   npm start
   ```
4. Discordで `/target` で言語を設定し、`/translate` で翻訳

## コマンド例
- `/target lang:ja` → ターゲット言語を日本語に設定
- `/translate text:Hello!` → 英語→日本語に翻訳

## ファイル構成
- `src/main.js` : Bot本体・コマンド処理
- `src/utils/groq.js` : Groq APIラッパー（訳文のみ返す）
- `.env` : APIキー・トークン・モデル名

## ライセンス
MIT
