import React from "react";
import "./Number.css";

export default function Number({
	pos,
	wheelNumbers,
	offset,
	className,
	slice,
}) {
	let classNameNumber = `Number ${className || ""}`;

	let currentPosition = pos + offset;
	const number = wheelNumbers[currentPosition];

	if (slice <= 0) slice = -15;
	else if (slice > 6) slice = 6;

	return (
		<div
			// style={{ fontSize: "10em" }}
			className={classNameNumber}>
			{number
				? slice > 3
					? `${number.slice(0, 4)} ${number.slice(
							4,
							number.length - slice
					  )}${number.slice(7, number.length - slice)}${"···".slice(
							3 - slice + 3,
							3
					  )} ···`
					: `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(
							7,
							number.length - slice
					  )}${"···".slice(3 - slice, 3)}`
				: number}
		</div>
	);
}
