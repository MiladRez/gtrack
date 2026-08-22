import {useCallback, useState} from "react";
import ExerciseCardInput from "./ExerciseCardInput";
import debounce from "lodash.debounce";
import {Separator} from "../ui/separator";
import {Exercise, ExerciseData} from "@/utils/ExerciseTypes";

type ExerciseCardDialogProps = {
	exercise: Exercise | null,
	handleUpdateExerciseData: (data: ExerciseData) => void
}

export default function ExerciseCardDialog({exercise, handleUpdateExerciseData}: ExerciseCardDialogProps) {
	
	const {data} = exercise!;

	const [displayValues, setDisplayValues] = useState(data);

	return (
		<div className="w-full max-w-xl mb-6 px-4">
			<div className="flex flex-col gap-6">
				<div className="grid grid-cols-2">
					<div className="text-lg px-2 mt-2">SET 1</div>
					<div className="flex justify-around">
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set1" entryType="weight" />
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set1" entryType="reps" />
					</div>
				</div>
				<Separator className="bg-slate-600 my-2" />
				<div className="grid grid-cols-2">
					<div className="text-lg px-2 mt-2">SET 2</div>
					<div className="flex justify-around">
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set2" entryType="weight" />
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set2" entryType="reps" />
					</div>
				</div>
				<Separator className="bg-slate-600 my-2" />
				<div className="grid grid-cols-2">
					<div className="text-lg px-2 mt-2">SET 3</div>
					<div className="flex justify-around">
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set3" entryType="weight" />
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set3" entryType="reps" />
					</div>
				</div>
			</div>
		</div>
	)
}