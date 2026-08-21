"use client";

import {useEffect, useState} from "react";
import ExerciseCard from "@/components/custom/ExerciseCard";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {Exercise, ExerciseData, ExerciseItem} from "@/utils/ExerciseTypes";
import axios from "axios";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import ExerciseDialog from "@/components/custom/ExerciseDialog";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import ExerciseIconDropdownMenu from "@/components/custom/ExerciseIconDropdownMenu";

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
		}
	];

	const [exerciseList, setExerciseList] = useState(new Map());
	const [displayExerciseList, setDisplayExerciseList] = useState(new Map());
	// const [dialogWindow, setDialogWindow] = useState(false);
	const [exercise, setExercise] = useState<Exercise | null>(null);

	const handleAddExercise = (exerciseItem: ExerciseItem) => {
		// check if exercise already in exerciseList list
		if (exerciseList.get(exerciseItem.id)) {
			console.log("Exercise already added.");
		} else {
			// adds selected exercise from dropdown list to exerciseList list
			setExerciseList(prevState => {
				const newMap = new Map(prevState);
				const exercise: Exercise = {
					...exerciseItem,
					data: {
						set1: {weight: 0, reps: 0},
						set2: {weight: 0, reps: 0},
						set3: {weight: 0, reps: 0}
					}
				};
				newMap.set(exercise.id, exercise);
				setExercise(exercise);
				return newMap;
			});
		}
	};

	const updateExerciseList = (exerciseID: string, data: ExerciseData) => {
		const newMap = new Map(exerciseList);
		const exercise = newMap.get(exerciseID);
		exercise.data = data;
		newMap.set(exerciseID, exercise);
		setExerciseList(newMap);
		setDisplayExerciseList(newMap);
		saveToDB(newMap); // save to DB
	};

	const removeExercise = (exerciseID: string) => {
		const newMap = new Map(exerciseList);
		newMap.delete(exerciseID.toString());
		setExerciseList(newMap);
		// saveToDB(newMap); // save to DB
	};

	const saveToDB = async (exerciseList: Map<Exercise["id"], Exercise>) => {
		console.log(exerciseList);
		await axios.post(
			"/api/addSession",
			{
				type: "Push",
				exerciseList: Object.fromEntries(exerciseList)
			},
			{
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
	};

	useEffect(() => {
		const getTodaysSession = async () => {
			try {
				const response = await axios.get("/api/getTodaysSession", {
					params: {type: "Push"}
				});

				const data = await response.data;
				if (data) {
					const dataMap = new Map(Object.entries(data.exerciseList)); // API response returns object, convert object to Map
					setExerciseList(new Map(dataMap));
					setDisplayExerciseList(new Map(dataMap));
					console.log("dataMap: ", dataMap);
				}
			} catch (error) {
				console.error("Error fetching today's session: ", error);
			}
		};
		getTodaysSession();
	}, []);

	// useEffectSkipFirstRender(() => {
	// 	console.log(exerciseList);
	// }, [exerciseList]);

	return (
		<div className="w-screen flex justify-center">
			<div className="max-w-(--breakpoint-md) w-full flex flex-col items-center gap-12 mx-4">
				<Link href="/" className="self-start">
					<Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 mt-2 sm:mt-20">
						<ChevronLeft />
					</Button>
				</Link>
				<Link href="/pastSessions" className="absolute right-0 top-5 sm:hidden">
					<Button variant="ghost" className="underline">
						Past Sessions
					</Button>
				</Link>
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Push</h2>
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger className="px-6 py-4 bg-slate-900 border border-slate-700 rounded-lg sm:mt-20">Add Exercise</DropdownMenuTrigger>
						<DropdownMenuContent>
							{exercises
								.filter(excer => !exerciseList.get(excer.id))
								.map(exercise => (
									<DialogTrigger key={exercise.id} className="w-full flex">
										<DropdownMenuItem
											className="w-full flex justify-between"
											// onClick={() => handleAddExercise(exercise)}
											onClick={() => handleAddExercise(exercise)}
										>
											{exercise.name}
											<ExerciseIconDropdownMenu type={exercise.type} />
										</DropdownMenuItem>
									</DialogTrigger>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
					{
						exercise ?
							<ExerciseDialog exercise={exercise} exerciseList={exerciseList} updateExerciseList={updateExerciseList} removeExercise={removeExercise} saveToDB={saveToDB} />
						: null
					}
				</Dialog>
				{Array.from(displayExerciseList).map(exercise => (
					<ExerciseCard key={exercise[0]} exercise={exercise[1]} updateExerciseList={updateExerciseList} />
				))}
			</div>
		</div>
	);
}
