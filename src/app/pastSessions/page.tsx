'use client';

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Exercise, Session} from "@/utils/ExerciseTypes";
import axios from "axios";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import "../../styles/calendar.css"

export default function PastSessions() {

	const [sessions, setSessions] = useState<Session[]>([]);
	
	const [pushSessions, setPushSessions] = useState<Session[]>([]);
	const [pullSessions, setPullSessions] = useState<Session[]>([]);
	const [legSessions, setLegSessions] = useState<Session[]>([]);

	const [pushSessionDates, setPushSessionDates] = useState<Date[]>([]);
	const [pullSessionDates, setPullSessionDates] = useState<Date[]>([]);
	const [legSessionDates, setLegSessionDates] = useState<Date[]>([]);

	const [selectedDaySession, setSelectedDaySession] = useState<Session>();
	
	const [date, setDate] = useState<Date | undefined>(new Date());

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
		setPullSessions(sessions.filter(session => session.type === "Pull"));
		setLegSessions(sessions.filter(session => session.type === "Legs"));
	}, [sessions]);

	useEffect(() => {
		const dates: Date[] = [];
		pushSessions.map((session) => {
			const date = new Date(session.date);
			dates.push(date);
		});
		setPushSessionDates(dates);
	}, [pushSessions]);

	useEffect(() => {
		const dates: Date[] = [];
		pullSessions.map((session) => {
			const date = new Date(session.date);
			dates.push(date);
		});
		setPullSessionDates(dates);
	}, [pullSessions]);

	useEffect(() => {
		const dates: Date[] = [];
		legSessions.map((session) => {
			const date = new Date(session.date);
			dates.push(date);
		});
		setLegSessionDates(dates);
	}, [legSessions]);

	useEffect(() => {
		const todaysSession = sessions.filter(session => {
			const sessionDate = new Date(session.date);

			return (
				sessionDate.getFullYear() === date?.getFullYear() &&
				sessionDate.getMonth() === date.getMonth() &&
				sessionDate.getDate() === date.getDate()
			);
		});

		if (todaysSession.length > 0) {
			const exerciseListMap = new Map<string, Exercise>(Object.entries(todaysSession[0].exerciseList));
			const sessionDateFormat = new Date(todaysSession[0].date);

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
	}, [date, sessions]);

	// Define modifiers
	const modifiers = {
		pushDays: pushSessionDates,
		pullDays: pullSessionDates,
		legDays: legSessionDates
	}

	// Define custom styles for each day
	const modifiersStyles = {
		pushDays: {
			borderRadius: "50%",
			background: "radial-gradient(circle, #FF6500 50%, transparent 50%)",
		},

		pullDays: {
			borderRadius: "50%",
			background: "radial-gradient(circle, #03C988 50%, transparent 50%)",
		},

		legDays: {
			borderRadius: "50%",
			background: "radial-gradient(circle, #1C82AD 50%, transparent 50%)"
		},

		selected: {
			border: "1px solid white",
			transition: "none"
		},

		today: {
			backgroundColor: "#ffffff",
			color: "#000000"
		}
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

		return (
			<Link href={`/pastSessions/${_id}`} >
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
			<div className="max-w-screen-md w-full flex flex-col items-center gap-12 mx-4">
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
						selected={date}
						onSelect={setDate}
						modifiers={modifiers}
						modifiersStyles={modifiersStyles}
						className="rounded-md border border-slate-700 bg-slate-950"
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