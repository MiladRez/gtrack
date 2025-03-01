import clientPromise from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions")

		const data = await collection.find({}).toArray();

		return NextResponse.json(data, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to fetch data from database", e},
			{status: 500}
		);
	}		
}