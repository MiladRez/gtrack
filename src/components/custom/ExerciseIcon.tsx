type ExerciseIconProps = {
	method: "Dumbbells" | "Barbell" | "Machine" | "Cable"
	color?: "black" | "white"
}

export default function ExerciseIcon({method, color = "black"}: ExerciseIconProps) {
	const colorClass = color === "white" ? "text-white" : "text-black";
	const iconClass = `${colorClass} fill-current`;

	switch (method) {
		case "Dumbbells":
			return (
				<svg className={`${iconClass} w-5 h-5 mr-[2px]`}>
					<use href="/icons.svg#icon-dumbbell" />
				</svg>
			)
		case "Barbell":
			return (
				<svg className={`${iconClass} w-6 h-6`}>
					<use href="/icons.svg#icon-barbell" />
				</svg>
			)
		case "Machine":
			return (
				<svg className={`${iconClass} w-6 h-6`}>
					<use href="/icons.svg#icon-machine" />
				</svg>
			)
		case "Cable":
			return (
				<svg className={`${iconClass} w-6 h-6`}>
					<use href="/icons.svg#icon-cable" />
				</svg>
			)
		default:
			return (
				<svg className={`${iconClass} w-6 h-6`}>
					<use href="/icons.svg#spinner" />
				</svg>
			)
	}
}