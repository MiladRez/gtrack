import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
	const sessions = [
		{href: "/pages/push", title: "Push", subtitle: "Chest, shoulders, triceps", accent: "from-orange-400/90 to-red-500/80"},
		{href: "/pages/pull", title: "Pull", subtitle: "Back, biceps, rear delts", accent: "from-emerald-400/90 to-teal-500/80"},
		{href: "/pages/legs", title: "Legs", subtitle: "Quads, glutes, hamstrings", accent: "from-sky-400/90 to-blue-500/80"}
	];

	return (
		<main className="page-shell flex justify-center">
			<div className="flex w-full max-w-(--breakpoint-md) flex-col gap-8 pt-10">
				<section className="flex flex-col items-center gap-5 pt-8">
					<Image
						src="/gtrack-logo.png"
						alt="gtrack logo"
						height={180}
						width={180}
						loading="eager"
						className="drop-shadow-[0_18px_44px_rgba(10,132,255,0.22)]"
					/>
				</section>
				<section className="grid gap-4">
					{sessions.map(session => (
						<Link key={session.title} href={session.href} className="group">
							<div className="glass-panel flex items-center justify-between rounded-[2rem] p-5 transition duration-200 group-active:scale-[0.99]">
								<div>
									<div className="text-2xl font-semibold tracking-tight">{session.title}</div>
									<div className="mt-1 text-sm text-white/50">{session.subtitle}</div>
								</div>
								<div className={`h-12 w-12 rounded-full bg-gradient-to-br ${session.accent} shadow-[0_12px_32px_rgba(0,0,0,0.35)]`} />
							</div>
						</Link>
					))}
				</section>
				<Link href="/pages/pastSessions">
					<Button variant="outline" className="apple-button h-14 w-full rounded-2xl border-white/10 bg-white/[0.07] text-base">
						Past Sessions
					</Button>
				</Link>
			</div>
		</main>
	);
}
