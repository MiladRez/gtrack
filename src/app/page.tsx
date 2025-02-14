import Link from "next/link";

export default function Home() {
	return (
		<main className="h-screen w-screen flex flex-col justify-center items-center">
			<h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-40">
				Gymtrack
			</h1>
			<div className="flex flex-col items-center w-full max-w-screen-md gap-8">
				<Link href="/push" className="w-1/4">
					<button className="border rounded-lg px-4 py-4 bg-slate-950 w-full">
						Push
					</button>
				</Link>
				<Link href="/pull" className="w-1/4">
					<button className="border rounded-lg px-4 py-4 bg-slate-950 w-full">
						Pull
					</button>
				</Link>
				<Link href="/legs" className="w-1/4">
					<button className="border rounded-lg px-4 py-4 bg-slate-950 w-full">
						Legs
					</button>
				</Link>
			</div>
		</main>
	);
}
