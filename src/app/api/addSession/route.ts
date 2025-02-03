import clientPromise from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions");

		const body = await request.json();
		const result = await collection.insertOne(body);

		return NextResponse.json(result, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to write to database"},
			{status: 500}
		);
	}
}