import {ExerciseData, ExerciseItem, Session} from "@/utils/ExerciseTypes";
import {Button} from "../ui/button";
import {DialogClose, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle} from "../ui/dialog";
import {FieldGroup} from "../ui/field";
import ExerciseCardDialog from "./ExerciseCardDialog";
import {useEffect, useState, useRef} from "react";
import ExerciseIcon from "./ExerciseIcon";

type ExerciseDialogProps = {
	exercise: ExerciseItem;
	exerciseList: Session["exerciseList"];
	updateExerciseList: (exerciseID: string, data: ExerciseItem["data"], method: ExerciseItem["method"]) => void;
	removeExercise?: (exerciseID: string) => void;
	setOuterDialogOpen?: (open: boolean) => void;
};

export default function ExerciseDialog({exercise, updateExerciseList, removeExercise, setOuterDialogOpen}: ExerciseDialogProps) {
	const [exerciseData, setExerciseData] = useState<ExerciseItem["data"]>(exercise.data);
	const exerciseDataRef = useRef<ExerciseData | undefined>(exerciseData);

	const [selectedMethod, setSelectedMethod] = useState<ExerciseItem["method"]>(exercise.method);

	const exerciseMethods: ExerciseItem["method"][] = ["Dumbbells", "Machine", "Barbell", "Cable"];

	useEffect(() => {
		setSelectedMethod(exercise.method)
	}, [exercise.method]);

	const handleUpdateExerciseData = (exerciseData: ExerciseData | undefined) => {
		exerciseDataRef.current = exerciseData;
		setExerciseData(exerciseData);
	};

	const handleDialogSaveData = () => {
		updateExerciseList(exercise.id, exerciseDataRef.current, selectedMethod);
		setOuterDialogOpen?.(false);
	};

	return (
		<DialogPortal>
			<DialogOverlay className="bg-black/40 backdrop-blur-sm" />
			<DialogContent
				className="max-h-[92dvh] overflow-y-auto rounded-[2rem] border-white/10 bg-black/75 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:max-w-sm"
				onPointerDownOutside={() => {
					removeExercise?.(exercise.id);
					setOuterDialogOpen?.(false);
				}}
				onOpenAutoFocus={event => event.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>
						<div className="mt-6 flex items-center justify-between gap-3 px-1">
							<div className="flex flex-col text-start gap-2">
								<div className="text-3xl font-semibold tracking-tight text-white">
									{exercise.name}	
								</div>
								<div className="text-sm font-medium uppercase tracking-[0.16em] text-white/40">
									{exercise.group}
								</div>
							</div>
							<div className="flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.08] text-white">
								<ExerciseIcon method={exercise.method} color="white" />
							</div>
						</div>
					</DialogTitle>
				</DialogHeader>
				<FieldGroup>
					<div>
						<div className="px-1 py-4 text-sm font-semibold text-white/55">Method</div>
						<div className="grid grid-cols-2 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-1">
							{exerciseMethods.map((method) => {
								const isSelected = selectedMethod === method;

								return (
									<button
										key={method}
										type="button"
										role="radio"
										aria-checked={isSelected}
										onClick={() => setSelectedMethod(method)}
										className={["rounded-[1.25rem] px-3 py-4 text-sm text-white/55 transition active:scale-[0.98]", isSelected ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" : ""].join(" ")}
									>
										<div className="flex justify-center px-2 pb-2"><ExerciseIcon method={method} color="white" /></div>
										{method}
									</button>
								)
							})}
						</div>
					</div>
				</FieldGroup>
				<FieldGroup>
					<div>
						<div className="px-1 py-4 text-sm font-semibold text-white/55">Sets</div>
						<ExerciseCardDialog key={exercise?.id} exercise={exercise} handleUpdateExerciseData={handleUpdateExerciseData} />
					</div>
				</FieldGroup>
				<DialogFooter>
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-1">
							<DialogClose asChild>
								<Button
									className="w-full rounded-3xl border border-red-400/20 bg-red-500/15 py-6 text-red-100 md:py-0"
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
									className="w-full rounded-3xl border border-white/10 bg-white text-black py-6 font-semibold md:py-0"
									onClick={handleDialogSaveData}>
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
