import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

export async function requireUserId() {
	const {userId} = await auth();

	if (!userId) {
		return {
			error: NextResponse.json({error: "Unauthorized"}, {status: 401}),
			userId: null
		};
	}

	return {error: null, userId};
}

export function getUserSessionFilter(userId: string) {
	return {
		$or: [
			{userId},
			{userId: {$exists: false}}
		]
	};
}
