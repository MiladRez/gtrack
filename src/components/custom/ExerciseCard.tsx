export default function ExerciseCard() {
	return (
		<table className="grid w-full">
			<thead className="col-span-2 flex justify-center bg-blue-400">
				<th>Incline Bench Press</th>
			</thead>
			<tbody className="col-span-2">
				<tr className="grid grid-cols-2">
					<td className="text-center">Set 1</td>
					<td className="flex">
						<div className="flex">
							<input name="weight" className="w-full text-center" type="number" placeholder="0" />
							<label>x</label>
						</div>
						<div className="flex">
							<input name="reps" className="w-full text-center" type="number" placeholder="0" />
							<label>lbs</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-2">
					<td className="text-center">Set 2</td>
					<td className="flex">
						<div className="flex">
							<input name="weight" className="w-full text-center" type="number" placeholder="0" />
							<label>x</label>
						</div>
						<div className="flex">
							<input name="reps" className="w-full text-center" type="number" placeholder="0" />
							<label>lbs</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-2">
					<td className="text-center">Set 3</td>
					<td className="flex">
						<div className="flex">
							<input name="weight" className="w-full text-center" type="number" placeholder="0" />
							<label>x</label>
						</div>
						<div className="flex">
							<input name="reps" className="w-full text-center" type="number" placeholder="0" />
							<label>lbs</label>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	)
}