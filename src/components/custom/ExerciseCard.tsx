import { Exercise, ExerciseData } from "@/app/push/page"
import { useCallback, useEffect, useState } from "react";
import ExerciseCardInput from "./ExerciseCardInput";
import debounce from "lodash.debounce";

type ExerciseCardProps = {
	exercise: Exercise,
	updateExerciseList: Function
}

export default function ExerciseCard({exercise, updateExerciseList}: ExerciseCardProps) {
	
	const {id, name, type, data} = exercise;

	const [displayValues, setDisplayValues] = useState(data);

	// delays function call to post to db by 500ms
	const debouncedUpdate = useCallback(
		debounce((updatedValues: ExerciseData) => {
			updateExerciseList(id, updatedValues);
		}, 500),
		[id]
	);

	return (
		<table className="grid w-full max-w-xl">
			<thead className="col-span-2 flex justify-center border border-b-0 border-slate-600 rounded-t-3xl bg-slate-950 py-2">
				<tr>
					<th className="py-4 px-2 text-white">{ name }</th>
				</tr>
			</thead>
			<tbody className="grid col-span-2 bg-slate-950 border border-t-0 border-slate-600 rounded-b-3xl">
				<tr className="grid grid-cols-3 py-4 mx-6 border-b border-slate-800">
					<td className="px-2 text-lg self-center uppercase">Set 1</td>
					<td className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set1" entryType="weight" />
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set1" entryType="reps" />
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-4 mx-6 border-b border-slate-800">
					<td className="px-2 text-lg self-center uppercase">Set 2</td>
					<td className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set2" entryType="weight" />
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set2" entryType="reps" />
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-4 mx-6">
					<td className="px-2 text-lg self-center uppercase">Set 3</td>
					<td className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set3" entryType="weight" />
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set3" entryType="reps" />
					</td>
				</tr>
			</tbody>
		</table>
	)
}