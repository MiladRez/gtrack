import clientPromise from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

	const {searchParams} = new URL(request.url);
	const exerciseID = searchParams.get("exerciseID");
	const sessionType = searchParams.get("type");

	if (!exerciseID) {
		return NextResponse.json({ error: "Missing exercise ID" }, { status: 400 });
	}

	const id = `exerciseList.${exerciseID}`;

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		//
		// const result = await collection.findOne(
		// 	{ [id]: { $exists: true } }, // find doc by exercise id
		// 	{sort: {date: -1}}, // sort by most recent
		// );

		const result = await collection.find(
			{
				type: sessionType,
				[id]: {$exists: true}
			}) // find doc by exercise id
			.sort({date: -1})
			.limit(1)
			.next();

		if (!result) {
			return NextResponse.json(null, {status: 200});
		}

		return NextResponse.json(result.exerciseList[exerciseID].data, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to write to database", e},
			{status: 500}
		);
	}
}