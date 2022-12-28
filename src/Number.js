import React from "react";
import "./Number.css";

export default function Number({
	pos,
	wheelNumbers,
	offset,
	className,
	slice,
}) {
	let cn = `Number ${className || ""}`;

	let currentPosition = pos + offset;
	const number = wheelNumbers[currentPosition];

	if (slice <= 0) slice = -15;
	else if (slice > 3) slice = 3;

	return (
		<div
			// style={{ fontSize: "10em" }}
			className={cn}>
			{number
				? `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(
						7,
						number.length - slice
				  )}${"···".slice(3 - slice, 3)}`
				: number}
		</div>
	);
}
