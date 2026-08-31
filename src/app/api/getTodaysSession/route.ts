import clientPromise from "@/libs/mongodb";
import {time} from "console";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

	// const today = new Date();
	// console.log(today)
	// today.setHours(today.getHours() - 4); // EST timezone

	const timeDiff = 4;

	const dayStart = new Date();
	dayStart.setHours(0 - timeDiff, 0, 0, 0);

	const dayEnd = new Date();
	dayEnd.setHours(23 - timeDiff, 59, 59, 999);

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions")

		const data = await collection.findOne({
			date: {$gte: dayStart, $lt: dayEnd}
		});

		return NextResponse.json(data, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to fetch data from database", e},
			{status: 500}
		);
	}		
}