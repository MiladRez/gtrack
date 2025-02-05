import { Exercise } from "@/app/push/page"
import {useState} from "react";

type ExerciseCardProps = {
	exercise: Exercise,
	updateExerciseList: Function
}

export default function ExerciseCard({exercise, updateExerciseList}: ExerciseCardProps) {
	
	const {id, name, type, set1, set2, set3} = exercise;

	const [displayValues, setDisplayValues] = useState({set1, set2, set3});

	console.log(displayValues)

	const handleWeightChange = (set: {weight: number, reps: number}, e: React.ChangeEvent<HTMLInputElement>) => {
		const weight = parseInt(e.target.value);
		const setString = e.target.name;
		updateExerciseList(id, setString, weight, set.reps)
		setDisplayValues((prevState) => ({
			...prevState,
			[setString as keyof Exercise]: {weight: weight, reps: set.reps}
		}));
	}

	const handleRepsChange = (set: {weight: number, reps: number} | undefined, reps: number) => {
		updateExerciseList(id, set, set?.weight, reps)
	}

	const handleSavingData = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}) => {
		const setString = e.target.name;

		if (Number.isNaN(e.target.value)) {
			console.log("I run")
			setDisplayValues((prevState) => ({
				...prevState,
				[setString as keyof Exercise]: {weight: 0, reps: set.reps}
			}));
			updateExerciseList(id, setString, 0, set.reps)
		} else {
			updateExerciseList(id, setString, set.weight, set.reps)
		}
	}

	return (
		<table className="grid max-w-xl">
			<thead className="col-span-2 flex justify-center border border-b-0 rounded-t-xl bg-slate-900">
				<tr>
					<th className="py-4 px-2 text-white">{ name }</th>
				</tr>
			</thead>
			<tbody className="grid col-span-2 bg-slate-900 border rounded-b-xl">
				<tr className="grid grid-cols-3 py-6 px-4 bg-slate-800">
					<td className="px-2 text-lg self-center">Set 1</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2 px-2">
						<div className="flex gap-2">
							<input
								className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1"
								placeholder="0"
								value={displayValues.set1.weight}
								onChange={(e) => handleWeightChange(set1, e)}
								onBlur={(e) => handleSavingData(e, displayValues.set1)}
								name="set1"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center">lbs</label>
						</div>
						<label className="self-center">x</label>
						<div className="flex gap-2">
							<input
								className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1"
								placeholder="0"
								value={set1?.reps}
								onChange={(e) => handleRepsChange(set1, parseInt(e.target.value))}
								name="set1"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center">reps</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 px-4 bg-slate-700">
					<td className="px-2 text-lg self-center">Set 2</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						<div className="flex gap-2">
							<input
								className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1"
								placeholder="0"
								value={set2?.weight}
								onChange={(e) => handleWeightChange(set2, parseInt(e.target.value))}
								name="weight"							
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"								
							/>
							<label className="self-center">lbs</label>
						</div>
						<label className="self-center">x</label>
						<div className="flex gap-2">
							<input
								className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1"
								placeholder="0"
								value={set2?.reps}
								onChange={(e) => handleRepsChange(set1, parseInt(e.target.value))}
								name="reps"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"								
							/>		
							<label className="self-center">reps</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 px-4 bg-slate-800 rounded-b-xl">
					<td className="px-2 text-lg self-center">Set 3</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						<div className="flex gap-2">
							<input
								className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1"
								placeholder="0"
								value={set3?.weight}
								onChange={(e) => handleWeightChange(set3, parseInt(e.target.value))}
								name="weight"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"							
							/>
							<label className="self-center">lbs</label>
						</div>
						<label className="self-center">x</label>
						<div className="flex gap-2">
							<input
								className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1"
								placeholder="0"
								value={set3?.reps}
								onChange={(e) => handleRepsChange(set1, parseInt(e.target.value))}
								name="reps"								
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"								
							/>	
							<label className="self-center">reps</label>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	)
}