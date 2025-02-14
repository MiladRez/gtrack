'use client';

import SessionTable from "@/components/custom/SessionTable";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Exercise} from "@/utils/ExerciseTypes";
import axios from "axios";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function PastSessions() {

	const [sessions, setSessions] = useState<{_id: string, type: string, date: Date, exerciseList: Map<string, Exercise>}[]>([]);
	
	const [pushSessions, setPushSessions] = useState<{_id: string, type: string, date: Date, exerciseList: Map<string, Exercise>}[]>([]);
	const [pullSessions, setPullSessions] = useState<{_id: string, type: string, date: Date, exerciseList: Map<string, Exercise>}[]>([]);
	const [legSessions, setLegSessions] = useState<{_id: string, type: string, date: Date, exerciseList: Map<string, Exercise>}[]>([]);

	const [pushSessionDates, setPushSessionDates] = useState<Date[]>([]);
	const [pullSessionDates, setPullSessionDates] = useState<Date[]>([]);
	const [legSessionDates, setLegSessionDates] = useState<Date[]>([]);
	
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

	console.log(pullSessionDates)

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
		}
	}

	return (
		<div className="w-screen flex justify-center">
			<div className="max-w-screen-md w-full flex flex-col items-center gap-12 mx-4">
				<Link href="/" className="self-start">
					<Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 sm:mt-20">
						<ChevronLeft />
					</Button>
				</Link>
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Past Sessions
				</h2>
				<div className="w-fit mt-20">
					<Calendar mode="single" selected={date} onSelect={setDate} modifiers={modifiers} modifiersStyles={modifiersStyles} className="scale-150 rounded-md border shadow" />
				</div>	
			</div>
		</div>
	)
}