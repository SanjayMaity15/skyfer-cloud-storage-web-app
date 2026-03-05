export const truncateFileName = (name) => {
	const words = name.split(/\W/);

	if (words.length <= 4) return name;

	return words.slice(0, 4).join(" ") + "...";
};
