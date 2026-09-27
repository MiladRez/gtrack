import clientPromise from "@/libs/mongodb";
import {getUserSessionFilter, requireUserId} from "@/lib/auth";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const {error, userId} = await requireUserId();
	if (error) return error;

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		const body = await request.json();

		const {_id} = body;
		
		const result = await collection.findOneAndDelete(
			{
				_id: ObjectId.createFromHexString(_id),
				...getUserSessionFilter(userId)
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
