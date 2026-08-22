import {Exercise, ExerciseData} from "@/utils/ExerciseTypes";
import ExerciseIconDropdownMenu from "./ExerciseIconDropdownMenu";
import ProgressIcons from "./ProgressIcons";

type ExerciseCardProps = {
	exercise: Exercise;
};

export default function ExerciseCard({exercise}: ExerciseCardProps) {

	const displayExerciseData = (set: "set1" | "set2" | "set3") => {
		if (exercise.data[set].weight == 0 || exercise.data[set].reps == 0) {
			return (
				<div className="text-muted-foreground">-</div>
			)
		} else {
			return (
				<div>{exercise.data[set].weight} lbs x {exercise.data[set].reps}</div>
			)
		}
	}

	const displayProgressIcons = (set: "set1" | "set2" | "set3") => {
		const prevVolume = exercise.data[set].weight * exercise.data[set].reps;
		const currVolume = exercise.data[set].weight * exercise.data[set].reps;

		if (prevVolume < currVolume) {
			return (
				<ProgressIcons type="up-arrow" />
			)
		} else if (prevVolume > currVolume) {
			return (
				<ProgressIcons type="down-arrow" />
			)
		} else {
			return (
				<ProgressIcons type="equals" color="white" />
			)
		}
	}

	return (
		<div className="bg-app-primary px-4 py-4 border border-app-primary-border rounded-xl flex flex-col gap-4 focus:outline-none">
			<div className="flex gap-4">
				<div className="border border-app-primary-border rounded-md px-2 py-2">
					<ExerciseIconDropdownMenu type={exercise.type} color="white" />
				</div>
				<div className="mt-1 text-highlight">
					{exercise.name}
				</div>
			</div>
			<div className="flex flex-col gap-6">
				<div className="grid grid-cols-[0.35fr_1fr_1fr_0.35fr] place-items-start text-neutral-400 uppercase text-sm">
					<div>Set</div>
					<div>Previous</div>
					<div>Today</div>
					<div>Progress</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-[0.35fr_1fr_1fr_0.35fr] place-items-start text-sm">
						<div className="pl-1">1</div>
						<div>{exercise.data.set1.weight} lbs x {exercise.data.set1.reps}</div>
						{displayExerciseData("set1")}
						{displayProgressIcons("set1")}
					</div>
					<div className="grid grid-cols-[0.35fr_1fr_1fr_0.35fr] place-items-start text-sm">
						<div className="pl-1">2</div>
						<div>{exercise.data.set2.weight} lbs x {exercise.data.set2.reps}</div>
						{displayExerciseData("set2")}
						{displayProgressIcons("set2")}
					</div>
					<div className="grid grid-cols-[0.35fr_1fr_1fr_0.35fr] place-items-start text-sm">
						<div className="pl-1">3</div>
						<div>{exercise.data.set3.weight} lbs x {exercise.data.set3.reps}</div>
						{displayExerciseData("set3")}
						{displayProgressIcons("set3")}
					</div>
				</div>
				
			</div>
		</div>
	);
}
