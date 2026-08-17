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
			className={cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className)}
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
				button_previous: cn(buttonVariants({variant: buttonVariant}), "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
				button_next: cn(buttonVariants({variant: buttonVariant}), "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
				month_caption: cn("flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]", defaultClassNames.month_caption),
				caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
				month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
				weekdays: cn("flex", defaultClassNames.weekdays),
				weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
				week: cn("mt-2 flex w-full", defaultClassNames.week),
				day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&[data-selected=true]]:ring-1 ring-white ring-inset rounded-md [&[data-selected=true]]:bg-primary [&[data-selected=true]]:text-primary-foreground", defaultClassNames.day),
				today: cn("bg-accent text-accent-foreground rounded-md", defaultClassNames.today),
				outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
				disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
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
		// className={cn(modifiers.disabled ? "text-muted-foreground opacity-50 pointer-events-none" : "", "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className)} {...props} />;
		className={cn(modifiers.disabled ? "text-muted-foreground opacity-50 pointer-events-none" : "", "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className)} {...props} />;
}

export {Calendar, CalendarDayButton};
