export default function ExerciseCard() {
	return (
		<table className="grid max-w-xl">
			<thead className="col-span-2 flex justify-center border border-b-0 rounded-t-xl bg-slate-900">
				<tr>
					<th className="py-4 px-2 text-white">Incline Bench Press</th>
				</tr>
			</thead>
			<tbody className="grid col-span-2 bg-slate-900 border rounded-b-xl">
				<tr className="grid grid-cols-3 py-6 px-4 bg-slate-800">
					<td className="px-2 text-lg self-center">Set 1</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2 px-2">
						<div className="flex gap-2">
							<input name="weight" className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="0" />
							<label className="self-center">lbs</label>
						</div>
						<label className="self-center">x</label>
						<div className="flex gap-2">
							<input name="reps" className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="0" />
							<label className="self-center">reps</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 px-4 bg-slate-700">
					<td className="px-2 text-lg self-center">Set 2</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						<div className="flex gap-2">
							<input name="weight" className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="0" />
							<label className="self-center">lbs</label>
						</div>
						<label className="self-center">x</label>
						<div className="flex gap-2">
							<input name="reps" className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="0" />		
							<label className="self-center">reps</label>
						</div>
					</td>
				</tr>
				<tr className="grid grid-cols-3 py-6 px-4 bg-slate-800 rounded-b-xl">
					<td className="px-2 text-lg self-center">Set 3</td>
					<td className="flex gap-4 md:gap-6 justify-center col-span-2">
						<div className="flex gap-2">
							<input name="weight" className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="0" />
							<label className="self-center">lbs</label>
						</div>
						<label className="self-center">x</label>
						<div className="flex gap-2">
							<input name="reps" className="max-w-14 text-center text-lg text-black border rounded bg-slate-200 py-1" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="0" />	
							<label className="self-center">reps</label>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	)
}