import clientPromise from "@/libs/mongodb";
import {getUserSessionFilter, requireUserId} from "@/lib/auth";
import {getTodayBounds} from "@/lib/dates";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const {error, userId} = await requireUserId();
	if (error) return error;

	const {searchParams} = new URL(request.url);
	const exerciseType = searchParams.get("type");

	if (!exerciseType) {
		return NextResponse.json(
			{error: "Missing type parameter"},
			{status: 400}
		)
	}

	const {start: dayStart, end: dayEnd} = getTodayBounds();

	try {
		const client = await clientPromise;
		const db = client.db("gtrack");
		const collection = db.collection("sessions")

		const data = await collection.findOne({
			...getUserSessionFilter(userId),
			type: exerciseType,
			date: {$gte: dayStart, $lt: dayEnd}
		});

		if (!data) {
			return NextResponse.json(null, {status: 200});
		}

		const exerciseEntries = Object.entries(data.exerciseList ?? {});
		const previousExerciseData: Record<string, unknown> = {};
		const missingExerciseIds = new Set(exerciseEntries.map(([exerciseId]) => exerciseId));

		if (missingExerciseIds.size > 0) {
			const previousSessions = await collection.find(
				{
					...getUserSessionFilter(userId),
					_id: {$ne: data._id},
					type: exerciseType,
					date: {$lt: data.date}
				},
				{projection: {exerciseList: 1, date: 1}}
			)
				.sort({date: -1})
				.limit(50)
				.toArray();

			for (const session of previousSessions) {
				for (const exerciseId of missingExerciseIds) {
					const exercise = session.exerciseList?.[exerciseId];

					if (exercise?.data) {
						previousExerciseData[exerciseId] = exercise.data;
						missingExerciseIds.delete(exerciseId);
					}
				}

				if (missingExerciseIds.size === 0) break;
			}
		}

		return NextResponse.json({...data, previousExerciseData}, {status: 200});
	} catch (e) {
		return NextResponse.json(
			{error: "Failed to fetch data from database", e},
			{status: 500}
		);
	}		
}
