"use client";

import * as React from "react";
import {ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {DayButton, DayPicker, getDefaultClassNames} from "react-day-picker";

import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = "label",
	buttonVariant = "ghost",
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
	const defaultClassNames = getDefaultClassNames();
	const endOfToday = new Date();
	endOfToday.setHours(23, 59, 59, 999);

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			disabled={{after: endOfToday}}
			className={cn("group/calendar p-3 [--cell-size:2rem] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent", String.raw`[.rdp-button\_next>svg]:**:rtl:rotate-180`, String.raw`[.rdp-button\_previous>svg]:**:rtl:rotate-180`, className)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: date => date.toLocaleString("default", {month: "short"}),
				...formatters
			}}
			classNames={{
				root: cn("w-fit", defaultClassNames.root),
				months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
				month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
				nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
				button_previous: cn(buttonVariants({variant: buttonVariant}), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
				button_next: cn(buttonVariants({variant: buttonVariant}), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
				month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
				caption_label: cn("select-none font-semibold text-white", captionLayout === "label" ? "text-lg" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-lg [&>svg]:size-3.5", defaultClassNames.caption_label),
				month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
				weekdays: cn("flex", defaultClassNames.weekdays),
				weekday: cn("flex-1 select-none rounded-md text-[0.8rem] font-normal text-white/40", defaultClassNames.weekday),
				week: cn("mt-2 flex w-full", defaultClassNames.week),
				day: cn("group/day relative aspect-square h-full w-full select-none rounded-xl p-0 text-center", defaultClassNames.day),
				today: cn("[&>button]:after:block", defaultClassNames.today),
				outside: cn("text-white/25 aria-selected:text-black", defaultClassNames.outside),
				disabled: cn("[&>button]:pointer-events-none [&>button]:text-white/20 [&>button]:opacity-50", defaultClassNames.disabled),
				hidden: cn("invisible", defaultClassNames.hidden),
				...classNames
			}}
			components={{
				Root: ({className, rootRef, ...props}) => {
					return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
				},
				Chevron: ({className, orientation, ...props}) => {
					if (orientation === "left") {
						return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
					}

					if (orientation === "right") {
						return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
					}

					return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
				},
				DayButton: CalendarDayButton,
				...components
			}}
			{...props}
		/>
	);
}

function CalendarDayButton({className, day, modifiers, ...props}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();
	const isSelected = modifiers.selected;

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return <Button
		ref={ref}
		variant="ghost"
		size="icon"
		disabled={modifiers.disabled}
		aria-disabled={modifiers.disabled}
		data-day={day.date.toLocaleDateString("en-CA")}
		data-selected-single={isSelected ? "true" : undefined}
		className={cn(
			"relative flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-xl text-xl font-semibold leading-none text-white/80 hover:bg-white/10 hover:text-white after:absolute after:bottom-3 after:left-1/2 after:hidden after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-white/80",
			defaultClassNames.day,
			className,
			isSelected ? "shadow-[0_0px_28px_rgba(255,255,255,0.08)]" : ""
		)} {...props} />;
}

export {Calendar, CalendarDayButton};
