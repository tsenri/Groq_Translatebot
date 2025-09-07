# Groq Translate Discord Bot

## 概要
GroqAPIとDiscordを連携した4ヵ国語翻訳Bot(日本語・中国語・英語・韓国語)です。スラッシュコマンドでテキストを翻訳し、ユーザーごとにターゲット言語を設定できます。GPT-5を使用して作ったbotです。
先にGroqCloudにログインしてAPIキーを取得してください。
https://console.groq.com/keys

スラッシュコマンド一覧
- `/translate` : 入力言語→ターゲット言語に翻訳
- `/target` : ユーザーごとに翻訳ターゲット言語を設定できます。
- 4言語対応（日本語・英語・韓国語・中国語）
- 入力文字種から簡易判定（かな/カナがあれば日本語優先）
- Groq APIの訳文のみを表示、ラベルはBot側で固定

## 使い方
1. `.env.exanple` を`.env`にリネームし、ファイルに以下を記述
   ```
   GROQ_API_KEY = GroqのAPIキー
   DISCORD_TOKEN = Discord Botトークン
   MODEL = モデル名
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

5. もしもAPIエラーが発生した場合、ターミナルで以下のように設定してから実行してください
    ```
    $env:GROQ_API_KEY = "YOUR_API_KEY"
    ```

## コマンド例
- `/target lang:ja` → ターゲット言語を日本語に設定
- `/translate text:Hello!` → 英語→日本語に翻訳

## ファイル構成
- `src/main.js` : Bot本体・コマンド処理
- `src/utils/groq.js` : Groq APIラッパー（訳文のみ返す）
- `.env` : APIキー・トークン・モデル名

## ライセンス
MIT








