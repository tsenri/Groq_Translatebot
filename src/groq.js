import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

export async function translateText(text, targetLang) {
	const res = await groq.chat.completions.create({
		model: GROQ_MODEL,
		messages: [
			{
				role: 'system',
				content:
					`You are a translation engine. Translate the user text into ${targetLang}. ` +
					`Return ONLY the translation, no labels, no quotes, no explanations.`
			},
			{ role: 'user', content: text }
		],
		max_tokens: 256,
	});
	return res.choices?.[0]?.message?.content?.trim() ?? '';
}
