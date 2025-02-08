'use client';

import { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import ExerciseCard from "@/components/custom/ExerciseCard";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";

export type ExerciseData = {
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

export type Exercise = {
	id: string,
	name: string,
	type: "Dumbbell" | "Bar" | "Machine",
	data: ExerciseData
}

type ExerciseItem = {
	id: string,
	name: string,
	type: "Dumbbell" | "Bar" | "Machine"
}

export default function Push() {

	const exercises: ExerciseItem[] = [
		{
			id: "1",
			name: "Incline Bench Press",
			type: "Bar"
		},
		{
			id: "2",
			name: "Incline Bench Press",
			type: "Dumbbell"
		},
		{
			id: "3",
			name: "Flat Bench Press",
			type: "Bar"
		},
		{
			id: "4",
			name: "Flat Bench Press",
			type: "Dumbbell"
		},
		{
			id: "5",
			name: "Machine Chest Press",
			type: "Machine"
		},
		{
			id: "6",
			name: "Chest Fly",
			type: "Machine"
		},
		{
			id: "7",
			name: "Machine Shoulder Press",
			type: "Machine"
		},
		{
			id: "8",
			name: "Shoulder Lateral Raises",
			type: "Dumbbell"
		},
		{
			id: "9",
			name: "Tricep Pull Down",
			type: "Machine"
		},
		{
			id: "10",
			name: "Overhead Tricep Extension",
			type: "Machine"
		},
		{
			id: "11",
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
					data: {
						set1: {weight: 0, reps: 0},
						set2: {weight: 0, reps: 0},
						set3: {weight: 0, reps: 0}
					}
				};
				newMap.set(exercise.id, exercise)
				return newMap;
			});
		}
	}

	const updateExerciseList = (exerciseID: string, data: ExerciseData) => {
		const newMap = new Map(exerciseList);
		const exercise = newMap.get(exerciseID);
		exercise.data = data;
		newMap.set(exerciseID, exercise);
		setExerciseList(newMap);
		handleSaveSession(newMap); // save to DB
	}

	const removeExercise = (exerciseID: string) => {
		const newMap = new Map(exerciseList);
		newMap.delete(exerciseID.toString());
		setExerciseList(newMap);
		handleSaveSession(newMap); // save to DB
	}

	const handleSaveSession = async (exerciseList: Map<Exercise["id"], Exercise >) => {
		console.log(exerciseList)
		await fetch("/api/addSession", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				type: "Push",
				exerciseList: Object.fromEntries(exerciseList),
			})
		});
	}

	useEffect(() => {
		const getTodaysSession = async () => {
			try {
				const response = await fetch("/api/getTodaysSession");
				if (!response.ok) throw new Error("Failed to fetch data.");

				const data = await response.json();
				if (data) {
					const dataMap = new Map(Object.entries(data.exerciseList)); // API response returns object, convert object to Map
					setExerciseList(new Map(dataMap));
				}
			} catch (error) {
				console.error("Error fetching today's session: ", error);
			}
		};
		getTodaysSession();
	}, []);

	useEffectSkipFirstRender(() => {
		console.log(exerciseList)
	}, [exerciseList]);

	const ExerciseIcon = ({ type }: { type: "Dumbbell" | "Bar" | "Machine" }) => {
		switch (type) {
			case "Dumbbell":
				return (
					<svg className="!w-5 !h-5 mr-[2px]">
						<use href="/icons.svg#dumbbell" />
					</svg>
				)
			case "Bar":
				return (
					<svg className="!w-6 !h-6">
						<use href="/icons.svg#barbell" />
					</svg>
				)
			case "Machine":
				return (
					<svg stroke="black" className="!w-6 !h-6">
						<use href="/icons.svg#machine" />
					</svg>
				)
			default:
				return (
					<svg className="!w-6 !h-6">
						<use href="/icons.svg#spinner" />
					</svg>
				)
		}
	}

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
							className="flex justify-between gap-12"
							key={exercise.id}
							onClick={() => handleAddExercise(exercise)}
						>
							{exercise.name}
							<ExerciseIcon type={exercise.type} />
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{Array.from(exerciseList).map((exercise) => (
				<ExerciseCard key={exercise[0]} exercise={exercise[1]} updateExerciseList={updateExerciseList} removeExercise={removeExercise} />
			))}
		</div>
	)
}