import clientPromise from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

	const today = new Date();
	today.setHours(today.getHours() - 5); // EST timezone
	// const tomorrow = new Date();
	// tomorrow.setDate(10);

	const dayStart = new Date();
	dayStart.setHours(0, 0, 0, 0);

	const dayEnd = new Date();
	dayEnd.setHours(23, 59, 59, 999);

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		const body = await request.json();

		const {type, exerciseList} = body;
		
		let result;

		// update if already exists, create new if doesnt, delete if exerciseList is empty
		if (Object.keys(exerciseList).length !== 0) {
			result = await collection.updateOne(
				{ type: type, date: { $gte: dayStart, $lt: dayEnd } }, // find doc by type and within today's date range
				{ $set: { exerciseList: exerciseList, date: today } }, // update exercise object
				{ upsert: true } // if doc doesn't exist, create new one
			);
		} else {
			result = await collection.deleteOne({
				type: type,
				date: { $gte: dayStart, $lt: dayEnd }
			});
		}

		return NextResponse.json(result, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to write to database", e},
			{status: 500}
		);
	}
}