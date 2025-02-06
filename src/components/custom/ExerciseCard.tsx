import { Exercise } from "@/app/push/page"
import { useState } from "react";

type ExerciseCardProps = {
	exercise: Exercise,
	updateExerciseList: Function
}

export default function ExerciseCard({exercise, updateExerciseList}: ExerciseCardProps) {
	
	const {id, name, type, set1, set2, set3} = exercise;

	const [displayValues, setDisplayValues] = useState({set1, set2, set3});

	// Handlers for input element

	const handleInputOnFocus = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const setString = e.target.name;
		setDisplayValues((prevState) => ({
			...prevState,
			[setString as keyof Exercise]: {weight: entryType === "weight" ? "" : set.weight, reps: entryType === "weight" ? set.reps : ""}
		}));
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = e.target.value;
		const setString = e.target.name;

		console.log(inputValue)

		setDisplayValues((prevState) => ({
			...prevState,
			[setString as keyof Exercise]: {weight: inputValue, reps: set.reps}
		}));
	}

	const handleInputOnBlur = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = e.target.value === "" ? 0 : Number(e.target.value);
		const setString = e.target.name;

		if (entryType === "weight") {
			updateExerciseList(id, setString, inputValue, set.reps);
		} else {
			updateExerciseList(id, setString, set.weight, inputValue);
		}
		
		setDisplayValues((prevState) => ({
			...prevState,
			[setString as keyof Exercise]: {weight: entryType === "weight" ? inputValue : set.weight, reps: entryType === "weight" ? set.reps : inputValue}
		}));
	}

	function ExerciseCardInput({entryType, set, setString}: {entryType: "weight" | "reps", set: {weight: number, reps: number}, setString: string}): React.JSX.Element {
		console.log(set.weight)

		return (
			<div className="flex flex-col">
				<input
					className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
					placeholder="0"
					value={displayValues.set1.weight}
					onFocus={(e) => handleInputOnFocus(e, set1, "weight")}
					onChange={(e) => handleInputChange(e, set1, "weight")}
					onBlur={(e) => handleInputOnBlur(e, set1, "weight")}
					name="set1"
					type="number"
					pattern="[0-9]*"
					inputMode="numeric"
				/>
				<label className="self-center uppercase">{entryType === "weight" ? "lbs" : "reps"}</label>
			</div>
		)
	}

	return (
		<table className="grid max-w-xl">
			<thead className="col-span-2 flex justify-center border border-b-0 border-slate-600 rounded-t-3xl bg-slate-950 py-2">
				<tr>
					<th className="py-4 px-2 text-white">{ name }</th>
				</tr>
			</thead>
			<tbody className="grid col-span-2 bg-slate-950 border border-t-0 border-slate-600 rounded-b-3xl">
				<tr className="grid grid-cols-3 py-2 mx-4 border-b border-slate-800">
					<td className="px-2 text-lg self-center uppercase">Set 1</td>
					<td className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput entryType={"weight"} set={set1} setString="set1" />
						{/* <ExerciseCardInput entryType={"reps"} set={set1} setString="set1" /> */}
						<div className="flex flex-col">
							<input
								className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
								placeholder="0"
								value={displayValues.set1.weight}
								onFocus={(e) => handleInputOnFocus(e, set1, "weight")}
								onChange={(e) => handleInputChange(e, set1, "weight")}
								onBlur={(e) => handleInputOnBlur(e, set1, "weight")}
								name="set1"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center uppercase">lbs</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 mx-4 border-b border-slate-800">
					<td className="px-2 text-lg self-center uppercase">Set 2</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						{/* <ExerciseCardInput entryType={"weight"} set={set2} setString="set2" />
						<ExerciseCardInput entryType={"reps"} set={set2} setString="set2" /> */}
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 px-4">
					<td className="px-2 text-lg self-center uppercase">Set 3</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						{/* <ExerciseCardInput entryType={"weight"} set={set3} setString="set3" />
						<ExerciseCardInput entryType={"reps"} set={set3} setString="set3" /> */}
					</td>
				</tr>
			</tbody>
		</table>
	)
}