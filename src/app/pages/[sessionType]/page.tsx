"use client";

import {useEffect, useState} from "react";
import ExerciseCard from "@/components/custom/ExerciseCard";
import {ExerciseData, ExerciseItem, Session, SessionSummary, TodaysSession} from "@/utils/ExerciseTypes";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import ExerciseDialog from "@/components/custom/ExerciseDialog";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import ExerciseIcon from "@/components/custom/ExerciseIcon";
import {pushExercisesList, pullExercisesList, legExercisesList} from "@/utils/Exercises";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function TodaysSessionPage({params}: {params: {sessionType: string}}) {
	const queryClient = useQueryClient();

	const [sessionType, setSessionType] = useState<Session["type"]>("");
	const [sessionID, setSessionID] = useState<Session["_id"]>("");
	const [exerciseList, setExerciseList] = useState<Session["exerciseList"]>({});
	const [displayExerciseList, setDisplayExerciseList] = useState<Session["exerciseList"]>({});
	const [previousExerciseData, setPreviousExerciseData] = useState<Record<string, ExerciseData>>({});
	const [exercise, setExercise] = useState<ExerciseItem | null>(null);

	useEffect(() => {
		const getSessionType = async () => {
			const {sessionType} = await params;
			setSessionType(sessionType.charAt(0).toUpperCase() + sessionType.slice(1));
		};
		getSessionType();
	}, [params]);


	useEffect(() => {
		const getTodaysSession = async () => {
			const response = await fetch(`/api/getTodaysSession?type=${encodeURIComponent(sessionType)}`);

			if (!response.ok) {
				throw new Error("Failed to fetch today's session");
			}

			const data: TodaysSession | null = await response.json();
			if (data) {
				setSessionID(data._id);
				setExerciseList(data.exerciseList);
				setDisplayExerciseList(data.exerciseList);
				setPreviousExerciseData(data.previousExerciseData ?? {});
			}
		};
		if (sessionType != "") {
			getTodaysSession();
		}
	}, [sessionType]);

	const loadPreviousExerciseData = async (exerciseItem: ExerciseItem) => {
		if (previousExerciseData[exerciseItem.id]) {
			return;
		}

		const params = new URLSearchParams({
			exerciseID: exerciseItem.id,
			group: exerciseItem.group
		});

		if (sessionID) {
			params.set("sessionID", sessionID);
		}

		const response = await fetch(`/api/getPrevExerciseData?${params.toString()}`);

		if (!response.ok) {
			throw new Error("Failed to fetch previous exercise data");
		}

		const data: ExerciseData | null = await response.json();

		if (data) {
			setPreviousExerciseData(prevState => ({
				...prevState,
				[exerciseItem.id]: data
			}));
		}
	};

	const handleAddExercise = (exerciseItem: ExerciseItem) => {
		// check if exercise already in exerciseList list
		if (exerciseList[exerciseItem.id]) {
			return;
		} else {
			void loadPreviousExerciseData(exerciseItem);

			// adds selected exercise from dropdown list to exerciseList list
			setExerciseList(prevState => {
				const newExerciseList = {...prevState};
				const exercise: ExerciseItem = {
					...exerciseItem,
					data: {
						set1: {weight: 0, reps: 0},
						set2: {weight: 0, reps: 0},
						set3: {weight: 0, reps: 0}
					}
				};
				newExerciseList[exercise.id] = exercise;
				setExercise(exercise);
				return newExerciseList;
			});
		}
	};

	const getSessionExercises = (sessionType: string) => {
		switch (sessionType) {
			case "Push":
				return pushExercisesList;
			case "Pull":
				return pullExercisesList;
			case "Legs":
				return legExercisesList;
			default:
				return pushExercisesList;
		}
	};

	const updateExerciseList = (exerciseID: string, data: ExerciseItem["data"], method: ExerciseItem["method"]) => {
		const newExerciseList = {
			...exerciseList,
			[exerciseID]: {
				...exerciseList[exerciseID],
				data,
				method
			}
		}
		setExerciseList(newExerciseList);
		setDisplayExerciseList(newExerciseList);
		saveToDB.mutate(newExerciseList);
	};

	// removes exercise from exerciseList
	const removeExercise = (exerciseID: string) => {
		const newExerciseList = {...exerciseList};
		delete newExerciseList[exerciseID];
		setExerciseList(newExerciseList);
		setDisplayExerciseList(newExerciseList);
		return newExerciseList;
	};

	// actually makes the call to delete it from db
	const deleteExerciseFromDB = (exerciseID: string) => {
		const newExerciseList = removeExercise(exerciseID);
		if (Object.keys(newExerciseList).length === 0) {
			deleteFromDB.mutate(sessionID);
			setSessionID("");
		} else {
			saveToDB.mutate(newExerciseList);
		}
		
	};

	const saveToDB = useMutation({
		mutationFn: async (exerciseList: Session["exerciseList"]) => {
			const response = await fetch("/api/addExercise", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					_id: sessionID,
					type: sessionType,
					exerciseList: exerciseList
				})
			});

			if (!response.ok) {
				throw new Error("Failed to save session");
			}

			return response.json();
		},
		onSuccess: (newSet) => {
			setSessionID(newSet["_id"]);
			queryClient.setQueryData(["sessions"], (old: SessionSummary[]) => {
				if (!old) return old; // safety check: if cache is empty/loading dont try to modify it, just leave it

				const exists = old.some((session: SessionSummary) => session["_id"] === newSet["_id"]);
				const summary = {
					_id: newSet["_id"],
					type: newSet.type,
					date: newSet.date,
					exerciseCount: Object.keys(newSet.exerciseList ?? {}).length
				};

				if (exists) {
					return old.map((session: SessionSummary) => session["_id"] === newSet["_id"] ? summary
						: session
					);
				} else {
					return [summary, ...old];
				}				
			});
		}
	})

	const deleteFromDB = useMutation({
		mutationFn: async (sessionID: Session["_id"]) => {
			const response = await fetch("/api/deleteExercise", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					_id: sessionID
				})
			});

			if (!response.ok) {
				throw new Error("Failed to delete session");
			}

			return response.json();
		},
		onSuccess: (deletedSession) => {
			queryClient.setQueryData(["sessions"], (old: SessionSummary[]) => {
				if (!old) return old;

				return old.filter((session: SessionSummary) => session["_id"] !== deletedSession["_id"]);
			});
		}
	});

	return (
		<div className="w-full flex justify-center">
			<div className="max-w-(--breakpoint-md) w-full flex flex-col items-center gap-12 mx-4">
				<div className="absolute w-full flex justify-between top-5 px-5">
					<Link href="/" className="self-start">
						<Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 sm:mt-20">
							<ChevronLeft />
						</Button>
					</Link>
					<Link href="/pages/pastSessions" className="sm:hidden">
						<Button variant="ghost" className="underline px-0">
							Past Sessions
						</Button>
					</Link>
				</div>
				<h2 className="scroll-m-20 mt-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">{sessionType}</h2>
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger className="px-6 py-4 bg-slate-900 border border-slate-700 rounded-lg sm:mt-20">Add Exercise</DropdownMenuTrigger>
						<DropdownMenuContent className="rounded-xl mt-4">
							{getSessionExercises(sessionType)
								.filter(excer => !Object.values(exerciseList).some(
									(existingExercise) => existingExercise.id === excer.id && existingExercise.group === excer.group
								))
								.map(exercise => (
									<DialogTrigger key={`${exercise.id}-${exercise.name}`} className="flex w-full rounded-sm py-2">
										<DropdownMenuItem className="w-full flex justify-between" onClick={() => handleAddExercise(exercise)}>
											{exercise.name}
											<div className="flex items-center">
												<ExerciseIcon method={exercise.method} />
											</div>
										</DropdownMenuItem>
									</DialogTrigger>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
					{exercise ? <ExerciseDialog exercise={exercise} exerciseList={exerciseList} updateExerciseList={updateExerciseList} removeExercise={removeExercise} /> : null}
				</Dialog>
				<div className="w-full flex flex-col gap-10 mb-10">
					{
						Object.entries(displayExerciseList).map(([exercise_id, exercise_item]) => (
						<ExerciseCard
							key={exercise_id}
							exercise={exercise_item}
							deleteExerciseFromDB={deleteExerciseFromDB}
							exerciseList={exerciseList}
							updateExerciseList={updateExerciseList}
							prevSessionData={previousExerciseData[exercise_id]}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
