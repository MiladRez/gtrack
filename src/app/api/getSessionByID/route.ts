import clientPromise from "@/libs/mongodb";
import {getUserSessionFilter, requireUserId} from "@/lib/auth";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const {error, userId} = await requireUserId();
	if (error) return error;

	const {searchParams} = new URL(request.url);
	const sessionID = searchParams.get("id");

	if (!sessionID) {
		return NextResponse.json(
			{error: "Missing id parameter"},
			{status: 400}
		)
	}

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions")

		const data = await collection.findOne({
			_id: new ObjectId(sessionID),
			...getUserSessionFilter(userId)
		});

		return NextResponse.json(data, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to fetch data from database", e},
			{status: 500}
		);
	}		
}
