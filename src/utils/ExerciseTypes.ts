export type ExerciseData = {
	set1: {
		weight: number,
		reps: number
	},
	set2: {
		weight: number,
		reps: number
	},
	set3: {
		weight: number,
		reps: number
	}
}

export type Exercise = {
	id: string,
	name: string,
	type: "Dumbbell" | "Bar" | "Machine",
	data: ExerciseData
}

export type ExerciseItem = {
	id: string,
	name: string,
	type: "Dumbbell" | "Bar" | "Machine"
}