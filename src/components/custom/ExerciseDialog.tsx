import {Exercise, ExerciseData, ExerciseItem} from "@/utils/ExerciseTypes";
import {Button} from "../ui/button";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger} from "../ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {FieldGroup} from "../ui/field";
import ExerciseIconDropdownMenu from "./ExerciseIconDropdownMenu";
import ExerciseCardDialog from "./ExerciseCardDialog";
import {useState} from "react";
import {OutletBoundary} from "next/dist/lib/framework/boundary-components";

type ExerciseDialogProps = {
	exercise: Exercise,
	exerciseList: Map<string, Exercise>,
	updateExerciseList: (exerciseID: string, data: ExerciseData) => void,
	removeExercise?: (exerciseID: string) => void
}

export default function ExerciseDialog({exercise, exerciseList, updateExerciseList, removeExercise}: ExerciseDialogProps) {

	const [exerciseData, setExerciseData] = useState<ExerciseData>({
		set1: {weight: 0, reps: 0},
		set2: {weight: 0, reps: 0},
		set3: {weight: 0, reps: 0}
	});

	const handleUpdateExerciseData = (exerciseData: ExerciseData) => {
		setExerciseData(exerciseData);
	}

	const handleDialogSaveData = () => {
		updateExerciseList(exercise.id, exerciseData);
	}

	return (
		<DialogPortal>
			<DialogOverlay className="bg-black/40 backdrop-blur-sm" />
			<DialogContent className="sm:max-w-sm border border-app-primary-border rounded-3xl bg-app-primary"
				onPointerDownOutside={() => removeExercise?.(exercise.id)}
				onOpenAutoFocus={(event) => event.preventDefault()}>
				<DialogHeader>
					<DialogTitle>
						<div className="flex flex-col items-center gap-3 mb-4 text-highlight">
							<ExerciseIconDropdownMenu type={exercise.type} color="white" />
							{exercise?.name}
						</div>
					</DialogTitle>
				</DialogHeader>
				<FieldGroup>
					<ExerciseCardDialog key={exercise?.id} exercise={exercise} handleUpdateExerciseData={handleUpdateExerciseData} />
				</FieldGroup>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="destructive" className="py-6 md:py-0 border border-app-primary-border" onClick={() => removeExercise?.(exercise.id)}>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button className="py-6 md:py-0 border border-app-primary-border bg-app-tertiary" onClick={() => handleDialogSaveData()}>Save</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>			
		</DialogPortal>	
	)
 }