import clientPromise from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

	const {searchParams} = new URL(request.url);
	const exerciseType = searchParams.get("type");

	if (!exerciseType) {
		return NextResponse.json(
			{error: "Missing type parameter"},
			{status: 400}
		)
	}

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
			type: exerciseType,
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