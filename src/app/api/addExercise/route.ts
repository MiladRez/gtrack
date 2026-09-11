import clientPromise from "@/libs/mongodb";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

	const timezoneDiff = 4 // server JS always uses UTC date for some reason, client JS uses browser which is client's timezone

	const today = new Date();
	today.setHours(today.getHours() - timezoneDiff); // EST timezone
	// const tomorrow = new Date();
	// tomorrow.setDate(10);

	// const dayStart = new Date();
	// dayStart.setHours(0 - timezoneDiff, 0, 0, 0);

	// const dayEnd = new Date();
	// dayEnd.setHours(23 - timezoneDiff, 59, 59, 999);

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		const body = await request.json();

		const {_id, type, exerciseList} = body;
		
		let result;

		// update if already exists, create new if doesnt
		if (_id !== "") {
			result = await collection.findOneAndUpdate(
				{ _id: ObjectId.createFromHexString(_id) }, // find doc by session id
				{ $set: { exerciseList: exerciseList, date: today } }, // update exercise object
				{ returnDocument: "after" } // return doc after its been updated
			);
		} else {
			const doc = { type, exerciseList, date: today }
			const newSession = await collection.insertOne(doc);
			result = { _id: newSession.insertedId, ...doc }
		}

		return NextResponse.json(result, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to write to database", e},
			{status: 500}
		);
	}
}