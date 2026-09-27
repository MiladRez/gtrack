export const APP_TIME_ZONE = "America/Toronto";

function getTimeZoneParts(date: Date, timeZone: string) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);

	const values = Object.fromEntries(
		parts
			.filter(part => part.type !== "literal")
			.map(part => [part.type, Number(part.value)])
	);

	return {
		year: values.year,
		month: values.month,
		day: values.day,
		hour: values.hour,
		minute: values.minute,
		second: values.second
	};
}

function getTimeZoneOffset(date: Date, timeZone: string) {
	const parts = getTimeZoneParts(date, timeZone);
	const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);

	return asUtc - date.getTime();
}

function zonedDateTimeToUtc(
	timeZone: string,
	year: number,
	month: number,
	day: number,
	hour = 0,
	minute = 0,
	second = 0,
	millisecond = 0
) {
	const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
	const firstOffset = getTimeZoneOffset(utcGuess, timeZone);
	const firstUtc = new Date(utcGuess.getTime() - firstOffset);
	const secondOffset = getTimeZoneOffset(firstUtc, timeZone);

	return new Date(utcGuess.getTime() - secondOffset);
}

export function getDateKey(date: Date | string, timeZone = APP_TIME_ZONE) {
	return new Date(date).toLocaleDateString("en-CA", {timeZone});
}

export function getTodayBounds(timeZone = APP_TIME_ZONE, now = new Date()) {
	const today = getTimeZoneParts(now, timeZone);
	const start = zonedDateTimeToUtc(timeZone, today.year, today.month, today.day);
	const nextDayLocal = new Date(Date.UTC(today.year, today.month - 1, today.day + 1));
	const nextDay = getTimeZoneParts(nextDayLocal, "UTC");
	const end = zonedDateTimeToUtc(timeZone, nextDay.year, nextDay.month, nextDay.day);

	return {start, end};
}

export function dateKeyToLocalDate(dateKey: string) {
	return new Date(`${dateKey}T12:00:00`);
}
