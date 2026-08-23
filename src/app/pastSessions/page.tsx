'use client';

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Exercise, Session} from "@/utils/ExerciseTypes";
import axios from "axios";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import "../../styles/calendar.css"
import {ModifiersClassNames} from "react-day-picker";
import {isToday} from "date-fns";

export default function PastSessions() {

	const [sessions, setSessions] = useState<Session[]>([]);
	
	const [pushSessions, setPushSessions] = useState<Session[]>([]);
	const [pullSessions, setPullSessions] = useState<Session[]>([]);
	const [legSessions, setLegSessions] = useState<Session[]>([]);

	const [pushSessionDates, setPushSessionDates] = useState<Date[]>([]);
	const [pullSessionDates, setPullSessionDates] = useState<Date[]>([]);
	const [legSessionDates, setLegSessionDates] = useState<Date[]>([]);

	const [selectedDaySession, setSelectedDaySession] = useState<Session>();
	
	const [todayDate, setTodayDate] = useState<Date | undefined>(new Date());

	useEffect(() => {
		const getSessions = async () => {
			try {
				const response = await axios.get("/api/getSessions");

				const data = await response.data;
				if (data) {
					setSessions(data);
				}
			} catch (error) {
				console.error("Error fetching today's session: ", error);
			}
		};
		getSessions();
	}, []);

	useEffect(() => {
		setPushSessions(sessions.filter(session => session.type === "Push"));
		const sessionsList = [
			sessions.filter(session => session.type === "Push"),
			sessions.filter(session => session.type === "Pull"),
			sessions.filter(session => session.type === "Legs")
		]

		console.log(sessionsList)
		
		for (const s of sessionsList) {
			s.map((session) => {
				const date = new Date(session.date);
				date.setHours(date.getHours() + 4);
			})
		}
		setPullSessions(sessions.filter(session => session.type === "Pull"));
		setLegSessions(sessions.filter(session => session.type === "Legs"));
	}, [sessions]);

	useEffect(() => {
		const dates: Date[] = [];
		pushSessions.map((session) => {
			const date = new Date(session.date);
			date.setHours(date.getHours()+4) // timezone diff
			dates.push(date);
		});
		setPushSessionDates(dates);
	}, [pushSessions]);

	useEffect(() => {
		const dates: Date[] = [];
		pullSessions.map((session) => {
			const date = new Date(session.date);
			date.setHours(date.getHours()+4) // timezone diff
			dates.push(date);
		});
		setPullSessionDates(dates);
	}, [pullSessions]);

	useEffect(() => {
		const dates: Date[] = [];
		legSessions.map((session) => {
			const date = new Date(session.date);
			date.setHours(date.getHours()+4) // timezone diff
			dates.push(date);
		});
		setLegSessionDates(dates);
	}, [legSessions]);

	useEffect(() => {
		const todaysSession = sessions.filter(session => {
			const sessionDate = new Date(session.date);
			sessionDate.setHours(sessionDate.getHours()+4)
			return (
				sessionDate.getFullYear() === todayDate?.getFullYear() &&
				sessionDate.getMonth() === todayDate.getMonth() &&
				sessionDate.getDate() === todayDate.getDate()
			);
		});

		console.log("I run")
		

		if (todaysSession.length > 0) {
			console.log("I run too?")
			const exerciseListMap = new Map<string, Exercise>(Object.entries(todaysSession[0].exerciseList));
			const sessionDateFormat = new Date(todaysSession[0].date);
			sessionDateFormat.setHours(sessionDateFormat.getHours()+4)

			const sessionFormatted = {
				_id: todaysSession[0]._id,
				type: todaysSession[0].type,
				date: sessionDateFormat,
				exerciseList: exerciseListMap
			}

			setSelectedDaySession(sessionFormatted);
		} else {
			setSelectedDaySession(todaysSession[0]);
		}
	}, [todayDate]);

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

	const SelectedSession = ({session}: {session: Session}) => {

		const {_id, type, date, exerciseList} = session;

		const dateString = `${date.toLocaleDateString("en-CA", {weekday: "short"})}, ${date.toLocaleDateString("en-CA", {month: "short"})} ${date.getDate()}, ${date.getFullYear()}`
		const timeString = `${date.toLocaleTimeString("en-CA", {hour12: true, hour: "numeric", minute: "2-digit"})}`

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

		console.log(date)
		
		let linkHref = `/pastSessions/${_id}`
		if (date.getFullYear() === todayDate?.getFullYear() &&
			date.getMonth() === todayDate.getMonth() &&
			date.getDate() === todayDate.getDate()) {
			linkHref = `/${type.toLowerCase()}`
		}

		return (
			<Link href={linkHref} >
				<div className={`absolute w-full flex text-sm mt-4 sm:mt-16 rounded-md py-3 px-4 ${SessionCardBackgroundColor()}`}>
					<div className="w-full flex flex-col">
						<h2>{type}</h2>
						<p className="text-[0.7rem] sm:text-xs italic text-gray-700">
							{exerciseList.size} exercise(s)
						</p>
					</div>
					<div className="flex flex-col items-end">
						<p className="text-xs whitespace-nowrap">
							{dateString}
						</p>
						<p className="text-[0.7rem] sm:text-xs uppercase">
							{timeString}
						</p>
					</div>
				</div>
			</Link>
		)
	}

	return (
		<div className="w-screen flex justify-center">
			<div className="max-w-(--breakpoint-md) w-full flex flex-col items-center gap-12 mx-4">
				<Link href="/" className="self-start">
					<Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 mt-2 sm:mt-20">
						<ChevronLeft />
					</Button>
				</Link>
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Past Sessions
				</h2>
				<div className="scale-150 mt-16 sm:mt-40">
					<Calendar
						mode="single"
						selected={todayDate}
						onSelect={setTodayDate}
						modifiers={modifiers}
						// modifiersStyles={modifiersStyles}
						modifiersClassNames={modifiersClassNames}
						className="rounded-md border border-app-primary-border bg-app-primary"
					/>	
					{selectedDaySession ? 
						<SelectedSession session={selectedDaySession} />
						:
						null
					}
				</div>
			</div>
		</div>
	)
}