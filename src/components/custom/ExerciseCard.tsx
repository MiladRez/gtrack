import {ExerciseItem, ExerciseData, Session} from "@/utils/ExerciseTypes";
import ExerciseIcon from "./ExerciseIcon";
import ProgressIcons from "./ProgressIcons";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogOverlay} from "../ui/dialog";
import {Button} from "../ui/button";
import {MouseEvent, useState} from "react";
import ExerciseDialog from "./ExerciseDialog";

type ExerciseCardProps = {
	exercise: ExerciseItem;
	deleteExerciseFromDB: (exerciseID: string) => void;
	exerciseList: Session["exerciseList"];
	updateExerciseList: (exerciseID: string, data: ExerciseItem["data"], method: ExerciseItem["method"]) => void;
	prevSessionData?: ExerciseData;
};

export default function ExerciseCard({exercise, deleteExerciseFromDB, exerciseList, updateExerciseList, prevSessionData}: ExerciseCardProps) {

	const [outerDialogOpen, setOuterDialogOpen] = useState(false);
	const [innerDialogOpen, setInnerDialogOpen] = useState(false);

	const numOfSets = 3;

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
				<DialogContent className="rounded-[2rem] border-white/10 bg-black/75 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl" onClick={e => e.stopPropagation()} onPointerDownOutside={() => setInnerDialogOpen(false)}>
				<DialogHeader>
					<DialogTitle>
							<div className="mb-4 flex flex-col items-center gap-3 text-white">Remove this exercise?</div>
					</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
							<Button variant="destructive" className="rounded-2xl border border-red-400/20 bg-red-500/20 py-6 text-red-100 md:py-0" onClick={handleDeleteExercise}>
							Remove
						</Button>
					</DialogClose>
					<DialogClose asChild>
							<Button className="apple-button py-6 md:py-0" onClick={() => setInnerDialogOpen(false)}>
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
				return <div className="text-muted-foreground place-self-start w-[72.38px] text-center">-</div>;
			} else {
				return (
					<div className="place-self-start">
						{exercise.data?.[set as keyof ExerciseData].weight} lbs x {exercise.data?.[set as keyof ExerciseData].reps}
					</div>
				);
			}
		};

		const displayPreviousExerciseData = (set: string) => {
			const setData = prevSessionData?.[set as keyof ExerciseData];

			if (setData && setData.weight !== 0 && setData.reps !== 0) {
				return (
					<div className="place-self-start">
						{setData.weight} lbs x {setData.reps}
					</div>
				);
			} else {
				return <div className="text-muted-foreground place-self-start w-[72.38px] text-center">-</div>;
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
						<ProgressIcons type="equals" color="neutral" />
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
				<div className="glass-panel flex flex-col gap-5 rounded-[1.75rem] px-4 py-4 focus:outline-none">
					<div className="flex justify-between">
						<div className="flex gap-3">
							<div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
								<ExerciseIcon method={exercise.method} color="white" />
							</div>
							<div className="mt-1 text-lg font-semibold tracking-tight text-white">{exercise.name}</div>
						</div>
						<Dialog open={innerDialogOpen}>
							<DialogOverlay className="bg-black/40 backdrop-blur-sm" />
							<div className="rounded-full p-1 text-red-300/80" onClick={e => handleCrossOnClick(e)}>
								<svg className="h-6 w-6">
									<use href="/icons.svg#cross" />
								</svg>
							</div>
							<AlertDialog />
						</Dialog>
					</div>
					<div className="grid grid-cols-[0.5fr_1fr_0.8fr_0.5fr] gap-x-3 gap-y-4">
						<div className="col-span-4 grid grid-cols-subgrid place-items-start text-xs font-medium uppercase tracking-[0.12em] text-white/38">
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
