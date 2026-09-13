import {ExerciseData, ExerciseItem, Session} from "@/utils/ExerciseTypes";
import {Button} from "../ui/button";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger} from "../ui/dialog";
import {FieldGroup} from "../ui/field";
import ExerciseIconDropdownMenu from "./ExerciseIcon";
import ExerciseCardDialog from "./ExerciseCardDialog";
import {useEffect, useState} from "react";

type ExerciseDialogProps = {
	exercise: ExerciseItem;
	exerciseList: Session["exerciseList"];
	updateExerciseList: (exerciseID: string, data: ExerciseItem["data"], method: ExerciseItem["method"]) => void;
	removeExercise?: (exerciseID: string) => void;
	setOuterDialogOpen?: (open: boolean) => void;
};

export default function ExerciseDialog({exercise, updateExerciseList, removeExercise, setOuterDialogOpen}: ExerciseDialogProps) {
	const [exerciseData, setExerciseData] = useState<ExerciseItem["data"]>(exercise.data);

	const [selectedMethod, setSelectedMethod] = useState<ExerciseItem["method"]>(exercise.method);

	const exerciseMethods: Record<ExerciseItem["method"], string> = {
		"Dumbbells": "[|━|]",
		"Machine": "⚙",
		"Barbell": "—",
		"Cable": "⊙"
	}

	useEffect(() => {
		setSelectedMethod(exercise.method)
	}, [exercise.method]);

	const handleUpdateExerciseData = (exerciseData: ExerciseData) => {
		setExerciseData(exerciseData);
	};

	const handleDialogSaveData = () => {
		updateExerciseList(exercise.id, exerciseData, selectedMethod);
		setOuterDialogOpen?.(false);
	};

	return (
		<DialogPortal>
			<DialogOverlay className="bg-black/40 backdrop-blur-sm" />
			<DialogContent
				className="sm:max-w-sm border border-slate-900 rounded-3xl bg-app-primary"
				onPointerDownOutside={() => {
					removeExercise?.(exercise.id);
					setOuterDialogOpen?.(false);
				}}
				onOpenAutoFocus={event => event.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>
						<div className="px-1 mt-6 flex justify-between items-center gap-3">
							<div className="flex flex-col items-start">
								<div className="text-2xl">
									{exercise.name}	
								</div>
								<div className="text-[#a4a7b0] italic">
									{exercise.group}
								</div>
							</div>
							<div className="text-center text-highlight bg-[#102236] px-4 py-4 rounded-full w-1/4">
								{exerciseMethods[selectedMethod]}
							</div>
						</div>
					</DialogTitle>
				</DialogHeader>
				<FieldGroup>
					<div>
						<div className="text-[#a4a7b0] py-4 px-1 font-semibold">Method</div>
						<div className="grid grid-cols-2 bg-app-secondary rounded-3xl py-0.5 px-0.5">
							{Object.entries(exerciseMethods).map(([method, icon]) => {
								const isSelected = selectedMethod === method;

								return (
									<button
										key={method}
										type="button"
										role="radio"
										aria-checked={isSelected}
										onClick={() => setSelectedMethod(method as ExerciseItem["method"])}
										className={["text-[#a4a7b0] px-3 py-4 rounded-3xl text-sm", isSelected ? "bg-app-primary" : ""].join(" ")}
									>
										<span className="px-2">{icon}</span>
										{method}
									</button>
								)
							})}
						</div>
					</div>
				</FieldGroup>
				<FieldGroup>
					<div>
						<div className="text-[#a4a7b0] py-4 px-1 font-semibold">Sets</div>
						<ExerciseCardDialog key={exercise?.id} exercise={exercise} handleUpdateExerciseData={handleUpdateExerciseData} />
					</div>
				</FieldGroup>
				<DialogFooter>
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-1">
							<DialogClose asChild>
								<Button
									className="py-6 md:py-0 bg-app-secondary text-red-400 w-full rounded-3xl"
									onClick={() => {
										removeExercise?.(exercise.id);
										setOuterDialogOpen?.(false);
									}}
								>
									Cancel
								</Button>
							</DialogClose>	
						</div>
						<div className="col-span-2">
							<DialogClose asChild>
								<Button
									className="py-6 md:py-0 bg-highlight w-full rounded-3xl"
									onClick={() => handleDialogSaveData()}>
									Save
								</Button>
							</DialogClose>	
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</DialogPortal>
	);
}
