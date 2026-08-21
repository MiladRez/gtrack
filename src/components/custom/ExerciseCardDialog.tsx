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

	// delays function call to post to db by 500ms, using useCallback to prevent page rerendering
	const debouncedUpdate = useCallback(
		debounce((updatedValues: ExerciseData) => {
			handleUpdateExerciseData(updatedValues);
		}, 500),
		[]
	);

	return (
		<div className="grid w-full max-w-xl border border-slate-700 rounded-lg bg-slate-800">
			<div className="grid col-span-2 mx-6 my-6">
				<div className="grid grid-cols-3">
					<h2 className="px-2 text-lg self-center uppercase">Set 1</h2>
					<div className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set1" entryType="weight" />
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set1" entryType="reps" />
					</div>
				</div>
				<Separator className="bg-slate-600 my-6" />
				<div className="grid grid-cols-3">
					<h2 className="px-2 text-lg self-center uppercase">Set 2</h2>
					<div className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set2" entryType="weight" />
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set2" entryType="reps" />
					</div>
				</div>
				<Separator className="bg-slate-600 my-6" />
				<div className="grid grid-cols-3">
					<h2 className="px-2 text-lg self-center uppercase">Set 3</h2>
					<div className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set3" entryType="weight" />
						<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set3" entryType="reps" />
					</div>
				</div>
			</div>
		</div>
	)
}