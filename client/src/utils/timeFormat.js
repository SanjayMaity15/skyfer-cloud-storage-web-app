export const timeFormat = (time) => {
    return new Date(time).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

