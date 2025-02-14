import {Exercise, ExerciseData} from "@/utils/ExerciseTypes"

export default function SessionTable({session}: {session: {_id: string, type: string, date: Date, exerciseList: Exercise}}) {

	const exerciseList = new Map(Object.entries(session.exerciseList));
	
	let exercisesData = [];

	for (const exercise of exerciseList.values()) {
		// let exerciseData = []
		// exerciseData[0] = exercise.name;
		// exerciseData[1] = exercise.data.set1.weight;
		// exerciseData[2] = exercise.data.set1.reps;
		// exerciseData[3] = exercise.data.set2.weight;
		// exerciseData[4] = exercise.data.set2.reps;
		// exerciseData[5] = exercise.data.set3.weight;
		// exerciseData[6] = exercise.data.set3.reps;
		// exercisesData.push(exerciseData);
		console.log(exerciseList)
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
				<div className="grid grid-cols-7">
					{exercisesData.map((exercise, index) => {
						return (
							<div key={index}>
								<>
									{exercise.map((data, index) => {
										<div key={index}>
											{data}
										</div>
									})}
								</>
							</div>
						)
					})}
				</div>
			</div>	
		</div>
	)
}