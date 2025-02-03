export default function Home() {
	return (
		<main className="h-screen flex justify-center items-center">
			<div className="flex flex-col w-fit h-fit gap-8">
				<button className="border border-black px-12 py-4 rounded">
					Push
				</button>
				<button className="border border-black px-12 py-4 rounded">
					Pull
				</button>
				<button className="border border-black px-12 py-4 rounded">
					Legs
				</button>
			</div>
		</main>
	);
}
