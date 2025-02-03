import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
	{
		type: String,
		exercisesList: [
			{
				exercise: String,
				rep1: Number,
				rep2: Number,
				rep3: Number
			}
		]
	}
);

const Session = mongoose.models.Session || mongoose.model( "Session", sessionSchema );

export default Session;