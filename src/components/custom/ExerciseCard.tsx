import {Exercise, ExerciseData, Session} from "@/utils/ExerciseTypes";
import ExerciseIconDropdownMenu from "./ExerciseIconDropdownMenu";
import ProgressIcons from "./ProgressIcons";
import {DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogOverlay} from "../ui/dialog";
import {Button} from "../ui/button";
import {MouseEvent, useEffect, useState} from "react";
import axios from "axios";

type ExerciseCardProps = {
	exercise: Exercise;
	deleteExerciseFromDB: (exerciseID: string) => void;
	innerDialogOpen: boolean;
	setInnerDialogOpen: (open: boolean) => void;
};

export default function ExerciseCard({exercise, deleteExerciseFromDB, innerDialogOpen, setInnerDialogOpen}: ExerciseCardProps) {

	const [sessions, setSessions] = useState<Session[]>([]);
	const [prevSession, setPrevSession] = useState<Session>();

	const prevExerciseData = prevSession?.exerciseList[exercise.id].data

	useEffect(() => {
		const getSessions = async () => {
			try {
				const response = await axios.get("/api/getSessions");

				const data = await response.data;
				if (data) {
					setSessions(data);
				}
			} catch (error) {
				console.error("Error fetching today's session: ", error);
			}
		};
		getSessions();
	}, []);

	useEffect(() => {
		if (sessions) {
			const typeSessions = sessions.filter(session => session.type === exercise.group)
			if (typeSessions.length > 1) {
				const previousSession = typeSessions.slice(0,-1).reduce((latest, current) => {
					return current.date > latest.date ? current : latest
				}, sessions[1]);
				setPrevSession(previousSession);
			}
		}
	}, [sessions]);

	const displayCurrentExerciseData = (set: "set1" | "set2" | "set3") => {
		if (exercise.data[set].weight == 0 || exercise.data[set].reps == 0) {
			return (
				<div className="text-muted-foreground place-self-start">-</div>
			)
		} else {
			return (
				<div className="place-self-start">
					{exercise.data[set].weight} lbs x {exercise.data[set].reps}
				</div>
			)
		}
	}

	const displayPreviousExerciseData = (set: "set1" | "set2" | "set3") => {
		if (prevSession) {
			return (
				<div className="place-self-start">
					{prevExerciseData[set].weight} lbs x {prevExerciseData[set].reps}
				</div>
			)
		} else {
			return (
				<div className="text-muted-foreground place-self-start">-</div>
			)
		}
	}

	const displayProgressIcons = (set: "set1" | "set2" | "set3") => {
		let prevVolume = 0;
		if (prevSession) {
			prevVolume = prevExerciseData[set].weight * prevExerciseData[set].reps;
		}
		
		const currVolume = exercise.data[set].weight * exercise.data[set].reps;

		if (prevVolume < currVolume) {
			return (
				<div className="place-self-center">
					<ProgressIcons type="up-arrow" />
				</div>
			)
		} else if (prevVolume > currVolume) {
			return (
				<div className="place-self-center">
					<ProgressIcons type="down-arrow" />
				</div>
			)
		} else {
			return (
				<div className="place-self-center">
					<ProgressIcons type="equals" color="white" />
				</div>	
			)
		}
	}

	const handleCrossOnClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setInnerDialogOpen(true);
	}

	const handleDeleteExercise = () => {
		deleteExerciseFromDB(exercise.id)
		setInnerDialogOpen(false);
	}

	// alert dialog for confirming if user wants to delete the exercise
	const AlertDialog = () => {
		return (
			<DialogContent
				className="bg-app-primary border border-app-primary-border"
				onClick={(e) => e.stopPropagation()}
				onPointerDownOutside={() => setInnerDialogOpen(false)}
			>
				<DialogHeader>
					<DialogTitle>
						<div className="flex flex-col items-center gap-3 mb-4 text-highlight">
							Are you sure you want to remove this exercise?
						</div>
					</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="destructive" className="py-6 md:py-0 border border-app-primary-border" onClick={handleDeleteExercise}>Remove</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button className="py-6 md:py-0 border border-app-primary-border bg-app-tertiary" onClick={() => setInnerDialogOpen(false)}>Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		)
	}

	return (
		<div className="bg-app-primary px-4 py-4 border border-app-primary-border rounded-xl flex flex-col gap-4 focus:outline-none">
			<div className="flex justify-between">
				<div className="flex gap-4">
					<div className="border border-app-primary-border rounded-md px-2 py-2">
						<ExerciseIconDropdownMenu type={exercise.type} color="white" />
					</div>
					<div className="mt-1 text-highlight">
						{exercise.name}
					</div>
				</div>
				<Dialog open={innerDialogOpen}>
					<DialogOverlay className="bg-black/40 backdrop-blur-sm" />
					<div onClick={(e) => handleCrossOnClick(e)}>
						<svg className={`w-6 h-6 text-[#dd1c1a]`}>
							<use href="/icons.svg#cross" />
						</svg>
					</div>
					<AlertDialog />
				</Dialog>
			</div>
			<div className="grid grid-cols-[0.5fr_1fr_0.8fr_0.5fr] gap-4">
				<div className="col-span-4 grid grid-cols-subgrid place-items-start text-neutral-400 uppercase">
					<div>Set</div>
					<div>Previous</div>
					<div>Today</div>
					<div>Progress</div>
				</div>
				<div className="col-span-4 grid grid-cols-subgrid text-sm">
					<div className="place-self-start pl-3">1</div>
					{displayPreviousExerciseData("set1")}
					{displayCurrentExerciseData("set1")}
					{displayProgressIcons("set1")}
				</div>
				<div className="col-span-4 grid grid-cols-subgrid text-sm">
					<div className="place-self-start pl-3">2</div>
					{displayPreviousExerciseData("set2")}
					{displayCurrentExerciseData("set2")}
					{displayProgressIcons("set2")}
				</div>
				<div className="col-span-4 grid grid-cols-subgrid text-sm">
					<div className="place-self-start pl-3">3</div>
					{displayPreviousExerciseData("set3")}
					{displayCurrentExerciseData("set3")}
					{displayProgressIcons("set3")}
				</div>
			</div>
		</div>
	);
}
