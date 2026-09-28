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

	const handleSelectDate = (date: Date | undefined) => {
		if (date) {
			setCurrentDate(date);
		}
	};

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
		pushDays: "[&>button]:rounded-full [&>button]:bg-[radial-gradient(circle,#FF6500_0_60%,transparent_61%)] [&>button]:text-white [&>button[data-selected-single=true]]:bg-[radial-gradient(circle,#FF6500_0_55%,rgba(255,255,255,0.9)_56%_60%,transparent_61%)] [&>button[data-selected-single=true]:hover]:bg-[radial-gradient(circle,#FF6500_0_55%,rgba(255,255,255,0.9)_56%_60%,transparent_61%)] [&:hover]:bg-transparent [&]:rounded-full",
		pullDays: "[&>button]:rounded-full [&>button]:bg-[radial-gradient(circle,#03C988_0_60%,transparent_61%)] [&>button]:text-white [&>button[data-selected-single=true]]:bg-[radial-gradient(circle,#03C988_0_55%,rgba(255,255,255,0.9)_56%_60%,transparent_61%)] [&>button[data-selected-single=true]:hover]:bg-[radial-gradient(circle,#03C988_0_55%,rgba(255,255,255,0.9)_56%_60%,transparent_61%)] [&:hover]:bg-transparent [&]:rounded-full",
		legDays: "[&>button]:rounded-full [&>button]:bg-[radial-gradient(circle,#1C82AD_0_60%,transparent_61%)] [&>button]:text-white [&>button[data-selected-single=true]]:bg-[radial-gradient(circle,#1C82AD_0_55%,rgba(255,255,255,0.9)_56%_60%,transparent_61%)] [&>button[data-selected-single=true]:hover]:bg-[radial-gradient(circle,#1C82AD_0_55%,rgba(255,255,255,0.9)_56%_60%,transparent_61%)] [&:hover]:bg-transparent [&]:rounded-full",
	}

	const SelectedSession = ({session}: {session: SessionSummary}) => {

		const {_id, type, date, exerciseCount} = session;

		const dateString = `${date.toLocaleDateString("en-CA", {weekday: "short", timeZone: APP_TIME_ZONE})}, ${date.toLocaleDateString("en-CA", {month: "short", timeZone: APP_TIME_ZONE})} ${date.toLocaleDateString("en-CA", {day: "numeric", timeZone: APP_TIME_ZONE})}, ${date.toLocaleDateString("en-CA", {year: "numeric", timeZone: APP_TIME_ZONE})}`
		const timeString = `${date.toLocaleTimeString("en-CA", {hour12: true, hour: "numeric", minute: "2-digit", timeZone: APP_TIME_ZONE})}`

		const SessionAccent = () => {
			switch (type) {
				case "Push":
					return "from-orange-400 to-red-500"
				case "Pull":
					return "from-emerald-400 to-teal-500"
				case "Legs":
					return "from-sky-400 to-blue-500"
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
				<div className="glass-panel flex rounded-[1.5rem] px-4 py-4 transition active:bg-white/[0.11]">
					<div className="flex w-full items-center gap-3">
						<div className={`h-12 w-2 rounded-full bg-gradient-to-b ${SessionAccent()}`} />
						<div className="flex flex-col">
							<h2 className="text-xl font-semibold tracking-tight text-white">{type}</h2>
							<p className="text-sm text-white/45">
							{exerciseCount} exercise(s)
							</p>
						</div>
					</div>
					<div className="flex flex-col items-end">
						<p className="whitespace-nowrap text-sm text-white/85">
							{dateString}
						</p>
						<p className="text-xs uppercase tracking-[0.12em] text-white/40">
							{timeString}
						</p>
					</div>
				</div>
			</Link>
		)
	}

	return (
		<div className="page-shell flex justify-center">
			<div className="flex w-full max-w-(--breakpoint-md) flex-col items-center gap-8 pt-1 [--calendar-cell-size:3.2rem] [--history-panel-width:calc((var(--calendar-cell-size)*7)+1.5rem)]">
				<Link href="/" className="self-start">
					<Button variant="outline" size="icon" className="glass-control size-11 rounded-full border-white/10 bg-black/30">
						<ChevronLeft />
					</Button>
				</Link>
				<div className="w-full">
					<p className="text-sm font-medium uppercase tracking-[0.16em] text-white/40">History</p>
					<h2 className="mt-2 text-5xl font-semibold tracking-tight text-white">Past Sessions</h2>
				</div>
				<div className="mt-8 flex flex-col items-center gap-2">
					<Calendar
						mode="single"
						selected={currentDate}
						onSelect={handleSelectDate}
						modifiers={modifiers}
						modifiersClassNames={modifiersClassNames}
						className="rounded-2xl border border-white/10 bg-white/[0.07] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl [--cell-size:var(--calendar-cell-size)]"
					/>
					<div className="w-full flex flex-col gap-2">
						{selectedDaySessions.map((session, index) => (
							<div key={index}>
								<SelectedSession session={session} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
