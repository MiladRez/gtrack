import { Exercise, ExerciseData } from "@/app/push/page"
import {useCallback, useEffect, useState} from "react";
import ExerciseCardInput from "./ExerciseCardInput";
import debounce from "lodash.debounce";
import {Separator} from "../ui/separator";

type ExerciseCardProps = {
	exercise: Exercise,
	updateExerciseList: Function,
	removeExercise: Function
}

export default function ExerciseCard({exercise, updateExerciseList, removeExercise}: ExerciseCardProps) {
	
	const {id, name, type, data} = exercise;

	const [displayValues, setDisplayValues] = useState(data);

	// delays function call to post to db by 500ms, using useCallback to prevent page rerendering
	const debouncedUpdate = useCallback(
		debounce((updatedValues: ExerciseData) => {
			updateExerciseList(id, updatedValues);
		}, 500),
		[]
	);

	const handleRemoveExercise = () => {
		removeExercise(id);
	}

	const ExerciseIcon = ({ type }: { type: "Dumbbell" | "Bar" | "Machine" }) => {
		switch (type) {
			case "Dumbbell":
				return (
					<svg fill="white" className="w-5 h-5">
						<use href="/icons.svg#dumbbell" />
					</svg>
				)
			case "Bar":
				return (
					<svg fill="white" className="w-6 h-6">
						<use href="/icons.svg#barbell" />
					</svg>
				)
			case "Machine":
				return (
					<svg stroke="white" fill="white" className="w-6 h-6">
						<use href="/icons.svg#machine" />
					</svg>
				)
			default:
				return (
					<svg fill="white" className="w-6 h-6">
						<use href="/icons.svg#spinner" />
					</svg>
				)
		}
	}

	return (
		<div className="grid w-full max-w-xl border border-slate-600 rounded-3xl bg-slate-950">
			<div className="relative col-span-2 flex justify-center py-8">
				<div className="px-2 text-white flex">
					<div className="flex flex-col items-center gap-3">
						<ExerciseIcon type={type} />
						{name}
					</div>
					<svg stroke="white" className="absolute right-0 mx-6 w-5 h-5" onClick={handleRemoveExercise}>
						<use href="/icons.svg#cross" />
					</svg>
				</div>
			</div>
			<div className="grid col-span-2 mx-6 pb-6">
				<div className="grid grid-cols-3">
					<h2 className="px-2 text-lg self-center uppercase">Set 1</h2>
					<div className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set1" entryType="weight" />
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set1" entryType="reps" />
					</div>
				</div>
				<Separator className="bg-slate-600 my-6" />
				<div className="grid grid-cols-3">
					<h2 className="px-2 text-lg self-center uppercase">Set 2</h2>
					<div className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set2" entryType="weight" />
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set2" entryType="reps" />
					</div>
				</div>
				<Separator className="bg-slate-600 my-6" />
				<div className="grid grid-cols-3">
					<h2 className="px-2 text-lg self-center uppercase">Set 3</h2>
					<div className="flex gap-4 md:gap-6 justify-end col-span-2 px-2">
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set3" entryType="weight" />
						<ExerciseCardInput id={id} displayValues={displayValues} setDisplayValues={setDisplayValues} debouncedUpdate={debouncedUpdate} setString="set3" entryType="reps" />
					</div>
				</div>
			</div>
		</div>
	)
}