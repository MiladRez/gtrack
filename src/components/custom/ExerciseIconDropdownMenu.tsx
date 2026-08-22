type ExerciseIconDropdownMenuProps = {
	type: "Dumbbell" | "Bar" | "Machine"
	color?: "black" | "white"
}

export default function ExerciseIconDropdownMenu({type, color = "black"}: ExerciseIconDropdownMenuProps) {
	const colorClass = color === "white" ? "text-white" : "text-black";
	const iconClass = `${colorClass} fill-current`;

	switch (type) {
		case "Dumbbell":
			return (
				<svg className={`${iconClass} w-5 h-5 mr-[2px]`}>
					<use href="/icons.svg#dumbbell" />
				</svg>
			)
		case "Bar":
			return (
				<svg className={`${iconClass} w-6 h-6`}>
					<use href="/icons.svg#barbell" />
				</svg>
			)
		case "Machine":
			return (
				<svg className={`${iconClass} w-6 h-6`}>
					<use href="/icons.svg#machine" />
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