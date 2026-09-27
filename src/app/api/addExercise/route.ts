import clientPromise from "@/libs/mongodb";
import {getUserSessionFilter, requireUserId} from "@/lib/auth";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const {error, userId} = await requireUserId();
	if (error) return error;

	const today = new Date();

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
				{ _id: ObjectId.createFromHexString(_id), ...getUserSessionFilter(userId) }, // find doc by session id
				{ $set: { userId, exerciseList: exerciseList, date: today } }, // update exercise object
				{ returnDocument: "after" } // return doc after its been updated
			);
		} else {
			const doc = { userId, type, exerciseList, date: today }
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
