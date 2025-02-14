export default function ExerciseIconDropdownMenu({type}: {type: "Dumbbell" | "Bar" | "Machine"}) {
	switch (type) {
		case "Dumbbell":
			return (
				<svg className="!w-5 !h-5 mr-[2px]">
					<use href="/icons.svg#dumbbell" />
				</svg>
			)
		case "Bar":
			return (
				<svg className="!w-6 !h-6">
					<use href="/icons.svg#barbell" />
				</svg>
			)
		case "Machine":
			return (
				<svg stroke="black" className="!w-6 !h-6">
					<use href="/icons.svg#machine" />
				</svg>
			)
		default:
			return (
				<svg className="!w-6 !h-6">
					<use href="/icons.svg#spinner" />
				</svg>
			)
	}
}