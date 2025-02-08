import clientPromise from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function GET() {

	const today = new Date();

	const dayStart = new Date();
	dayStart.setHours(0, 0, 0, 0);

	const dayEnd = new Date();
	dayEnd.setHours(23, 59, 59, 999);

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
			{error: "Failed to fetch data from database"},
			{status: 500}
		);
	}		
}