export const generateId = () => {
	const radix = 16;
	const numberOfSymbolsToRemove = 2;
	return Math.random().toString(radix).slice(numberOfSymbolsToRemove);
};
