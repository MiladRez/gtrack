type ProgressIconsProps = {
	type: "equals" | "down-arrow" | "up-arrow"
	color?: "black" | "white"
}

export default function ProgressIcons({type, color = "black"}: ProgressIconsProps) {
	const colorClass = color === "white" ? "text-white" : "text-black";
	const iconClass = `${colorClass} fill-current`;

	switch (type) {
		case "equals":
			return (
				<svg className={`${iconClass} w-5 h-5`}>
					<use href="/icons.svg#equals" />
				</svg>
			)
		case "down-arrow":
			return (
				<svg className={`w-5 h-5 fill-[#dd1c1a]`}>
					<use href="/icons.svg#down-arrow" />
				</svg>
			)
		case "up-arrow":
			return (
				<svg className={`w-5 h-5 rotate-180 fill-[#7ae582]`}>
					<use href="/icons.svg#down-arrow" />
				</svg>
			)
		default:
			return (
				<svg className={`${iconClass} w-5 h-5`}>
					<use href="/icons.svg#spinner" />
				</svg>
			)
	}
}