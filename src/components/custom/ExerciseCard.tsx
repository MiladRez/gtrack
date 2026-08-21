import {Exercise, ExerciseData} from "@/utils/ExerciseTypes";

type ExerciseCardProps = {
	exercise: Exercise;
	updateExerciseList: (exerciseID: string, data: ExerciseData) => void;
};

export default function ExerciseCard({exercise, updateExerciseList}: ExerciseCardProps) {
	return (
		<div>
			<div>{exercise.name}</div>
			<div>
				<div>
					Set 1: <span>{exercise.data.set1.weight} lbs for </span>
					<span>{exercise.data.set1.reps} reps</span>
				</div>
				<div>
					Set 2: <span>{exercise.data.set2.weight} lbs for </span>
					<span>{exercise.data.set2.reps} reps</span>
				</div>
				<div>
					Set 3: <span>{exercise.data.set3.weight} lbs for </span>
					<span>{exercise.data.set3.reps} reps</span>
				</div>
			</div>
		</div>
	);
}
