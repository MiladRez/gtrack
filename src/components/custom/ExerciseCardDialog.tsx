import {useState} from "react";
import ExerciseCardInput from "./ExerciseCardInput";
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
		<div className="w-full max-w-xl rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-4 py-4">
			<div className="grid grid-cols-5 gap-2 py-3 text-sm text-white/45">
				<div className="col-span-1">Set</div>
				<div className="col-span-2">Lbs</div>
				<div className="col-span-2">Reps</div>
			</div>
			<div className="flex flex-col gap-1">
				<div className="grid grid-cols-5 gap-2 items-center">
					<div className="col-span-1 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] font-semibold text-white/55">1</div>
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set1" entryType="weight" />
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set1" entryType="reps" />
				</div>
				<Separator className="my-2 bg-white/10" />
				<div className="grid grid-cols-5 gap-2 items-center">
					<div className="col-span-1 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] font-semibold text-white/55">2</div>
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set2" entryType="weight" />
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set2" entryType="reps" />
				</div>
				<Separator className="my-2 bg-white/10" />
				<div className="grid grid-cols-5 gap-2 items-center">
					<div className="col-span-1 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] font-semibold text-white/55">3</div>
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set3" entryType="weight" />
					<ExerciseCardInput displayValues={displayValues} setDisplayValues={setDisplayValues} handleUpdateExerciseData={handleUpdateExerciseData} setString="set3" entryType="reps" />
				</div>
			</div>
		</div>
	)
}
