import {ExerciseData} from "@/app/push/page";
import {useEffect, useState} from "react";

type ExerciseCardInputProps = {
	id: number,
	data: ExerciseData,
	updateExerciseListData: Function,
	setString: "set1" | "set2" | "set3",
	entryType: "weight" | "reps"
}

export default function ExerciseCardInput({id, data, updateExerciseListData, setString, entryType}: ExerciseCardInputProps) {

	const [displayValues, setDisplayValues] = useState(data);

	const handleInputOnFocus = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		if (e.target.value === "0") {
			const setString = e.target.name;

			setDisplayValues((prevState) => ({
				...prevState,
				[setString as keyof ExerciseData]:
					entryType === "weight" ? { weight: "", reps: set.reps } : { weight: set.weight, reps: "" }
			}));
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = Number(e.target.value);
		const setString = e.target.name;

		setDisplayValues((prevState) => ({
			...prevState,
			[setString as keyof ExerciseData]:
				entryType === "weight" ? { weight: inputValue, reps: set.reps } : { weight: set.weight, reps: inputValue }
		}));
	}

	const handleInputOnBlur = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = e.target.value === "" ? 0 : Number(e.target.value);
		const setString = e.target.name;
		
		setDisplayValues((prevState) => ({
			...prevState,
			[setString as keyof ExerciseData]:
				entryType === "weight" ? { weight: inputValue, reps: set.reps } : { weight: set.weight, reps: inputValue }
		}));
	}

	useEffect(() => {
		updateExerciseListData(displayValues);
	}, [displayValues]);

	return (
		<div className="flex flex-col">
			<input
				className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
				placeholder="0"
				value={displayValues[setString][entryType]}
				onFocus={(e) => handleInputOnFocus(e, data[setString], entryType)}
				onChange={(e) => handleInputChange(e, data[setString], entryType)}
				onBlur={(e) => handleInputOnBlur(e, data[setString], entryType)}
				name={setString}
				type="number"
				pattern="[0-9]*"
				inputMode="numeric"
			/>
			<label className="self-center uppercase">{entryType === "weight" ? "lbs" : "reps"}</label>
		</div>
	)
}