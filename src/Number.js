import React from "react";
import "./Number.css";

export default function Number({ pos, wheelNumbers, offset, className }) {
	let cn = `Number ${className || ""}`;

	let currentPosition = pos + offset;
	const number = wheelNumbers[currentPosition];
	// console.log({ pos });
	// console.log({ offset });
	// console.log({ currentPosition });
	// console.log({ wheelNumbers });
	// console.log({ number });
	return (
		<div className={cn}>{number ? `${number.slice(0, -3)}***` : number}</div>
	);
}
