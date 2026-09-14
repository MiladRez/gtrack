import clientPromise from "@/libs/mongodb";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

	const {searchParams} = new URL(request.url);
	const sessionID = searchParams.get("sessionID");
	const exerciseID = searchParams.get("exerciseID");
	const exerciseGroup = searchParams.get("group");

	if (!exerciseID) {
		return NextResponse.json({ error: "Missing exercise ID" }, { status: 400 });
	}

	if (!sessionID) {
		return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
	}

	const id = `exerciseList.${exerciseID}`;
	const group = `exerciseList.${exerciseID}.group`;
	const currentSessionID = ObjectId.createFromHexString(sessionID);

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		const result = await collection.find(
			{
				_id: { $ne: currentSessionID}, // result should not be from current session
				[group]: exerciseGroup, // type should be session type : Push/Pull/Legs
				[id]: {$exists: true} // exercise exists in session
			})
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