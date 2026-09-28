import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {ExerciseData} from "@/utils/ExerciseTypes";
import {useState} from "react";

type ExerciseCardInputProps = {
	displayValues: ExerciseData | undefined,
	setDisplayValues: React.Dispatch<React.SetStateAction<ExerciseData | undefined>>,
	handleUpdateExerciseData: (updatedValues: ExerciseData | undefined) => void,
	setString: "set1" | "set2" | "set3",
	entryType: "weight" | "reps"
}

export default function ExerciseCardInput({displayValues, setDisplayValues, handleUpdateExerciseData, setString, entryType}: ExerciseCardInputProps) {

	const [finalValue, setFinalValue] = useState(displayValues);

	// when user clicks in on input field
	const handleInputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		const input = e.currentTarget;
		requestAnimationFrame(() => input.setSelectionRange(0, input.value.length));
	};

	// every keystroke input
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = e.target.value === "" ? "" : Number(e.target.value);
		const setString = e.target.name;

		setDisplayValues((prevState: ExerciseData | undefined) => {
			if(!prevState) {
				return prevState;
			}
			return {
				...prevState,
				[setString as keyof ExerciseData]:
				entryType === "weight" ? {weight: inputValue, reps: set.reps} : {weight: set.weight, reps: inputValue}
			}
		});
	}

	// when user clicks away from input field
	const handleInputOnBlur = (e: React.FocusEvent<HTMLInputElement>, set: {weight: number, reps: number}, entryType: "weight" | "reps") => {
		const inputValue = e.target.value === "" ? 0 : Number(e.target.value);
		const setString = e.target.name;
		
		setDisplayValues((prevState: ExerciseData | undefined) => {
			if (!prevState) {
				return prevState;
			}
			return {
				...prevState,
				[setString as keyof ExerciseData]:
				entryType === "weight" ? { weight: inputValue, reps: set.reps } : { weight: set.weight, reps: inputValue }
			}
		});
		setFinalValue(displayValues);
	}

	useEffectSkipFirstRender(() => {
		handleUpdateExerciseData(displayValues);
	}, [finalValue]);

	return (
		<div className="col-span-2 flex justify-between rounded-2xl border border-white/10 bg-black/25">
			{displayValues ? 
				<div>
					<input
						className="max-w-14 rounded bg-transparent px-3 py-3 text-lg text-white outline-none"
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
					<label className="self-center px-3 text-tiny uppercase text-white/40">{entryType === "weight" ? "lbs" : "reps"}</label>
				</div>
				: null
			}
		</div >		
	)
}
