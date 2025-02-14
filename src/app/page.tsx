import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<main className="w-screen flex flex-col justify-center items-center">
			<div className="w-full max-w-screen-md flex flex-col justify-center items-center mt-40">
				<h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-40">
					Gymtrack
				</h1>
				<div className="flex flex-col items-center w-full max-w-screen-md gap-8">
					<Link href="/push" className="w-1/4">
						<Button variant="outline" className="px-4 py-6 bg-slate-950 w-full">
							Push
						</Button>
					</Link>
					<Link href="/pull" className="w-1/4">
						<Button variant="outline" className="px-4 py-6 bg-slate-950 w-full">
							Pull
						</Button>
					</Link>
					<Link href="/legs" className="w-1/4">
						<Button variant="outline" className="px-4 py-6 bg-slate-950 w-full">
							Legs
						</Button>
					</Link>
					<Link href="/pastSessions" className="sm:w-1/4 mt-12">
						<Button variant="outline" className="px-4 py-6 bg-slate-950 w-full">
							Past Sessions
						</Button>
					</Link>
				</div>	
			</div>
		</main>
	);
}
