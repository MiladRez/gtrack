'use client';

import SessionTable from "@/components/custom/SessionTable";
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
import {Exercise} from "@/utils/ExerciseTypes";
import axios from "axios";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function PastSessions() {

	const [sessions, setSessions] = useState<{_id: string, type: string, date: Date, exerciseList: Exercise}[]>([]);

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
		sessions.map((session) => {
			const exerciseListMap = new Map(Object.entries(session.exerciseList));
			for (const value of exerciseListMap.values()) {
				console.log(value.data)
			}
		})
	}, [sessions]);

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
				<div className="w-full">
					{sessions.map((session, index) => (
						<SessionTable key={index} session={session} />	
					))}
				</div>	
			</div>
		</div>
	)
}