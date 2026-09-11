import clientPromise from "@/libs/mongodb";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		const body = await request.json();

		const {_id} = body;
		
		const result = await collection.findOneAndDelete(
			{
				_id: ObjectId.createFromHexString(_id), 
			}
		);

		if (!result) {
			return NextResponse.json(
				{error: "Session not found"},
				{status: 404}
			);
		}

		return NextResponse.json(result, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to delete from database", e},
			{status: 500}
		);
	}
}