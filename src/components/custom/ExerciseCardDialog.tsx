import {useCallback, useState} from "react";
import ExerciseCardInput from "./ExerciseCardInput";
import debounce from "lodash.debounce";
import {Separator} from "../ui/separator";
import {ExerciseItem, ExerciseData} from "@/utils/ExerciseTypes";

type ExerciseCardDialogProps = {
	exercise: ExerciseItem | null,
	handleUpdateExerciseData: (data: ExerciseData | undefined) => void
}

export default function ExerciseCardDialog({exercise, handleUpdateExerciseData}: ExerciseCardDialogProps) {
	
	const {data} = exercise!;

	const [displayValues, setDisplayValues] = useState(data);

	return (
		<div className="w-full max-w-xl py-4 px-4 rounded-3xl bg-app-secondary">
			<div className="grid grid-cols-5 gap-2 text-sm text-[#a4a7b0] py-3">
				<div className="col-span-1">Set</div>
				<div className="col-span-2">Lbs</div>
				<div className="col-span-2">Reps</div>
			</div>
			<div className="flex flex-col gap-1">
				<div className="grid grid-cols-5 gap-2 items-center">
					<div className="col-span-1 flex size-10 items-center justify-center rounded-full font-semibold bg-[#242731] text-[#a4a7b0]">1</div>
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set1" entryType="weight" />
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set1" entryType="reps" />
				</div>
				<Separator className="bg-[#2b2d35] my-2" />
				<div className="grid grid-cols-5 gap-2 items-center">
					<div className="col-span-1 flex size-10 items-center justify-center rounded-full font-semibold bg-[#242731] text-[#a4a7b0]">2</div>
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set2" entryType="weight" />
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set2" entryType="reps" />
				</div>
				<Separator className="bg-[#2b2d35] my-2" />
				<div className="grid grid-cols-5 gap-2 items-center">
					<div className="col-span-1 flex size-10 items-center justify-center rounded-full font-semibold bg-[#242731] text-[#a4a7b0]">3</div>
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set3" entryType="weight" />
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set3" entryType="reps" />
				</div>
			</div>
		</div>
	)
}