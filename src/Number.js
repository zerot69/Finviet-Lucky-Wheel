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

	// const [slice, setSlice] = React.useState(7);
	// const [dot, setDot] = React.useState("···");

	// React.useEffect(() => {
	// 	let timeout_1 = setTimeout(() => {
	// 		setSlice((slice) => slice + 1);
	// 		setDot((dot) => dot.slice(0, -1));
	// 	}, 15000);
	// 	let timeout_2 = setTimeout(() => {
	// 		setSlice((slice) => slice + 1);
	// 		setDot((dot) => dot.slice(0, -1));
	// 	}, 17000);
	// 	return () => {
	// 		clearTimeout(timeout_1);
	// 		clearTimeout(timeout_2);
	// 	};
	// }, []);

	if (slice <= 0) slice = -10;
	else if (slice > 3) slice = 3;

	return (
		<div className={cn}>
			{number
				? `${number.slice(0, -slice)}${"···".slice(3 - slice, 3)}`
				: number}
		</div>
	);
}
