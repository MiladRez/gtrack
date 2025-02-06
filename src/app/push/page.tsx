'use client';

import {useEffect, useState} from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import ExerciseCard from "@/components/custom/ExerciseCard";

export type Exercise = {
	id: number,
	name: string,
	type: "Dumbbell" | "Bar" | "Machine",
	set1: {
		weight: number,
		reps: number
	},
	set2: {
		weight: number,
		reps: number
	},
	set3: {
		weight: number,
		reps: number
	}
}

type ExerciseItem = {
	id: number,
	name: string,
	type: "Dumbbell" | "Bar" | "Machine"
}

export default function Push() {

	const exercises: ExerciseItem[] = [
		{
			id: 1,
			name: "Incline Bench Press",
			type: "Bar"
		},
		{
			id: 2,
			name: "Incline Bench Press",
			type: "Dumbbell"
		},
		{
			id: 3,
			name: "Flat Bench Press",
			type: "Bar"
		},
		{
			id: 4,
			name: "Flat Bench Press",
			type: "Dumbbell"
		},
		{
			id: 5,
			name: "Machine Chest Press",
			type: "Machine"
		},
		{
			id: 6,
			name: "Chest Fly",
			type: "Machine"
		},
		{
			id: 7,
			name: "Machine Shoulder Press",
			type: "Machine"
		},
		{
			id: 8,
			name: "Shoulder Lateral Raises",
			type: "Dumbbell"
		},
		{
			id: 9,
			name: "Tricep Pull Down",
			type: "Machine"
		},
		{
			id: 10,
			name: "Overhead Tricep Extension",
			type: "Machine"
		},
		{
			id: 11,
			name: "Dips",
			type: "Machine"
		},
	]

	const [exerciseList, setExerciseList] = useState(new Map());

	const handleAddExercise = (exerciseItem: ExerciseItem) => {
		// check if exercise already in exerciseList list
		if (exerciseList.get(exerciseItem.id)) {
			console.log("Exercise already added.")
		} else {
			// adds selected exercise from dropdown list to exerciseList list
			setExerciseList((prevState) => {
				const newMap = new Map(prevState);
				const exercise: Exercise = {
					...exerciseItem,
					set1: {weight: 0, reps: 0},
					set2: {weight: 0, reps: 0},
					set3: {weight: 0, reps: 0},

				};
				newMap.set(exercise.id, exercise)
				return newMap;
			})
		}
	}

	const updateExerciseList = (exerciseID: number, set: string, weight: number, reps: number) => {
		setExerciseList((prevState) => {
			const newMap = new Map(prevState);
			const exercise = newMap.get(exerciseID);
			exercise[set] = {weight: weight, reps: reps};
			newMap.set(exerciseID, exercise);
			return newMap;
		})
	}

	const handleSaveSession = async () => {
		await fetch("/api/addSession", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				 type: "Push",
				 exerciseList: exerciseList
			})
		})
	}

	useEffect(() => {
		console.log(exerciseList)
	}, [exerciseList]);

	return (
		<div className="flex flex-col items-center gap-12 my-20 md:my-60 mx-4">
			<DropdownMenu>
				<DropdownMenuTrigger className="border rounded-lg px-4 py-4 bg-slate-950">
					Add Exercise
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{exercises.filter(excer => !exerciseList.get(excer.id))
					.map((exercise) => (
						<DropdownMenuItem 
							key={exercise.id}
							onClick={() => handleAddExercise(exercise)}
						>
							{exercise.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{Array.from(exerciseList).map((exercise) => (
				<ExerciseCard key={exercise[0]} exercise={exercise[1]} updateExerciseList={updateExerciseList} />
			))}
		</div>
	)
}