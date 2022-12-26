import React, { Component } from "react";

import TWEEN from "tween.js";
import JSConfetti from "js-confetti";

import beepAudio from "../assets/beep.mp4";
import beepAudioWav from "../assets/beep.wav";

import Number from "./Number";
import "./App.css";

function shuffle(originalArray) {
	let array = originalArray.slice();
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

const phoneNumbers = [
	"0839660056",
	"0912890867",
	"0988312806",
	"08274834717",
	"06783917498",
	"04988312806",
	"09271589779",
	"02815654372",
	"03957532578",
	"07209602925",
	"05642398302",
	"06851488050",
	"05259922058",
	"01359672933",
	"05777647270",
	"06815288486",
	"05008635433",
	"03391759287",
	"06163026326",
	"05269485316",
	"03398392657",
	"08836697115",
	"05931464860",
	"02203547699",
	"03531018574",
	"01225295919",
	"04714498593",
	"06513181789",
	"07928805229",
	"01749573479",
	"05012216281",
	"06309028441",
	"01865307599",
	"01717426561",
	"03457748548",
	"08309967632",
	"01037563045",
	"07911274730",
	"09137362316",
	"06936466185",
	"06787285178",
	"07744830601",
	"02154260035",
	"02668577089",
	"01334690084",
	"05205895473",
	"01162108415",
	"08473878467",
	"01149561106",
	"04941752226",
	"03734269916",
	"05377592427",
	"02742494704",
	"06715727201",
	"05384207636",
	"06986597416",
	"08563153133",
	"02118351375",
	"01271131074",
	"06773662016",
	"08357668629",
	"04957782876",
	"07517967066",
	"08695017181",
	"04853181137",
	"03844541962",
	"05792651854",
	"04585564227",
	"04319167308",
	"02509799853",
	"02558247096",
	"02502438016",
	"03028597584",
	"03738269195",
	"01816622228",
	"01414088703",
	"02028445116",
	"09096652697",
	"06735173797",
	"06021254945",
	"03928352414",
	"01755670999",
	"04951327387",
	"05061547442",
	"07009502355",
	"06885916215",
	"09284504583",
	"05355211121",
	"02735239992",
	"02145127607",
	"08989700377",
	"01004018399",
	"07981309651",
	"07668255404",
	"05585038495",
	"08015960334",
	"01978735075",
	"06213064339",
	"06934027397",
	"06547934786",
	"05585033044",
	"04594007415",
];

class App extends Component {
	constructor(props) {
		super(props);

		const numbers = this.generateNumbers();
		const turnNumbers = this.generateTurnsNumbers(numbers);

		// const phoneNumbers = this.phoneNumbers.bind(this);

		this.state = {
			numbers,
			turnNumbers,
			issuedNumber: shuffle(numbers),
			animating: false,
			animationPos: 0,
			currentPos: 0,
			lastIssuedNumber: 0,
			showResult: false,
			isShown: false,
			series: 0,
		};

		this.animate = this.animate.bind(this);

		const a = document.createElement("audio");
		if (!!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""))) {
			this.audio = new Audio(beepAudioWav);
		} else {
			this.audio = new Audio(beepAudio);
		}
	}

	componentDidMount() {
		window.addEventListener("keydown", this.onKeyDown.bind(this));
		window.addEventListener("dblclick", this.onDblClick.bind(this));
		this.animate();
	}

	onKeyDown(e) {
		// e.preventDefault();
		// start|stop on [space]

		switch (e.keyCode) {
			case 32:
				e.preventDefault();
				this[!this.state.animating ? "start" : "stop"]();
				this.setState({ isShown: false });
				break;
			case 83:
				this.changeSeries();
				this.setState({ isShown: false });
				break;
			default:
		}

		// reset on [escape]
		//evt.keyCode === 27 && this.reset();
	}

	onDblClick() {
		this[!this.state.animating ? "start" : "stop"]();
	}

	generateNumbers() {
		console.log(Array.apply(null, phoneNumbers));
		return shuffle(Array.apply(null, phoneNumbers).map((e, i) => e));
	}

	generateTurnsNumbers(numbers) {
		return numbers.concat(numbers, numbers, numbers, numbers, numbers);
	}

	reset() {
		return new Promise((resolve, reject) => {
			const numbers = this.generateNumbers();
			const turnNumbers = this.generateTurnsNumbers(numbers);

			this.setState(
				{
					numbers,
					turnNumbers,
					issuedNumber: shuffle(numbers),
					animating: false,
					animationPos: 0,
					currentPos: 0,
					lastIssuedNumber: 0,
					showResult: false,
					isShown: false,
				},
				resolve
			);
		});
	}

	/**
	 *
	 * This function update the color series changing the background color, and resetting the numbers
	 *
	 * @memberof App
	 */
	changeSeries() {
		this.reset().then(() => {
			// Update background color by array definition

			let next = this.state.series + 1;

			if (next > 7) {
				next = 0;
			}

			this.setState({
				series: next,
			});
		});
	}

	start() {
		const extractionDuration = 18100;

		if (this.state.animating) return;

		const randomNumber = this.state.issuedNumber.pop() - 1;
		const totalNumberLength =
			this.state.turnNumbers.length - this.state.numbers.length;

		const shouldIssue =
			this.state.numbers[randomNumber % this.state.numbers.length];

		console.log("Will issued " + shouldIssue, randomNumber);

		if (this.t) {
			this.t.stop();
		}

		this.t = new TWEEN.Tween({ pos: this.state.lastIssuedNumber }).to(
			{ pos: totalNumberLength + randomNumber },
			extractionDuration
		);

		// // this.t.interpolation( TWEEN.Interpolation.Linear );
		// this.t.easing(TWEEN.Easing.Quadratic.InOut);
		this.t.easing(TWEEN.Easing.Exponential.InOut);
		// this.t.easing(TWEEN.Easing.Cubic. Out);

		let _self = this;
		let lastPos = null;
		let minPlayDistance = 0.001;
		let lastDelta = 0;

		this.t.onUpdate(function (delta) {
			let currentPos = Math.floor(this.pos) % (phoneNumbers.length * 6);

			if (
				(lastPos === null || lastPos !== currentPos) &&
				delta - lastDelta >= minPlayDistance
			) {
				lastPos = currentPos;
				_self.audio.play();
				// console.log(delta - lastDelta, minPlayDistance, (delta - lastDelta >= minPlayDistance))

				lastDelta = delta;
			}

			_self.setState({
				currentPos,
				animationPos: delta,
			});
		});

		this.t.onComplete(() => {
			this.stop().then(() => {
				// console.log(shouldIssue, this.state.currentPos);
				this.setState({
					lastIssuedNumber: randomNumber,
					resultNumber: this.state.turnNumbers[this.state.currentPos],
					showResult: true,
				});

				if (shouldIssue !== this.state.turnNumbers[this.state.currentPos]) {
					console.error(
						shouldIssue,
						this.state.turnNumbers[this.state.currentPos]
					);
				}
				// this.extractNumber();
			});
			// .then(() => {
			//   if (this.state.issuedNumber.length < 100) {
			//     this.start();
			//   } else {
			//     console.log(this.state.issuedNumber.sort( (a, b) => a - b));
			//   }
			// })
		});

		this.setState(
			{
				animating: true,
				// lastIssuedNumber: randomNumber,
				showResult: false,
			},
			() => {
				this.t.start();
			}
		);
	}

	stop() {
		console.log("stop");
		return new Promise((resolve) => {
			this.setState(
				{
					animating: false,
				},
				resolve
			);
		});
	}

	// extractNumber() {
	//   // turnNumbers: shuffle(numbers),

	//   // const number = this.state.turnNumbers.pop();
	//   // const number = this.state.turnNumbers[this.state.turnNumbers.currentPos];
	//   // this.state.issuedNumber.push(number);

	//   return new Promise(resolve => {
	//     this.setState(
	//       {
	//         // turnNumbers: shuffle(this.state.turnNumbers),
	//         // issuedNumber: this.state.issuedNumber
	//       },
	//       resolve
	//     );
	//   });
	// }

	animate() {
		requestAnimationFrame(this.animate);

		if (this.state.animating) {
			TWEEN.update();
		}
	}

	render() {
		const timerAnimation = {
			// width: (this.state.animationPos * 100) + "%"
			transform: `scaleX(${this.state.animationPos})`,
		};

		const wheelFigureClass = this.state.animating
			? "wheel__figure wheel__figure--start-rotation"
			: "";

		// console.log(this.state.turnNumbers);

		return (
			<div
				className="App"
				data-serie={this.state.series}>
				<div className="numbers">
					{/*{ this.state.currentPos }*/}

					{/*{ this.state.wheelNumbers.map(n => <Number key={n} number={n} />)}*/}
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={-4}
					/>
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={-3}
					/>
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={-2}
					/>
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={-1}
					/>
					<Number
						className="marker"
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={0}
					/>
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={1}
					/>
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={2}
					/>
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={3}
					/>
					<Number
						className={`${this.state.showResult ? "hidden" : ""}`}
						pos={this.state.currentPos}
						wheelNumbers={this.state.turnNumbers}
						offset={4}
					/>

					<div
						className="timer"
						style={timerAnimation}
					/>

					{this.state.showResult && (
						<button
							style={{
								position: "absolute",
								top: "70%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								background: "#0070ce",
								color: "white",
								padding: "10px 20px",
								fontSize: "20px",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer",
								transition: "all 0.3s ease",
							}}
							onClick={() => {
								const canvas = document.getElementById("canvas-confetti");

								const jsConfetti = new JSConfetti({ canvas });
								jsConfetti.addConfetti();
								jsConfetti.addConfetti();
								jsConfetti.addConfetti();
								jsConfetti.addConfetti();
								jsConfetti.addConfetti();
								setTimeout(() => {
									jsConfetti.addConfetti();
									jsConfetti.addConfetti();
									jsConfetti.addConfetti();
									jsConfetti.addConfetti();
									jsConfetti.addConfetti();
								}, 3000);
								return new Promise((resolve) => {
									this.setState(
										{
											isShown: true,
										},
										resolve
									);
								});
							}}>
							Show Result
						</button>
					)}
				</div>

				<div className="wheel__container">
					<div className={`wheel__figure ${wheelFigureClass}`} />
				</div>

				{this.state.showResult && this.state.isShown && (
					<span>
						<canvas id="canvas-confetti"></canvas>
						<div
							className={`issuedNumber ${
								this.state.showResult && this.state.isShown
									? "issuedNumber--visible"
									: ""
							}`}>
							<span>{this.state.resultNumber}</span>
						</div>
					</span>
				)}
			</div>
		);
	}
}

export default App;
