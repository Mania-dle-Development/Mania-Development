// returns an error message, or null if the word is okay
export default function validateWord(word, length) {
	const clean = word.trim().toUpperCase();
	if (!/^[A-Z]+$/.test(clean)) return "Letters only, please.";
	if (clean.length !== length) return `Your word needs ${length} letters.`;
	return null;
}