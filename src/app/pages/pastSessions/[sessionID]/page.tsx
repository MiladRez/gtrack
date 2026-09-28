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
		<div className="page-shell mx-auto flex max-w-(--breakpoint-md) flex-col gap-6 pt-1">
			<Link href="/pages/pastSessions" className="self-start">
				<Button variant="outline" size="icon" className="glass-control size-11 rounded-full border-white/10 bg-black/30">
					<ChevronLeft />
				</Button>
			</Link>
			<div className="glass-panel flex w-full flex-col gap-2 rounded-[2rem] p-5">
				<p className="text-sm font-medium uppercase tracking-[0.16em] text-white/40">{session?.type}</p>
				<div className="flex items-end justify-between gap-4">
					<div className="text-3xl font-semibold tracking-tight text-white">{dateString}</div>
					<div className="whitespace-nowrap text-sm uppercase tracking-[0.12em] text-white/45">{timeString}</div>
				</div>
			</div>
			{exerciseList.map((exercise, index) => (
				<div key={index} className="glass-panel flex w-full flex-col rounded-[1.75rem] px-4">
					<div className="flex justify-center gap-4 px-4 pt-8 text-lg font-semibold tracking-tight text-white">
						{exercise.name}
						<ExerciseIcon method={exercise.method} color="white" />
					</div>
					<Table className="my-6 overflow-hidden rounded-2xl">
						<TableHeader>
							<TableRow className="border-white/10 bg-white/[0.04]">
								<TableHead className="text-center text-white/45">Set #</TableHead>
								<TableHead className="text-center text-white/45">Weight (lbs)</TableHead>
								<TableHead className="text-center text-white/45">Reps</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Object.entries(exercise.data ?? {}).map((set, index) => (
								<TableRow key={index} className="border-white/10">
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
