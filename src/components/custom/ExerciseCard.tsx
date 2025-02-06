import { Exercise, ExerciseData } from "@/app/push/page"
import { useEffect, useState } from "react";
import ExerciseCardInput from "./ExerciseCardInput";

type ExerciseCardProps = {
	exercise: Exercise,
	updateExerciseList: Function
}

export default function ExerciseCard({exercise, updateExerciseList}: ExerciseCardProps) {
	
	const {id, name, type, data} = exercise;

	const [displayValues, setDisplayValues] = useState(data);

	// Handlers for input element

	const handleInputOnFocus = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		// if (e.target.value === "0") {
		// 	const setString = e.target.name;

		// 	setDisplayValues((prevState) => ({
		// 		...prevState,
		// 		[setString as keyof Exercise]:
		// 			entryType === "weight" ? { weight: 0, reps: set.reps } : { weight: set.weight, reps: 0 }
		// 	}));
		// }
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		// const inputValue = e.target.value;
		// const setString = e.target.name;

		// setDisplayValues((prevState) => ({
		// 	...prevState,
		// 	[setString as keyof Exercise]:
		// 		entryType === "weight" ? { weight: inputValue, reps: set.reps } : { weight: set.weight, reps: inputValue }
		// }));
	}

	const handleInputOnBlur = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		// const inputValue = e.target.value === "" ? 0 : Number(e.target.value);
		// const setString = e.target.name;
		
		// setDisplayValues((prevState) => ({
		// 	...prevState,
		// 	[setString as keyof Exercise]:
		// 		entryType === "weight" ? { weight: inputValue, reps: set.reps } : { weight: set.weight, reps: inputValue }
		// }));
	}

	// useEffect(() => {
	// 	updateExerciseList(id, displayValues);
	// }, [displayValues]);

	const updateExerciseListData = (data: ExerciseData) => {
		updateExerciseList(id, data);
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
						{/* Set 1 Weight input */}
						<ExerciseCardInput id={id} data={data} updateExerciseListData={updateExerciseListData} setString="set1" entryType="weight" />
						{/* Set 1 Reps input */}
						<ExerciseCardInput id={id} data={data} updateExerciseListData={updateExerciseListData} setString="set1" entryType="reps" />
						{/* <div className="flex flex-col">
							<input
								className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
								placeholder="0"
								value={displayValues.set1.reps === 0 ? "" : displayValues.set1.reps}
								onFocus={(e) => handleInputOnFocus(e, data.set1, "reps")}
								onChange={(e) => handleInputChange(e, data.set1, "reps")}
								onBlur={(e) => handleInputOnBlur(e, data.set1, "reps")}
								name="set1"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center uppercase">reps</label>
						</div> */}
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 mx-4 border-b border-slate-800">
					<td className="px-2 text-lg self-center uppercase">Set 2</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						{/* Set 2 Weight input */}
						<div className="flex flex-col">
							<input
								className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
								placeholder="0"
								value={displayValues.set2.weight === 0 ? "" : displayValues.set2.weight}
								onFocus={(e) => handleInputOnFocus(e, data.set2, "weight")}
								onChange={(e) => handleInputChange(e, data.set2, "weight")}
								onBlur={(e) => handleInputOnBlur(e, data.set2, "weight")}
								name="set2"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center uppercase">lbs</label>
						</div>
						{/* Set 2 Reps input */}
						<div className="flex flex-col">
							<input
								className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
								placeholder="0"
								value={displayValues.set2.reps === 0 ? "" : displayValues.set2.reps}
								onFocus={(e) => handleInputOnFocus(e, data.set2, "reps")}
								onChange={(e) => handleInputChange(e, data.set2, "reps")}
								onBlur={(e) => handleInputOnBlur(e, data.set2, "reps")}
								name="set2"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center uppercase">reps</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 px-4">
					<td className="px-2 text-lg self-center uppercase">Set 3</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						{/* Set 3 Weight input */}
						<div className="flex flex-col">
							<input
								className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
								placeholder="0"
								value={displayValues.set3.weight === 0 ? "" : displayValues.set3.weight}
								onFocus={(e) => handleInputOnFocus(e, data.set3, "weight")}
								onChange={(e) => handleInputChange(e, data.set3, "weight")}
								onBlur={(e) => handleInputOnBlur(e, data.set3, "weight")}
								name="set3"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center uppercase">lbs</label>
						</div>
						{/* Set 3 Reps input */}
						<div className="flex flex-col">
							<input
								className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
								placeholder="0"
								value={displayValues.set3.reps === 0 ? "" : displayValues.set3.reps}
								onFocus={(e) => handleInputOnFocus(e, data.set3, "reps")}
								onChange={(e) => handleInputChange(e, data.set3, "reps")}
								onBlur={(e) => handleInputOnBlur(e, data.set3, "reps")}
								name="set3"
								type="number"
								pattern="[0-9]*"
								inputMode="numeric"
							/>
							<label className="self-center uppercase">reps</label>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	)
}