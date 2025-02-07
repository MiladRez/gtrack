import clientPromise from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		const body = await request.json();

		const {type, exerciseList } = body;

		const result = await collection.updateOne(
			{ type: type }, // find doc by type
			{ $set: { exerciseList: exerciseList } }, // update exercise object
			{ upsert: true } // if doc doesn't exist, create new one
		);

		return NextResponse.json(result, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to write to database"},
			{status: 500}
		);
	}
}