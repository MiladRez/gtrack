"use client";

import {useEffect, useState, MouseEvent} from "react";
import ExerciseCard from "@/components/custom/ExerciseCard";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {ExerciseData, ExerciseItem} from "@/utils/ExerciseTypes";
import axios from "axios";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import ExerciseDialog from "@/components/custom/ExerciseDialog";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import ExerciseIconDropdownMenu from "@/components/custom/ExerciseIcon";
import {legsExercises, pullExercises, pushExercises} from "@/utils/Exercises";

export default function TodaysSessionPage({params}: {params: {sessionType: string}}) {
	const [sessionType, setSessionType] = useState("");
	const [exerciseList, setExerciseList] = useState(new Map());
	const [displayExerciseList, setDisplayExerciseList] = useState(new Map());
	const [exercise, setExercise] = useState<ExerciseItem | null>(null);

	const [outerDialogOpen, setOuterDialogOpen] = useState(false);
	const [innerDialogOpen, setInnerDialogOpen] = useState(false);

	useEffect(() => {
		const getSessionType = async () => {
			try {
				const {sessionType} = await params;
				setSessionType(sessionType.charAt(0).toUpperCase() + sessionType.slice(1));
			} catch (e) {
				console.log("Error fetching sessionType: ", e);
			}
		};
		getSessionType();
	}, []);

	useEffect(() => {
		const getTodaysSession = async () => {
			try {
				const response = await axios.get("/api/getTodaysSession", {
					params: {type: sessionType}
				});

				const data = await response.data;
				if (data) {
					const dataMap = new Map(Object.entries(data.exerciseList)); // API response returns object, convert object to Map
					setExerciseList(new Map(dataMap));
					setDisplayExerciseList(new Map(dataMap));
				}
			} catch (error) {
				console.error("Error fetching today's session: ", error);
			}
		};
		if (sessionType != "") {
			getTodaysSession();
		}
	}, [sessionType]);

	const handleAddExercise = (exerciseItem: ExerciseItem) => {
		// check if exercise already in exerciseList list
		if (exerciseList.get(exerciseItem.id)) {
			console.log("Exercise already added.");
		} else {
			// adds selected exercise from dropdown list to exerciseList list
			setExerciseList(prevState => {
				const newMap = new Map(prevState);
				const exercise: ExerciseItem = {
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

	const getSessionExercises = (sessionType: string) => {
		switch (sessionType) {
			case "Push":
				return pushExercises;
			case "Pull":
				return pullExercises;
			case "Legs":
				return legsExercises;
			default:
				return pushExercises;
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
		setDisplayExerciseList(newMap);
	};

	const deleteExerciseFromDB = (exerciseID: string) => {
		const newMap = new Map(exerciseList);
		newMap.delete(exerciseID.toString());
		setExerciseList(newMap);
		setDisplayExerciseList(newMap);
		saveToDB(newMap); // save to DB
	};

	const saveToDB = async (exerciseList: Map<ExerciseItem["id"], ExerciseItem>) => {
		await axios.post(
			"/api/addSession",
			{
				type: sessionType,
				exerciseList: Object.fromEntries(exerciseList)
			},
			{
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
	};

	const handleExerciseCardOnClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (innerDialogOpen) {
			setOuterDialogOpen(false);
		} else {
			setOuterDialogOpen(true);
		}
	};

	return (
		<div className="w-screen flex justify-center">
			<div className="max-w-(--breakpoint-md) w-full flex flex-col items-center gap-12 mx-4">
				<div className="absolute w-full flex justify-between top-5 px-5">
					<Link href="/" className="self-start">
						<Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 sm:mt-20">
							<ChevronLeft />
						</Button>
					</Link>
					<Link href="/pastSessions" className="sm:hidden">
						<Button variant="ghost" className="underline px-0">
							Past Sessions
						</Button>
					</Link>
				</div>
				<h2 className="scroll-m-20 mt-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">{sessionType}</h2>
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger className="px-6 py-4 bg-slate-900 border border-slate-700 rounded-lg sm:mt-20">Add Exercise</DropdownMenuTrigger>
						<DropdownMenuContent>
							{getSessionExercises(sessionType)
								.filter(excer => !exerciseList.get(excer.id))
								.map(exercise => (
									<DialogTrigger key={exercise.id} className="w-full flex">
										<DropdownMenuItem className="w-full flex justify-between" onClick={() => handleAddExercise(exercise)}>
											{exercise.name}
											<ExerciseIconDropdownMenu type={exercise.type} />
										</DropdownMenuItem>
									</DialogTrigger>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
					{exercise ? <ExerciseDialog exercise={exercise} exerciseList={exerciseList} updateExerciseList={updateExerciseList} removeExercise={removeExercise} /> : null}
				</Dialog>
				<div className="w-full flex flex-col gap-10 mb-10">
					{Array.from(displayExerciseList).map(exercise => (
						<Dialog key={exercise[0]} open={outerDialogOpen}>
							<div className="w-full md:w-1/2" onClick={e => handleExerciseCardOnClick(e)}>
								<ExerciseCard exercise={exercise[1]} deleteExerciseFromDB={deleteExerciseFromDB} innerDialogOpen={innerDialogOpen} setInnerDialogOpen={setInnerDialogOpen} />
							</div>
							<ExerciseDialog exercise={exercise[1]} exerciseList={exerciseList} updateExerciseList={updateExerciseList} setOuterDialogOpen={setOuterDialogOpen} />
						</Dialog>
					))}
				</div>
			</div>
		</div>
	);
}
