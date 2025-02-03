export default function ExerciseCard() {
	return (
		<table>
			<thead>
				<th>Incline Bench Press</th>
			</thead>
			<tbody>
				<tr>
					<td>Set 1</td>
					<td>
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
				<tr>
					<td>Set 2</td>
					<td>
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
				<tr>
					<td>Set 3</td>
					<td>
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