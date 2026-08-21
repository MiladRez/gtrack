import {Exercise, ExerciseData, ExerciseItem} from "@/utils/ExerciseTypes";
import {Button} from "../ui/button";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {FieldGroup} from "../ui/field";
import ExerciseIconDropdownMenu from "./ExerciseIconDropdownMenu";
import ExerciseCardDialog from "./ExerciseCardDialog";
import {useState} from "react";
import {OutletBoundary} from "next/dist/lib/framework/boundary-components";

type ExerciseDialogProps = {
	exercise: Exercise;
	exerciseList: Map<string, Exercise>;
	updateExerciseList: (exerciseID: string, data: ExerciseData) => void;
	removeExercise: (exerciseID: string) => void;
};

export default function ExerciseDialog({exercise, exerciseList, updateExerciseList, removeExercise}: ExerciseDialogProps) {
	const ExerciseIcon = ({type}: {type: "Dumbbell" | "Bar" | "Machine"}) => {
		switch (type) {
			case "Dumbbell":
				return (
					<svg fill="white" className="w-5 h-5">
						<use href="/icons.svg#dumbbell" />
					</svg>
				);
			case "Bar":
				return (
					<svg fill="white" className="w-6 h-6">
						<use href="/icons.svg#barbell" />
					</svg>
				);
			case "Machine":
				return (
					<svg stroke="white" fill="white" className="w-6 h-6">
						<use href="/icons.svg#machine" />
					</svg>
				);
			default:
				return (
					<svg fill="white" className="w-6 h-6">
						<use href="/icons.svg#spinner" />
					</svg>
				);
		}
	};

	const [exerciseData, setExerciseData] = useState<ExerciseData>({
		set1: {weight: 0, reps: 0},
		set2: {weight: 0, reps: 0},
		set3: {weight: 0, reps: 0}
	});

	const excerciseItemToExercise = (exerciseItem: ExerciseItem) => {
		const newExercise: Exercise = {
			...exerciseItem,
			data: {
				set1: {weight: 0, reps: 0},
				set2: {weight: 0, reps: 0},
				set3: {weight: 0, reps: 0}
			}
		};
		return newExercise;
	};

	const handleUpdateExerciseData = (exerciseData: ExerciseData) => {
		setExerciseData(exerciseData);
	};

	const handleDialogSaveData = () => {
		console.log("saving clicked");
		console.log(exerciseData)
		updateExerciseList(exercise.id, exerciseData);
		// saveToDB(exerciseList);
	};

	const handleAddExerciseToExerciseList = (exerciseItem: ExerciseItem) => {
		// check if exercise already in exerciseList list
		// if (exerciseList.get(exerciseItem.id)) {
		// 	console.log("Exercise already added.")
		// } else {
		// 	// adds selected exercise from dropdown list to exerciseList list
		// 	setExerciseList((prevState) => {
		// 		const newMap = new Map(prevState);
		// 		const exercise: Exercise = {
		// 			...exerciseItem,
		// 			data: {
		// 				set1: {weight: 0, reps: 0},
		// 				set2: {weight: 0, reps: 0},
		// 				set3: {weight: 0, reps: 0}
		// 			}
		// 		};
		// 		setExercise(exercise)
		// 		newMap.set(exercise.id, exercise)
		// 		return newMap;
		// 	});
		// }
		// setExercise(exerciseItem);
	};

	return (
		<DialogContent className="sm:max-w-sm border border-app-primary-border rounded-3xl bg-app-primary" onInteractOutside={() => removeExercise(exercise.id)} onOpenAutoFocus={event => event.preventDefault()}>
			<DialogHeader>
				<DialogTitle>
					<div className="flex flex-col items-center gap-3 mb-4">
						<ExerciseIcon type={exercise?.type} />
						{exercise?.name}
					</div>
				</DialogTitle>
			</DialogHeader>
			<FieldGroup>
				<ExerciseCardDialog key={exercise?.id} exercise={exercise} handleUpdateExerciseData={handleUpdateExerciseData} />
			</FieldGroup>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="destructive" className="py-6 md:py-0 border border-app-primary-border" onClick={() => removeExercise(exercise.id)}>
						Cancel
					</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button className="py-6 md:py-0 border border-app-primary-border bg-app-primary" onClick={() => handleDialogSaveData()}>
						Save
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
