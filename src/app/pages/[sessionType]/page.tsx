"use client";

import {useEffect, useState, MouseEvent} from "react";
import ExerciseCard from "@/components/custom/ExerciseCard";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {ExerciseItem, Session} from "@/utils/ExerciseTypes";
import axios from "axios";
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
	const [exercise, setExercise] = useState<ExerciseItem | null>(null);

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


	//TODO - could use session id here, but not sure if I want to
	useEffect(() => {
		const getTodaysSession = async () => {
			try {
				const response = await axios.get("/api/getTodaysSession", {
					params: {type: sessionType}
				});

				const data = await response.data;
				if (data) {
					setSessionID(data._id);
					setExerciseList(data.exerciseList);
					setDisplayExerciseList(data.exerciseList);
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
		if (exerciseList[exerciseItem.id]) {
			console.log("Exercise already added.");
		} else {
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
			deleteFromDB.mutate(sessionID)
		} else {
			saveToDB.mutate(newExerciseList);
		}
		
	};

	const saveToDB = useMutation({
		mutationFn: (exerciseList: Session["exerciseList"]) => (
			axios.post(
				"/api/addExercise",
				{
					_id: sessionID,
					type: sessionType,
					exerciseList: exerciseList
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
		).then(res => res.data),
		onSuccess: (newSet) => {
			queryClient.setQueryData(["sessions"], (old: Session[]) => {
				if (!old) return old; // safety check: if cache is empty/loading dont try to modify it, just leave it

				console.log("looking for _id:", newSet["_id"]);

				const exists = old.some((session: Session) => session["_id"] === newSet["_id"]);

				if (exists) {
					return old.map((session: Session) => session["_id"] === newSet["_id"] ? {
						...session,
						exerciseList: newSet.exerciseList
					}
						: session
					);
				} else {
					setSessionID(newSet["_id"]);
					return [...old, newSet];
				}				
			});
		}
	})

	const deleteFromDB = useMutation({
		mutationFn: (sessionID: Session["_id"]) => (
			axios.post(
				"/api/deleteExercise",
				{
					_id: sessionID
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
		).then(res => res.data),
		onSuccess: (deletedSession) => {
			queryClient.setQueryData(["sessions"], (old: Session[]) => {
				if (!old) return old;

				return old.filter((session: Session) => session["_id"] !== deletedSession["_id"]);
			});
		}
	});

	return (
		<div className="w-screen flex justify-center">
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
						<DropdownMenuContent>
							{getSessionExercises(sessionType)
								.filter(excer => !exerciseList[excer.id])
								.map(exercise => (
									<DialogTrigger key={exercise.id} className="w-full flex">
										<DropdownMenuItem className="w-full flex justify-between" onClick={() => handleAddExercise(exercise)}>
											{exercise.name}
											<ExerciseIcon method={exercise.method} />
										</DropdownMenuItem>
									</DialogTrigger>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
					{exercise ? <ExerciseDialog exercise={exercise} exerciseList={exerciseList} updateExerciseList={updateExerciseList} removeExercise={removeExercise} /> : null}
				</Dialog>
				<div className="w-full flex flex-col gap-10 mb-10">
					{Object.entries(displayExerciseList).map(([exercise_id, exercise_item]) => (
						<ExerciseCard
							key={exercise_id}
							exercise={exercise_item}
							deleteExerciseFromDB={deleteExerciseFromDB}
							exerciseList={exerciseList}
							updateExerciseList={updateExerciseList}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
