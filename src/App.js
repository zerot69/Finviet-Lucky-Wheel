import React, { Component } from "react";

import TWEEN from "tween.js";
import JSConfetti from "js-confetti";

import song from "../assets/song.mp3";

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

let phoneNumbers = [""];
class App extends Component {
	constructor(props) {
		super(props);

		const numbers = this.generateNumbers();
		const turnNumbers = this.generateTurnsNumbers(numbers);

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
			tempArray: [],
			slice: 3,
		};

		this.animate = this.animate.bind(this);
		this.audio = new Audio(song);
	}

	componentDidMount() {
		// window.addEventListener("keydown", this.onKeyDown.bind(this));
		// window.addEventListener("dblclick", this.onDblClick.bind(this));
		this.animate();
	}

	// onKeyDown(e) {
	// 	e.preventDefault();
	// 	// start|stop on [space]

	// 	switch (e.keyCode) {
	// 		case 32:
	// 			e.preventDefault();
	// 			this[!this.state.animating ? "start" : "stop"]();
	// 			this.setState({ isShown: false });
	// 			break;
	// 		case 83:
	// 			this.changeSeries();
	// 			this.setState({ isShown: false });
	// 			break;
	// 		default:
	// 	}

	// 	// reset on [escape]
	// 	//evt.keyCode === 27 && this.reset();
	// }

	// onDblClick() {
	// 	this[!this.state.animating ? "start" : "stop"]();
	// }

	generateNumbers() {
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
					tempArray: [],
					slice: 3,
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
		this.setState({
			isShown: false,
			slice: 3,
			// turnNumbers: this.generateTurnsNumbers(this.state.numbers),
		});
		const extractionDuration = 18000;
		if (this.state.animating) return;

		const numbersLength = this.state.numbers.length;
		console.clear();
		console.log("turnNumbers", this.state.turnNumbers);
		console.log("numbers", this.state.numbers);
		console.log("turnNumbers.length", this.state.turnNumbers.length);
		console.log("numbers.length", this.state.numbers.length);

		const randomNumber = Math.floor(
			Math.random() * this.state.turnNumbers.length
		);
		// const randomNumber = this.state.turnNumbers[this.state.turnNumbers.length - 1] - 1;
		const totalNumberLength =
			this.state.turnNumbers.length - this.state.numbers.length;

		console.log({ randomNumber });
		console.log({ totalNumberLength });
		console.log(
			"randomNumber % numbers.length",
			randomNumber % this.state.numbers.length
		);

		const shouldIssue =
			this.state.numbers[randomNumber % this.state.numbers.length];
		console.log("Will issued " + shouldIssue, randomNumber);

		if (this.t) {
			this.t.stop();
		}

		this.t = new TWEEN.Tween({ pos: this.state.lastIssuedNumber }).to(
			{ pos: totalNumberLength + (randomNumber % numbersLength) },
			extractionDuration
		);

		// // this.t.interpolation( TWEEN.Interpolation.Linear );
		this.t.easing(TWEEN.Easing.Quadratic.InOut);
		// this.t.easing(TWEEN.Easing.Exponential.InOut);
		// this.t.easing(TWEEN.Easing.Cubic.Out);

		let _self = this;
		let lastPos = null;
		let minPlayDistance = 0.001;
		let lastDelta = 0;

		this.t.onUpdate(function (delta) {
			let currentPos = Math.floor(this.pos) % (numbersLength * 6);

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
				this.setState({
					lastIssuedNumber: randomNumber,
					resultNumber: this.state.turnNumbers[this.state.currentPos],
				});

				// console.log("turn", this.state.turnNumbers);
				// console.log("numbers", this.state.numbers);
				// console.log("result", this.state.resultNumber, this.state.currentPos);

				if (shouldIssue !== this.state.turnNumbers[this.state.currentPos]) {
					console.error(
						shouldIssue,
						this.state.turnNumbers[this.state.currentPos]
					);
				} else {
					console.log("OK");
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
					slice: this.state.slice - 1,
				},
				resolve
			);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
				});
			}, 1500);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
					showResult: true,
				});
			}, 3000);
			setTimeout(() => {
				this.setState({
					animating: false,
				});
			}, 6000);
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
			// width: this.state.animationPos * 100 + "%",
			transform: `scaleX(${this.state.animationPos})`,
		};

		const wheelFigureClass = this.state.animating
			? "wheel__figure wheel__figure--start-rotation"
			: "";

		// console.log(this.state.turnNumbers);
		// console.log(this.state.numbers);

		console.log("slice", this.state.slice);

		return (
			<span>
				<div
					className="App"
					data-serie={this.state.series}>
					{JSON.stringify(this.state.numbers) === JSON.stringify([""]) ||
					JSON.stringify(this.state.numbers) === JSON.stringify([]) ? (
						<span
							style={{
								fontSize: "20px",
								width: "33vw",
								fontWeight: "bold",
								margin: "60px",
								display: "flex",
								flexFlow: "column",
							}}>
							<textarea
								style={{
									width: "100%",
									height: "300px",
									marginBottom: "40px",
									fontSize: "20px",
									resize: "none",
									border: "1px solid #ccc",
									padding: "10px",
									boxSizing: "border-box",
									outline: "none",
									borderRadius: "8px",
									boxShadow: "inset 0 1px 1px rgba(0,0,0,.075)",
									transition:
										"border-color ease-in-out .15s,box-shadow ease-in-out .15s",
									overflow: "auto",
									whiteSpace: "pre-wrap",
									wordWrap: "break-word",
									overflowWrap: "break-word",
									lineHeight: "1.5",
									flex: "1",
								}}
								required
								// 								value={`0827483471
								// 0678391749
								// 0498831280
								// 0927158977
								// 0281565437
								// 0395753257
								// 0720960292
								// 0564239830
								// 0685148805
								// 0525992205
								// 0135967293
								// 0577764727
								// 0681528848
								// 0500863543
								// 0339175928
								// 0616302632
								// 0526948531
								// 0339839265
								// 0883669711
								// 0593146486
								// 0220354769
								// 0353101857
								// 0122529591
								// 0471449859
								// 0651318178
								// 0792880522
								// 0174957347
								// 0501221628
								// 0630902844
								// 0186530759
								// 0171742656
								// 0345774854
								// 0830996763
								// 0103756304
								// 0791127473
								// 0913736231
								// 0693646618
								// 0678728517
								// 0774483060
								// 0215426003
								// 0266857708
								// 0133469008
								// 0520589547
								// 0116210841
								// 0847387846
								// 0114956110
								// 0494175222
								// 0373426991
								// 0537759242
								// 0274249470
								// 0671572720
								// 0538420763
								// 0698659741
								// 0856315313
								// 0211835137
								// 0127113107
								// 0677366201
								// 0835766862
								// 0495778287
								// 0751796706
								// 0869501718
								// 0485318113
								// 0384454196
								// 0579265185
								// 0458556422
								// 0431916730
								// 0250979985
								// 0255824709
								// 0250243801
								// 0302859758
								// 0373826919
								// 0181662222
								// 0141408870
								// 0202844511
								// 0909665269
								// 0673517379
								// 0602125494
								// 0392835241
								// 0175567099
								// 0495132738
								// 0506154744
								// 0700950235
								// 0688591621
								// 0928450458
								// 0535521112
								// 0273523999
								// 0214512760
								// 0898970037
								// 0100401839
								// 0798130965
								// 0766825540
								// 0558503849
								// 0801596033
								// 0197873507
								// 0621306433
								// 0693402739
								// 0654793478
								// 0558503304
								// 0459400741
								// 0769594551`}
								placeholder="Nhập số điện thoại tại đây. Mỗi số cách nhau 1 dòng."
								onBlur={(e) => {
									console.log(e.target);
									let temp = e.target.value
										.trim()
										.split("\n")
										.map((n) => n);
									this.setState({
										tempArray: temp,
									});
								}}
							/>
							<button
								style={{
									fontSize: "20px",
									color: "white",
									backgroundColor: "#0070ce",
									border: "none",
									padding: "10px 20px",
									borderRadius: "8px",
									cursor: "pointer",
									flex: "0 0 auto",
								}}
								onClick={() => {
									let temp = shuffle(this.state.tempArray);
									this.setState({
										numbers: temp,
										turnNumbers: this.generateTurnsNumbers(temp),
									});
								}}>
								Update
							</button>
						</span>
					) : (
						<div className="numbers">
							{/*{ this.state.currentPos }*/}
							{/*{ this.state.wheelNumbers.map(n => <Number key={n} number={n} />)}*/}
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={-4}
							/>
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={-3}
							/>
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={-2}
							/>
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={-1}
							/>
							<Number
								className="marker"
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={0}
								slice={this.state.slice}
							/>
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={1}
							/>
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={2}
							/>
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
								pos={this.state.currentPos}
								wheelNumbers={this.state.turnNumbers}
								offset={3}
							/>
							<Number
								className={`${this.state.showResult ? "hidden" : "hidden"}`}
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
										backgroundColor: "#0070ce",
										color: "white",
										padding: "10px 20px",
										fontSize: "20px",
										border: "none",
										borderRadius: "8px",
										cursor: "pointer",
										transition: "all 0.3s ease",
									}}
									onClick={() => {
										this.audio.pause();
										const canvas = document.getElementById("canvas-confetti");
										const jsConfetti = new JSConfetti({ canvas });
										jsConfetti.addConfetti();
										jsConfetti.addConfetti();
										jsConfetti.addConfetti();
										jsConfetti.addConfetti();
										jsConfetti.addConfetti();
										// setTimeout(() => {
										// 	jsConfetti.addConfetti();
										// 	jsConfetti.addConfetti();
										// 	jsConfetti.addConfetti();
										// 	jsConfetti.addConfetti();
										// 	jsConfetti.addConfetti();
										// }, 1000);
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
							{!this.state.showResult && (
								<button
									style={{
										position: "absolute",
										top: "70%",
										left: "50%",
										transform: "translate(-50%, -50%)",
										backgroundColor: this.state.animating
											? "#005aa5"
											: "#0070ce",
										color: "white",
										padding: "10px 20px",
										fontSize: "20px",
										border: "none",
										borderRadius: "8px",
										cursor: this.state.animating ? "not-allowed" : "pointer",
										transition: "all 0.3s ease",
										disabled: this.state.animating ? true : false,
									}}
									onClick={() => {
										this.start();
									}}>
									Start
								</button>
							)}
						</div>
					)}

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
								<span>
									{this.state.resultNumber.slice(0, 4)}{" "}
									{this.state.resultNumber.slice(4, 7)}{" "}
									{this.state.resultNumber.slice(7, 10)}
								</span>
							</div>
							<button
								style={{
									position: "absolute",
									top: "80%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									backgroundColor: "#fff",
									color: "black",
									padding: "10px 20px",
									fontSize: "20px",
									border: "none",
									borderRadius: "8px",
									cursor: "pointer",
									transition: "all 0.3s ease",
									zIndex: 100,
								}}
								onClick={() => {
									console.log(this.state.resultNumber);
									this.setState({
										isShown: false,
										showResult: false,
										slice: 3,
										numbers: this.state.numbers.filter(
											(e, i) => e !== this.state.resultNumber
										),
										turnNumbers: this.state.turnNumbers.filter(
											(e, i) => e !== this.state.resultNumber
										),
										currentPos: 0,
									});
								}}>
								Roll Again
							</button>
						</span>
					)}
				</div>
			</span>
		);
	}
}

export default App;
