import {Exercise} from "@/utils/ExerciseTypes"

export default function SessionTable({session}: {session: {_id: string, type: string, date: Date, exerciseList: Map<string, Exercise>}}) {

	const exerciseList = new Map<string, Exercise>(Object.entries(session.exerciseList));
	
	const exercisesData = [];

	for (const exercise of exerciseList.values()) {
		const exerciseData = []
		exerciseData[0] = exercise.name;
		exerciseData[1] = exercise.data.set1.weight;
		exerciseData[2] = exercise.data.set1.reps;
		exerciseData[3] = exercise.data.set2.weight;
		exerciseData[4] = exercise.data.set2.reps;
		exerciseData[5] = exercise.data.set3.weight;
		exerciseData[6] = exercise.data.set3.reps;
		exercisesData.push(exerciseData);
	}

	return (
		<div>
			<div className="flex justify-between">
				<h1>Push</h1>	
				<p>Thu Feb 13 2025</p>
			</div>
			
			<div className="">
				<div className="grid grid-cols-7">
					<header className="border row-span-2 flex justify-center items-center">
						Exercise
					</header>
					<header className="border col-span-2 flex justify-center">
						Set 1
					</header>
					<header className="border col-span-2 flex justify-center">
						Set 2
					</header>
					<header className="border col-span-2 flex justify-center">
						Set 3
					</header>	
					<header className="border flex justify-center">
						Weight
					</header>	
					<header className="border flex justify-center">
						Reps
					</header>	
					<header className="border flex justify-center">
						Weight
					</header>	
					<header className="border flex justify-center">
						Reps
					</header>	
					<header className="border flex justify-center">
						Weight
					</header>	
					<header className="border flex justify-center">
						Reps
					</header>								
				</div>
				{exercisesData.map((exercise, index) => {
					return (
						<div key={index} className="grid grid-cols-7">
							<div className="border flex justify-center items-center text-center">
								{exercise[0]}
							</div>
							{exercise.slice(1).map((data, index) => {
								return (
									<div key={index} className="border flex justify-center items-center">
										{data}
									</div>
								)
							})}
						</div>
					)
				})}
			</div>	
		</div>
	)
}