import Link from "next/link";

export default function Home() {
	return (
		<main className="h-screen flex justify-center items-center">
			<div className="flex flex-col w-fit h-fit gap-8">
				<Link href="/push">
					<button className="border rounded-lg px-4 py-4 bg-slate-950">
						Push
					</button>
				</Link>
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
