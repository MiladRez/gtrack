'use client'

import {Button} from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table"
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {Exercise, Session} from "@/utils/ExerciseTypes";
import axios from "axios";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

export default function SessionDetails() {

	const params = useParams(); // params is a promise

	const [sessionID, setSessionID] = useState<string | null>(null);
	const [session, setSession] = useState<Session>();

	const [dateString, setDateString] = useState<string>("");
	const [timeString, setTimeString] = useState<string>("");

	const [exerciseList, setExerciseList] = useState<(Exercise)[]>([]);

	useEffect(() => {
		async function unwrapParams() {
			const unwrappedParams = await params;
			setSessionID(unwrappedParams.sessionID as string);
		}
		unwrapParams();
	}, [params]);

	useEffectSkipFirstRender(() => {
		const getSessionByID = async () => {
			try {
				const response = await axios.get("/api/getSessionByID", {
					params: { id: sessionID }
				});

				const data = await response.data;
				if (data) {
					setSession(data);
				}
			} catch (error) {
				console.error("Error fetching today's session: ", error);
			}
		};
		if (sessionID) {
			getSessionByID();
		}
	}, [sessionID]);

	useEffect(() => {
		if (session) {
			const sessionDate = new Date(session.date)
			setDateString(`${sessionDate.toLocaleDateString("en-CA", {weekday: "short"})}, ${sessionDate.toLocaleDateString("en-CA", {month: "short"})} ${sessionDate.getDate()}, ${sessionDate.getFullYear()}`);
			setTimeString(`${sessionDate.toLocaleTimeString("en-CA", {hour12: true, hour: "numeric", minute: "2-digit"})}`);

			setExerciseList(Object.values(session.exerciseList));
		}
	}, [session]);

	console.log(exerciseList)

	return (
		<div className="max-w-screen-md flex flex-col items-center gap-12 mx-4">
			<Link href="/pastSessions" className="self-start">
				<Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 mt-2 sm:mt-20">
					<ChevronLeft />
				</Button>
			</Link>
			<div className="w-full flex justify-between px-2 py-6">
				<div>
					{session?.type}
				</div>
				<div>
					{dateString}
				</div>
				<div>
					{timeString}
				</div>
			</div>
			{exerciseList.map((exercise, index) => (
				<div key={index} className="w-full mx-6">
					<div className="flex justify-center px-4 py-6">
						{exercise.name}
					</div>
					<Table>
						<TableHeader>
							<TableRow style={{backgroundColor: "transparent"}}>
								<TableHead className="text-center">Set #</TableHead>
								<TableHead className="text-center">Weight (lbs)</TableHead>
								<TableHead className="text-center">Reps</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Object.entries(exercise.data).map((set, index) => (
								<TableRow key={index}>
									<TableCell className="text-center">{index + 1}</TableCell>
									<TableCell className="text-center">{set[1].weight}</TableCell>
									<TableCell className="text-center">{set[1].reps}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			))}
		</div>
	)
}