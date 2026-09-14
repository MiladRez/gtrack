import {ExerciseItem} from "./ExerciseTypes";

const pushExercises: Record<string, ExerciseItem["method"]> = {
	"Incline Bench Press": "Machine", // 1
	"Flat Bench Press": "Barbell", // 2
	"Machine Chest Press": "Machine", // 3
	"Chest Fly": "Machine", // 4
	"Shoulder Press": "Dumbbells", // 5
	"Shoulder Lateral Raises": "Cable", // 6
	"Tricep Pull Down": "Cable", // 7
	"Overhead Tricep Extension": "Cable", // 8
	"Dips": "Machine",	 // 9
}

const pullExercises: Record<string, ExerciseItem["method"]> = {
	"Lat Pull Down": "Machine", // 1
	"Face Pull": "Cable", // 2
	"Sitting Row": "Cable", // 3
	"T-bar Row": "Machine", // 4
	"Bicep Curl": "Dumbbells", // 5
	"Hammer Curl": "Dumbbells", // 6
	"Forearm Curl": "Dumbbells", // 7
	"Forearm Reverse Curl": "Cable", // 8
	"Back Extension": "Machine",	 // 9
}

const legExercises: Record<string, ExerciseItem["method"]> = {
	"Leg Press": "Machine", // 1
	"Leg Extension": "Machine", // 2
	"Hamstring Curl": "Machine", // 3
	"Calf Raises": "Machine", // 4
	"Squats": "Barbell", // 5
	"Lunges": "Dumbbells" // 6
}

export const pushExercisesList: ExerciseItem[] = Object.entries(pushExercises).map(([name, method], index) => {
	return {
		id: String(index + 1),
		name: name,
		method: method,
		group: "Push",
		data: undefined
	}
})

export const pullExercisesList: ExerciseItem[] = Object.entries(pullExercises).map(([name, method], index) => {
	return {
		id: String(index + 1),
		name: name,
		method: method,
		group: "Pull",
		data: undefined
	}
})

export const legExercisesList: ExerciseItem[] = Object.entries(legExercises).map(([name, method], index) => {
	return {
		id: String(index + 1),
		name: name,
		method: method,
		group: "Legs",
		data: undefined
	}
})

// export const allExercisesList: ExerciseItem[] = [...pushExercisesList, ...pullExercisesList, ...legExercisesList].map((exercise, index) => ({
// 	...exercise,
// 	id: String(index + 1),
// }));