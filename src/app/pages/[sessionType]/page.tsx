"use client";

import {useEffect, useState} from "react";
import ExerciseCard from "@/components/custom/ExerciseCard";
import {ExerciseData, ExerciseItem, Session, SessionSummary, TodaysSession} from "@/utils/ExerciseTypes";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft, Plus} from "lucide-react";
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
		<div className="page-shell flex justify-center">
			<div className="flex w-full max-w-(--breakpoint-md) flex-col gap-8 pt-1">
				<div className="relative z-auto flex items-center justify-between">
					<Link href="/" className="relative z-auto self-start">
						<Button variant="outline" size="icon" className="glass-control size-11 rounded-full border-white/10 bg-black/30">
							<ChevronLeft />
						</Button>
					</Link>
					<Link href="/pages/pastSessions" className="relative z-auto sm:hidden">
						<Button variant="ghost" className="h-11 rounded-full bg-black/25 px-4 text-white/70 backdrop-blur-xl">
							Past Sessions
						</Button>
					</Link>
				</div>
				<div className="pt-8">
					<p className="text-sm font-medium uppercase tracking-[0.16em] text-white/40">Today</p>
					<h2 className="mt-2 text-5xl font-semibold tracking-tight text-white">{sessionType}</h2>
				</div>
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								aria-label="Add exercise"
								className="fixed bottom-6 right-6 z-40 size-16 rounded-full border border-white/30 bg-white/[0.025] text-white shadow-[0_14px_36px_rgba(0,0,0,0.32),inset_0_1px_1px_rgba(255,255,255,0.28)] backdrop-blur-[3px] transition active:scale-95 [&_svg]:!size-6"
							>
								<Plus strokeWidth={2.75} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" side="top" className="mb-4 mr-2 min-w-64 rounded-3xl border-white/10 bg-black/70 p-2 text-white shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
							{getSessionExercises(sessionType)
								.filter(excer => !Object.values(exerciseList).some(
									(existingExercise) => existingExercise.id === excer.id && existingExercise.group === excer.group
								))
								.map(exercise => (
									<DialogTrigger key={`${exercise.id}-${exercise.name}`} className="flex w-full rounded-2xl py-1">
										<DropdownMenuItem className="flex w-full justify-between rounded-2xl px-4 py-3 text-base text-white/90 focus:bg-white/10 focus:text-white" onClick={() => handleAddExercise(exercise)}>
											{exercise.name}
											<div className="flex items-center">
												<ExerciseIcon method={exercise.method} color="white" />
											</div>
										</DropdownMenuItem>
									</DialogTrigger>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
					{exercise ? <ExerciseDialog exercise={exercise} exerciseList={exerciseList} updateExerciseList={updateExerciseList} removeExercise={removeExercise} /> : null}
				</Dialog>
				<div className="mb-24 flex w-full flex-col gap-4">
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
