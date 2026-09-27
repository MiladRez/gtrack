import clientPromise from "@/libs/mongodb";
import {getUserSessionFilter, requireUserId} from "@/lib/auth";
import {NextResponse} from "next/server";

export async function GET() {
	const {error, userId} = await requireUserId();
	if (error) return error;

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions")

		const data = await collection.aggregate([
			{$match: getUserSessionFilter(userId)},
			{$sort: {date: -1}},
			{
				$project: {
					type: 1,
					date: 1,
					exerciseCount: {
						$size: {
							$objectToArray: {$ifNull: ["$exerciseList", {}]}
						}
					}
				}
			}
		]).toArray();

		return NextResponse.json(data, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to fetch data from database", e},
			{status: 500}
		);
	}		
}
