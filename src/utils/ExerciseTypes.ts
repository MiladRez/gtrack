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

export type Exercise = ExerciseItem & {
	data: ExerciseData
}

export type ExerciseItem = {
	id: string,
	name: string,
	type: "Dumbbell" | "Bar" | "Machine"
}

export type Session = {
	_id: string,
	date: Date,
	exerciseList: Map<string, Exercise>
}