'use client';

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {APP_TIME_ZONE, dateKeyToLocalDate, getDateKey} from "@/lib/dates";
import {SessionSummary} from "@/utils/ExerciseTypes";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import "../../../styles/calendar.css"
import {ModifiersClassNames} from "react-day-picker";
import {useQuery} from "@tanstack/react-query";

export default function PastSessions() {

	const [sessions, setSessions] = useState<SessionSummary[]>([]);

	const [pushSessionDates, setPushSessionDates] = useState<Date[]>([]);
	const [pullSessionDates, setPullSessionDates] = useState<Date[]>([]);
	const [legSessionDates, setLegSessionDates] = useState<Date[]>([]);

	const [selectedDaySessions, setSelectedDaySessions] = useState<SessionSummary[]>([]);
	
	const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());

	// data is cached sessions
	const {data, isLoading} = useQuery({
		queryKey: ["sessions"],
		queryFn: async () => {
			const response = await fetch("/api/getSessions");

			if (!response.ok) {
				throw new Error("Failed to fetch sessions");
			}

			return response.json() as Promise<SessionSummary[]>;
		},
		staleTime: 10_000
	});

	useEffect(() => {
		if (!isLoading && data) {
			setSessions(data)
		}
	}, [data, isLoading]);

	useEffect(() => {
		const sessionsList = [
			sessions.filter(session => session.type === "Push"),
			sessions.filter(session => session.type === "Pull"),
			sessions.filter(session => session.type === "Legs")
		]

		const sessionsDates: Map<string, Date[]> = new Map();

		for (const s in sessionsList) {
			const dates: Date[] = [];
			sessionsList[s].map((session) => {
				dates.push(dateKeyToLocalDate(getDateKey(session.date)))
			});

			if (sessionsList[s].length > 0) {
				sessionsDates.set(sessionsList[s][0].type, dates)
			}	
		}
		
		setPushSessionDates(sessionsDates.get("Push") ?? [])
		setPullSessionDates(sessionsDates.get("Pull") ?? [])
		setLegSessionDates(sessionsDates.get("Legs") ?? [])

	}, [sessions]);

	useEffect(() => {
		const selectedDateKey = currentDate ? getDateKey(currentDate) : "";
		const todaysSessions = sessions.filter(session => {
			return getDateKey(session.date) === selectedDateKey;
		});		

		if (todaysSessions.length > 0) {

			const formattedTodaySessions = todaysSessions.map(session => {
				const sessionDateFormat = new Date(session.date);
				sessionDateFormat.setHours(sessionDateFormat.getHours() + 4)

				return {
					...session,
					date: sessionDateFormat,
				}				
			});
			setSelectedDaySessions(formattedTodaySessions as SessionSummary[]);
		} else {
			setSelectedDaySessions([]);
		}
	}, [currentDate, sessions]);

	// Define modifiers: changes the colour of the calendar days to the respective exercise day
	// Push: Orange
	// Pull: Green
	// Legs: Blue
	const modifiers = {
		pushDays: pushSessionDates,
		pullDays: pullSessionDates,
		legDays: legSessionDates
	}

	// Define custom styles for each day
	const modifiersClassNames: ModifiersClassNames = {
		pushDays: "[&>button]:rounded-full text-primary [&>button]:bg-[radial-gradient(circle,#FF6500_60%,transparent_100%)] [&>button:hover]:text-primary-foreground [&:hover]:bg-transparent [&]:rounded-full",
		pullDays: "[&>button]:rounded-full text-primary [&>button]:bg-[radial-gradient(circle,#03C988_60%,transparent_100%)] [&>button:hover]:text-primary-foreground [&:hover]:bg-transparent [&]:rounded-full",
		legDays: "[&>button]:rounded-full text-primary [&>button]:bg-[radial-gradient(circle,#1C82AD_60%,transparent_100%)] [&>button:hover]:text-primary-foreground [&:hover]:bg-transparent [&]:rounded-full",
	}

	const SelectedSession = ({session}: {session: SessionSummary}) => {

		const {_id, type, date, exerciseCount} = session;

		const dateString = `${date.toLocaleDateString("en-CA", {weekday: "short", timeZone: APP_TIME_ZONE})}, ${date.toLocaleDateString("en-CA", {month: "short", timeZone: APP_TIME_ZONE})} ${date.toLocaleDateString("en-CA", {day: "numeric", timeZone: APP_TIME_ZONE})}, ${date.toLocaleDateString("en-CA", {year: "numeric", timeZone: APP_TIME_ZONE})}`
		const timeString = `${date.toLocaleTimeString("en-CA", {hour12: true, hour: "numeric", minute: "2-digit", timeZone: APP_TIME_ZONE})}`

		const SessionCardBackgroundColor = () => {
			switch (type) {
				case "Push":
					return "bg-[#FF6500]"
				case "Pull":
					return "bg-[#03C988]"
				case "Legs":
					return "bg-[#1C82AD]"
				default:
					return ""
			}
		}
		
		let linkHref = `/pages/pastSessions/${_id}`
		if (getDateKey(date) === getDateKey(new Date())) {
			linkHref = `/pages/${type.toLowerCase()}`
		}

		return (
			<Link href={linkHref} >
				<div className={`flex rounded-md sm:mt-16 py-3 px-4 ${SessionCardBackgroundColor()}`}>
					<div className="w-full flex flex-col">
						<h2 className="text-xl">{type}</h2>
						<p className="sm:text-xs italic text-gray-700">
							{exerciseCount} exercise(s)
						</p>
					</div>
					<div className="flex flex-col items-end">
						<p className="whitespace-nowrap">
							{dateString}
						</p>
						<p className="sm:text-xs uppercase">
							{timeString}
						</p>
					</div>
				</div>
			</Link>
		)
	}

	return (
		<div className="w-full flex justify-center">
			<div className="max-w-(--breakpoint-md) w-full flex flex-col items-center gap-12 mx-4">
				<Link href="/" className="self-start">
					<Button variant="outline" size="icon" className="absolute bg-slate-900 border-slate-700 top-5 left-5 sm:mt-20">
						<ChevronLeft />
					</Button>
				</Link>
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Past Sessions
				</h2>
				<div className="flex flex-col gap-2 scale-150 mt-16 sm:mt-40">
					<Calendar
						mode="single"
						selected={currentDate}
						onSelect={setCurrentDate}
						modifiers={modifiers}
						modifiersClassNames={modifiersClassNames}
						className="rounded-md border border-app-primary-border bg-app-primary"
					/>	
				</div>
				<div className="w-full mt-12 flex flex-col gap-4">
					{selectedDaySessions.map((session, index) => (
						<div key={index}>
							<SelectedSession session={session} />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
