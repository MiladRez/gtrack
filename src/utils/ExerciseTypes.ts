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

export type ExerciseItem = {
	id: string,
	name: string,
	method: "Dumbbells" | "Machine" | "Barbell" | "Cable",
	group: "Push" | "Pull" | "Legs",
	data: ExerciseData | undefined
}

export type Session = {
	_id: string,
	type: string,
	date: Date,
	exerciseList: Record<string, ExerciseItem>
}

export type SessionSummary = Pick<Session, "_id" | "type" | "date"> & {
	exerciseCount: number
}

export type TodaysSession = Session & {
	previousExerciseData: Record<string, ExerciseData>
}
