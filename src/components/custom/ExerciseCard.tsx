import {ExerciseItem, ExerciseData, Session} from "@/utils/ExerciseTypes";
import ExerciseIcon from "./ExerciseIcon";
import ProgressIcons from "./ProgressIcons";
import {DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogOverlay} from "../ui/dialog";
import {Button} from "../ui/button";
import {MouseEvent, useEffect, useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import ExerciseDialog from "./ExerciseDialog";

type ExerciseCardProps = {
	exercise: ExerciseItem;
	deleteExerciseFromDB: (exerciseID: string) => void;
	exerciseList: Session["exerciseList"];
	updateExerciseList: (exerciseID: string, data: ExerciseItem["data"], method: ExerciseItem["method"]) => void;
};

export default function ExerciseCard({exercise, deleteExerciseFromDB, exerciseList, updateExerciseList}: ExerciseCardProps) {

	const [prevSessionData, setPrevSessionData] = useState<ExerciseData>();
	const [outerDialogOpen, setOuterDialogOpen] = useState(false);
	const [innerDialogOpen, setInnerDialogOpen] = useState(false);

	const numOfSets = 3;

	useEffect(() => {
		const getPrevExerciseData = async () => {
			try {
				const response = await axios.get("/api/getPrevExerciseData", {
					params: {
						exerciseID: exercise.id,
						type: exercise.group
					}
				});

				const data = await response.data;
				if (data) {
					setPrevSessionData(data);
				}
			} catch (error) {
				console.error("Error fetching today's session: ", error);
			}
		};
		getPrevExerciseData();
	}, [exercise]);

	const handleCrossOnClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setInnerDialogOpen(true);
	};

	const handleDeleteExercise = () => {
		deleteExerciseFromDB(exercise.id);
		setInnerDialogOpen(false);
	};

	const handleExerciseCardOnClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (innerDialogOpen) {
			setOuterDialogOpen(false);
		} else {
			setOuterDialogOpen(true);
		}
	};

	// alert dialog for confirming if user wants to delete the exercise
	const AlertDialog = () => {
		return (
			<DialogContent className="bg-app-primary border border-app-primary-border" onClick={e => e.stopPropagation()} onPointerDownOutside={() => setInnerDialogOpen(false)}>
				<DialogHeader>
					<DialogTitle>
						<div className="flex flex-col items-center gap-3 mb-4 text-highlight">Are you sure you want to remove this exercise?</div>
					</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="destructive" className="py-6 md:py-0 border border-app-primary-border" onClick={handleDeleteExercise}>
							Remove
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button className="py-6 md:py-0 border border-app-primary-border bg-app-tertiary" onClick={() => setInnerDialogOpen(false)}>
							Cancel
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		);
	};

	const ExerciseSets = () => {

		const displayCurrentExerciseData = (set: string) => {
			if (exercise.data?.[set as keyof ExerciseData].weight == 0 || exercise.data?.[set as keyof ExerciseData].reps == 0) {
				return <div className="text-muted-foreground place-self-start">-</div>;
			} else {
				return (
					<div className="place-self-start">
						{exercise.data?.[set as keyof ExerciseData].weight} lbs x {exercise.data?.[set as keyof ExerciseData].reps}
					</div>
				);
			}
		};

		const displayPreviousExerciseData = (set: string) => {
			if (prevSessionData) {
				return (
					<div className="place-self-start">
						{prevSessionData[set as keyof ExerciseData].weight} lbs x {prevSessionData[set as keyof ExerciseData].reps}
					</div>
				);
			} else {
				return <div className="text-muted-foreground place-self-start">-</div>;
			}
		};

		const displayProgressIcons = (set: string) => {
			let currVolume = 0
			let prevVolume = 0;
			if (prevSessionData) {
				prevVolume = prevSessionData[set as keyof ExerciseData].weight * prevSessionData[set as keyof ExerciseData].reps;
			}

			if (exercise.data) {
				currVolume = exercise.data?.[set as keyof ExerciseData].weight * exercise.data?.[set as keyof ExerciseData].reps;
			}

			if (prevVolume < currVolume) {
				return (
					<div className="place-self-center">
						<ProgressIcons type="up-arrow" />
					</div>
				);
			} else if (prevVolume > currVolume) {
				return (
					<div className="place-self-center">
						<ProgressIcons type="down-arrow" />
					</div>
				);
			} else {
				return (
					<div className="place-self-center">
						<ProgressIcons type="equals" color="white" />
					</div>
				);
			}
		};

		const exerciseSets = [];

		for (let i = 1; i <= numOfSets; i++) {
			const setNum = "set" + i
			exerciseSets.push(
				<div key={setNum} className="col-span-4 grid grid-cols-subgrid text-sm">
					<div className="place-self-start pl-3">{i}</div>
					{displayPreviousExerciseData(setNum)}
					{displayCurrentExerciseData(setNum)}
					{displayProgressIcons(setNum)}
				</div>
			)
		}

		return exerciseSets;
	}

	return (
		<Dialog open={outerDialogOpen}>
			<div className="w-full md:w-1/2" onClick={e => handleExerciseCardOnClick(e)}>
				<div className="bg-app-primary px-4 py-4 border border-app-primary-border rounded-xl flex flex-col gap-4 focus:outline-none">
					<div className="flex justify-between">
						<div className="flex gap-4">
							<div className="border border-app-primary-border rounded-md px-2 py-2">
								<ExerciseIcon method={exercise.method} color="white" />
							</div>
							<div className="mt-1 text-highlight">{exercise.name}</div>
						</div>
						<Dialog open={innerDialogOpen}>
							<DialogOverlay className="bg-black/40 backdrop-blur-sm" />
							<div onClick={e => handleCrossOnClick(e)}>
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
						<ExerciseSets />
					</div>
				</div>
			</div>
			<ExerciseDialog exercise={exercise} exerciseList={exerciseList} updateExerciseList={updateExerciseList} setOuterDialogOpen={setOuterDialogOpen} />
		</Dialog>
	);
}
