import {ExerciseData} from "@/app/push/page";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {useEffect, useRef, useState} from "react";

type ExerciseCardInputProps = {
	displayValues: ExerciseData,
	setDisplayValues: Function,
	debouncedUpdate: Function,
	setString: "set1" | "set2" | "set3",
	entryType: "weight" | "reps"
}

export default function ExerciseCardInput({displayValues, setDisplayValues, debouncedUpdate, setString, entryType}: ExerciseCardInputProps) {

	const [finalValue, setFinalValue] = useState(displayValues);

	const handleInputOnFocus = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		if (e.target.value === "0") {
			const setString = e.target.name;

			setDisplayValues((prevState: ExerciseData) => ({
				...prevState,
				[setString as keyof ExerciseData]:
					entryType === "weight" ? { weight: "", reps: set.reps } : { weight: set.weight, reps: "" }
			}));
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = e.target.value === "" ? "" : Number(e.target.value);
		const setString = e.target.name;

		setDisplayValues((prevState: ExerciseData) => ({
			...prevState,
			[setString as keyof ExerciseData]:
				entryType === "weight" ? {weight: inputValue, reps: set.reps} : {weight: set.weight, reps: inputValue}
		}));
		setFinalValue(displayValues);
	}

	const handleInputOnBlur = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = e.target.value === "" ? 0 : Number(e.target.value);
		const setString = e.target.name;
		
		setDisplayValues((prevState: ExerciseData) => ({
			...prevState,
			[setString as keyof ExerciseData]:
				entryType === "weight" ? { weight: inputValue, reps: set.reps } : { weight: set.weight, reps: inputValue }
		}));
	}

	useEffectSkipFirstRender(() => {
		debouncedUpdate(displayValues);
	}, [finalValue]);

	return (
		<div className="flex flex-col">
			<input
				className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
				placeholder="0"
				value={displayValues[setString][entryType]}
				onFocus={(e) => handleInputOnFocus(e, displayValues[setString], entryType)}
				onChange={(e) => handleInputChange(e, displayValues[setString], entryType)}
				onBlur={(e) => handleInputOnBlur(e, displayValues[setString], entryType)}
				name={setString}
				type="number"
				pattern="[0-9]*"
				inputMode="numeric"
			/>
			<label className="self-center uppercase">{entryType === "weight" ? "lbs" : "reps"}</label>
		</div>
	)
}