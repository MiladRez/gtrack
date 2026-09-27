"use client";

import ExerciseIcon from "@/components/custom/ExerciseIcon";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import {APP_TIME_ZONE} from "@/lib/dates";
import {ExerciseItem, Session} from "@/utils/ExerciseTypes";
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

	const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);

	useEffect(() => {
		async function unwrapParams() {
			const unwrappedParams = await params;
			setSessionID(unwrappedParams.sessionID as string);
		}
		unwrapParams();
	}, [params]);

	useEffectSkipFirstRender(() => {
		const getSessionByID = async () => {
			const response = await fetch(`/api/getSessionByID?id=${encodeURIComponent(sessionID ?? "")}`);

			if (!response.ok) {
				throw new Error("Failed to fetch session");
			}

			const data: Session | null = await response.json();
			if (data) {
				setSession(data);
			}
		};
		if (sessionID) {
			getSessionByID();
		}
	}, [sessionID]);

	useEffect(() => {
		if (session) {
			const sessionDate = new Date(session.date);
			setDateString(`${sessionDate.toLocaleDateString("en-CA", {weekday: "short", timeZone: APP_TIME_ZONE})}, ${sessionDate.toLocaleDateString("en-CA", {month: "short", timeZone: APP_TIME_ZONE})} ${sessionDate.toLocaleDateString("en-CA", {day: "numeric", timeZone: APP_TIME_ZONE})}, ${sessionDate.toLocaleDateString("en-CA", {year: "numeric", timeZone: APP_TIME_ZONE})}`);
			setTimeString(`${sessionDate.toLocaleTimeString("en-CA", {hour12: true, hour: "numeric", minute: "2-digit", timeZone: APP_TIME_ZONE})}`);

			setExerciseList(Object.values(session.exerciseList));
		}
	}, [session]);

	return (
		<div className="max-w-(--breakpoint-md) flex flex-col items-center gap-6 mx-6 pb-6">
			<Link href="/pages/pastSessions" className="absolute top-3 left-5">
				<Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 mt-2 sm:mt-20">
					<ChevronLeft />
				</Button>
			</Link>
			<div className="w-full flex justify-between py-6">
				<div>{session?.type}</div>
				<div>{dateString}</div>
				<div>{timeString}</div>
			</div>
			{exerciseList.map((exercise, index) => (
				<div key={index} className="w-full flex flex-col px-12 border bg-app-primary border-app-primary-border">
					<div className="flex justify-center gap-4 px-4 pt-10">
						{exercise.name}
						<ExerciseIcon method={exercise.method} color="white" />
					</div>
					<Table className="my-8">
						<TableHeader>
							<TableRow style={{backgroundColor: "transparent"}}>
								<TableHead className="text-center">Set #</TableHead>
								<TableHead className="text-center">Weight (lbs)</TableHead>
								<TableHead className="text-center">Reps</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Object.entries(exercise.data ?? {}).map((set, index) => (
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
	);
}
