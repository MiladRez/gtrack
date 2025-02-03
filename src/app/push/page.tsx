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

export default function Push() {

	type Exercise = {
		id: number,
		name: string,
		type: "Dumbbell" | "Bar" | "Machine"
	}

	const exercises: Exercise[] = [
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

	const handleAddExercise = (exercise: Exercise) => {
		if (exerciseList.get(exercise.id)) {
			console.log("Exercise already added.")
		} else {
			setExerciseList((prevState) => {
				const newMap = new Map(prevState);
				newMap.set(exercise.id, { name: exercise.name, type: exercise.type, set1: {reps: 0, weight: 0}, set2: {reps: 0, weight: 0}, set3: {reps: 0, weight: 0} })
				return newMap;
			})
		}
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

	});

	return (
		<div className="flex flex-col items-center gap-12 my-60 mx-4">
			<DropdownMenu>
				<DropdownMenuTrigger className="border rounded-lg px-4 py-4">
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
			<table className="w-full border">
				<thead className="flex bg-blue-400">
					<tr className="w-1/2 px-2">
						<th>Exercise</th>
					</tr>
					<tr className="w-1/2 flex justify-around">
						<th>Set 1</th>
						<th>Set 2</th>
						<th>Set 3</th>
					</tr>
				</thead>
				{Array.from(exerciseList).map((exercise) => (
					<tbody className="flex py-2">
						<tr key={exercise[0]} className="w-1/2">
							<td className="px-2">
								{exercise[1].name}
							</td>
						</tr>
						<tr className="w-1/2 flex justify-around items-center">
							<td className="flex gap-1">
								<div className="flex">
									<input name="weight" className="w-full text-center" type="number" placeholder="0" />
									<label>x</label>
								</div>
								<div className="flex">
									<input name="reps" className="w-full text-center" type="number" placeholder="0" />
									<label>lbs</label>
								</div>
							</td>
							<td className="flex">
								<input name="weight" className="w-full text-center" type="number" placeholder="0" />
								<input name="reps" className="w-full text-center" type="number" placeholder="0" />
							</td>
							<td className="flex">
								<input name="weight" className="w-full text-center" type="number" placeholder="0" />
								<input name="reps" className="w-full text-center" type="number" placeholder="0" />
							</td>					
						</tr>
					</tbody>
				))}
			</table>
		</div>
	)
}

