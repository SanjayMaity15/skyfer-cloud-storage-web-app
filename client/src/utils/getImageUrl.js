export const getImageUrl = (imgName) => {
	return new URL(`../assets/${imgName}`, import.meta.url).href;
};
