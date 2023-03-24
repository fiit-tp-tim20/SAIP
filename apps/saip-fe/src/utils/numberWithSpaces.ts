function numberWithSpaces(value: number | string | null | undefined) {
	if (value !== 0 && !value) return "N/A";

	const valueString = value.toString();

	const [integer, decimal] = valueString.split(".");
	return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}${decimal ? `,${decimal}` : ""}`;
}

export default numberWithSpaces;
