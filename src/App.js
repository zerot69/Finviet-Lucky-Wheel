import React, { Component } from "react";

import TWEEN from "tween.js";
import JSConfetti from "js-confetti";

import backgroundMusic from "../assets/Ve-Que-An-Tet-Jun-Pham.mp3";
import winnerSoundEffect from "../assets/winner.mp3";

import Number from "./Number";
import "./App.css";

function shuffle(originalArray) {
	let array = originalArray.slice();
	let counter = array.length;
	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);
		counter--;
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
			slice: 6,
			currentTimeMusic: 0,
		};

		this.animate = this.animate.bind(this);
		this.audio = new Audio(backgroundMusic);
	}

	componentDidMount() {
		this.animate();
	}

	generateNumbers() {
		return shuffle(Array.apply(null, phoneNumbers).map((e, i) => e));
	}

	generateTurnsNumbers(numbers) {
		return numbers.concat(numbers, numbers);
	}

	start() {
		this.audio.src = backgroundMusic;
		this.audio.currentTime = this.state.currentTimeMusic;
		this.audio.loop = true;
		this.audio.volume = 0.5;
		this.audio.play();

		this.setState({
			isShown: false,
			currentPos: 0,
			lastIssuedNumber: 0,
			slice: 6,
		});
		const extractionDuration = 10000;
		if (this.state.animating) return;

		const numbersLength = this.state.numbers.length;
		console.clear();
		console.log("turnNumbers", this.state.turnNumbers);
		console.log("numbers", this.state.numbers);
		console.log("turnNumbers.length", this.state.turnNumbers.length);
		console.log("numbers.length", this.state.numbers.length);

		let randomNumber = Math.floor(Math.random() * this.state.turnNumbers.length);
		const totalNumberLength = this.state.turnNumbers.length - this.state.numbers.length;

		console.log({ randomNumber });
		console.log({ totalNumberLength });
		console.log("randomNumber % numbers.length", randomNumber % this.state.numbers.length);

		const shouldIssue = this.state.numbers[randomNumber % this.state.numbers.length];
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
			let currentPos = Math.floor(this.pos) % (numbersLength * 3);

			if ((lastPos === null || lastPos !== currentPos) && delta - lastDelta >= minPlayDistance) {
				lastPos = currentPos;
				_self.audio.play();
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

				if (shouldIssue !== this.state.turnNumbers[this.state.currentPos]) {
					console.error(shouldIssue, this.state.turnNumbers[this.state.currentPos]);
				} else {
					console.log("OK");
				}
			});
		});

		this.setState(
			{
				animating: true,
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
			setTimeout(() => {
				this.setState(
					{
						slice: this.state.slice - 1,
					},
					resolve
				);
			}, 5000);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
				});
			}, 5500);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
				});
			}, 6000);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
				});
			}, 11000);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
				});
			}, 12500);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
					showResult: true,
				});
			}, 15000);
			setTimeout(() => {
				this.setState({
					animating: false,
				});
			}, 18000);
			setTimeout(() => {
				this.audio.pause();
				this.setState({
					currentTimeMusic: this.audio.currentTime,
				});
				this.audio.src = winnerSoundEffect;
				this.audio.loop = false;
				this.audio.play();
				const canvas = document.getElementById("canvas-confetti");
				const jsConfetti = new JSConfetti({ canvas });
				jsConfetti.addConfetti({
					confettiColors: ["#ffffff", "#faf0b0", "#f4d62f"],
					confettiNumber: 2000,
				});
				setTimeout(() => {
					jsConfetti.addConfetti({
						confettiColors: ["#ffffff", "#faf0b0", "#f4d62f"],
						confettiNumber: 1500,
					});
				}, 2500);
				setTimeout(() => {
					jsConfetti.addConfetti({
						confettiColors: ["#ffffff", "#faf0b0", "#f4d62f"],
						confettiNumber: 1000,
					});
				}, 5000);
				this.setState({
					isShown: true,
					currentPos: 0,
					lastIssuedNumber: 0,
				});
			}, 18100);
		});
	}

	animate() {
		requestAnimationFrame(this.animate);
		if (this.state.animating) {
			TWEEN.update();
		}
	}

	render() {
		const wheelFigureClass = this.state.animating ? "wheel__figure wheel__figure--start-rotation" : "";

		return (
			<span>
				<div
					className="App"
					data-serie={this.state.series}>
					{JSON.stringify(this.state.numbers) === JSON.stringify([""]) || JSON.stringify(this.state.numbers) === JSON.stringify([]) ? (
						<span
							style={{
								fontSize: "20px",
								width: "33vw",
								height: "60vh",
								fontWeight: "bold",
								margin: " 150px 60px",
								display: "flex",
								flexFlow: "column",
							}}>
							<textarea
								style={{
									width: "100%",
									height: "100px",
									marginBottom: "40px",
									fontSize: "20px",
									resize: "none",
									border: "1px solid #ccc",
									padding: "10px",
									boxSizing: "border-box",
									outline: "none",
									borderRadius: "8px",
									boxShadow: "inset 0 1px 1px rgba(0,0,0,.075)",
									transition: "border-color ease-in-out .15s, box-shadow ease-in-out .15s",
									overflow: "auto",
									whiteSpace: "pre-wrap",
									wordWrap: "break-word",
									overflowWrap: "break-word",
									lineHeight: "1.5",
									flex: "1",
								}}
								required
								placeholder={`Nh???p s??? ??i???n tho???i t???i ????y. M???i s??? c??ch nhau 1 d??ng. V?? d???:
0901234567
0909090909
...`}
								onBlur={(e) => {
									let temp = e.target.value
										.trim()
										.replace(/ /g, "")
										.replace(/-/g, "")
										.split(/[\r\n]+/)
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

							{/* {this.state.showResult && (
								<button
									style={{
										position: "absolute",
										top: "65%",
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
										// this.audio.pause();
										const canvas = document.getElementById("canvas-confetti");
										const jsConfetti = new JSConfetti({ canvas });
										jsConfetti.addConfetti({
											confettiNumber: 3000,
										});
										setTimeout(() => {
											jsConfetti.addConfetti({
												confettiNumber: 2000,
											});
										}, 1500);
										setTimeout(() => {
											jsConfetti.addConfetti({
												confettiNumber: 1000,
											});
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
							)} */}
							{!this.state.showResult && (
								<button
									style={{
										position: "absolute",
										top: "65%",
										left: "50%",
										transform: "translate(-50%, -50%)",
										backgroundColor: this.state.animating ? "#005aa5" : "#0070ce",
										color: "white",
										padding: "10px 20px",
										fontSize: "20px",
										border: "none",
										borderRadius: "8px",
										cursor: "pointer",
										display: this.state.animating ? "none" : "block",
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
							<div className={`issuedNumber ${this.state.showResult && this.state.isShown ? "issuedNumber--visible" : ""}`}>
								<span>
									{this.state.resultNumber.slice(0, 4)} {this.state.resultNumber.slice(4, 7)}{" "}
									{this.state.resultNumber.slice(7, this.state.resultNumber.length)}
								</span>
							</div>
							<button
								style={{
									position: "absolute",
									top: "90%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									backgroundColor: "#fae8ab",
									color: "#de3933",
									padding: "10px 20px",
									fontSize: "20px",
									border: "none",
									borderRadius: "8px",
									cursor: "pointer",
									transition: "all 0.3s ease",
									boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
									zIndex: 100,
								}}
								onClick={() => {
									console.log(this.state.resultNumber);
									this.setState({
										isShown: false,
										showResult: false,
										slice: 6,
										numbers: this.state.numbers.filter((e, i) => e !== this.state.resultNumber),
										turnNumbers: this.state.turnNumbers.filter((e, i) => e !== this.state.resultNumber),
										currentPos: 0,
										lastIssuedNumber: 0,
									});
								}}>
								Continue
							</button>
						</span>
					)}
				</div>
			</span>
		);
	}
}

export default App;
