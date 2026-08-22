import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {ExerciseData} from "@/utils/ExerciseTypes";
import {useState} from "react";

type ExerciseCardInputProps = {
	displayValues: ExerciseData,
	setDisplayValues: React.Dispatch<React.SetStateAction<ExerciseData>>,
	handleUpdateExerciseData: (updatedValues: ExerciseData) => void,
	setString: "set1" | "set2" | "set3",
	entryType: "weight" | "reps"
}

export default function ExerciseCardInput({displayValues, setDisplayValues, handleUpdateExerciseData, setString, entryType}: ExerciseCardInputProps) {

	const [finalValue, setFinalValue] = useState(displayValues);

	const handleInputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		const input = e.currentTarget;
		requestAnimationFrame(() => input.setSelectionRange(0, input.value.length));
	};

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
		handleUpdateExerciseData(displayValues);
	}, [finalValue]);

	return (
		<div className="flex flex-col gap-1">
			<input
				className="max-w-14 text-center text-lg text-white border border-slate-800 rounded bg-slate-950 py-1"
				placeholder="0"
				value={displayValues[setString][entryType]}
				onFocus={handleInputOnFocus}
				onChange={(e) => handleInputChange(e, displayValues[setString], entryType)}
				onBlur={(e) => handleInputOnBlur(e, displayValues[setString], entryType)}
				name={setString}
				type="text"
				pattern="[0-9]*"
				inputMode="numeric"
			/>
			<label className="self-center uppercase text-xs">{entryType === "weight" ? "lbs" : "reps"}</label>
		</div>
	)
}