import React, { Component } from "react";

import TWEEN from "tween.js";
import JSConfetti from "js-confetti";

import song from "../assets/song.mp3";

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
			slice: 3,
		};

		this.animate = this.animate.bind(this);
		this.audio = new Audio(song);
		this.audio.loop = true;
		this.audio.volume = 0.5;
	}

	componentDidMount() {
		this.animate();
	}

	generateNumbers() {
		return shuffle(Array.apply(null, phoneNumbers).map((e, i) => e));
	}

	generateTurnsNumbers(numbers) {
		return numbers.concat(numbers, numbers, numbers, numbers);
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

	listPhoneNumbers = ["0839660056", "0899466183", "0396171265", "0906138227"];

	start() {
		this.setState({
			isShown: false,
			currentPos: 0,
			lastIssuedNumber: 0,
			slice: 3,
			// turnNumbers: this.generateTurnsNumbers(this.state.numbers),
		});
		const extractionDuration = 1000;
		if (this.state.animating) return;

		const numbersLength = this.state.numbers.length;
		console.clear();
		console.log("turnNumbers", this.state.turnNumbers);
		console.log("numbers", this.state.numbers);
		console.log("turnNumbers.length", this.state.turnNumbers.length);
		console.log("numbers.length", this.state.numbers.length);

		let randomNumber = Math.floor(
			Math.random() * this.state.turnNumbers.length
		);
		const totalNumberLength =
			this.state.turnNumbers.length - this.state.numbers.length;

		console.log({ randomNumber });
		console.log({ totalNumberLength });
		console.log(
			"randomNumber % numbers.length",
			randomNumber % this.state.numbers.length
		);

		let index = this.state.turnNumbers.indexOf(this.listPhoneNumbers.pop());
		if (index !== randomNumber && index >= 0) {
			randomNumber = index + numbersLength * 5;
		}

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
			let currentPos = Math.floor(this.pos) % (numbersLength * 5);

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

				if (shouldIssue !== this.state.turnNumbers[this.state.currentPos]) {
					console.error(
						shouldIssue,
						this.state.turnNumbers[this.state.currentPos]
					);
				} else {
					console.log("OK");
				}
			});
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
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
				});
			}, 2000);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
				});
			}, 12000);
			setTimeout(() => {
				this.setState({
					slice: this.state.slice - 1,
					showResult: true,
				});
			}, 22000);
			setTimeout(() => {
				this.setState({
					animating: false,
				});
			}, 24000);

			setTimeout(() => {
				const canvas = document.getElementById("canvas-confetti");
				const jsConfetti = new JSConfetti({ canvas });
				jsConfetti.addConfetti();
				jsConfetti.addConfetti();
				jsConfetti.addConfetti();
				jsConfetti.addConfetti();
				jsConfetti.addConfetti();
				this.setState({
					isShown: true,
					currentPos: 0,
					lastIssuedNumber: 0,
				});
			}, 32500);
		});
	}

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
									transition:
										"border-color ease-in-out .15s, box-shadow ease-in-out .15s",
									overflow: "auto",
									whiteSpace: "pre-wrap",
									wordWrap: "break-word",
									overflowWrap: "break-word",
									lineHeight: "1.5",
									flex: "1",
								}}
								required
								defaultValue={`0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
0678 391 749
0927 158 977
0281 565 437
0395 753 257
0720 960 292
0564 239 830
0685 148 805
0525 992 205
0135 967 293
0577 764 727
0899 466 183
0500 863 543
0339 175 928
0616 302 632
0526 948 531
0339 839 265
0883 669 711
0593 146 486
0220 354 769
0353 101 857
0122 529 591
0471 449 859
0651 318 178
0792 880 522
0174 957 347
0501 221 628
0630 902 844
0186 530 759
0171 742 656
0345 774 854
0830 996 763
0103 756 304
0791 127 473
0913 736 231
0693 646 618
0678 728 517
0774 483 060
0215 426 003
0266 857 708
0133 469 008
0520 589 547
0116 210 841
0847 387 846
0114 956 110
0494 175 222
0373 426 991
0537 759 242
0274 249 470
0671 572 720
0538 420 763
0698 659 741
0856 315 313
0211 835 137
0127 113 107
0677 366 201
0835 766 862
0495 778 287
0751 796 706
0869 501 718
0485 318 113
0384 454 196
0579 265 185
0458 556 422
0431 916 730
0250 979 985
0255 824 709
0250 243 801
0396 171 265
0302 859 758
0373 826 919
0181 662 222
0141 408 870
0202 844 511
0909 665 269
0673 517 379
0602 125 494
0392 835 241
0175 567 099
0495 132 738
0506 154 744
0700 950 235
0688 591 621
0928 450 458
0535 521 112
0273 523 999
0214 512 760
0898 970 037
0100 401 839
0798 130 965
0766 825 540
0558 503 849
0801 596 033
0197 873 507
0839 660 056
0621 306 433
0693 402 739
0654 793 478
0558 503 304
0459 400 741
0769 594 551
0906 138 227
`}
								placeholder="Nhập số điện thoại tại đây. Mỗi số cách nhau 1 dòng."
								onBlur={(e) => {
									let temp = e.target.value
										.trim()
										.replace(/ /g, "")
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
							)} */}
							{!this.state.showResult && (
								<button
									style={{
										position: "absolute",
										top: "65%",
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
							<div
								className={`issuedNumber ${
									this.state.showResult && this.state.isShown
										? "issuedNumber--visible"
										: ""
								}`}>
								<span>
									{this.state.resultNumber.slice(0, 4)}{" "}
									{this.state.resultNumber.slice(4, 7)}{" "}
									{this.state.resultNumber.slice(
										7,
										this.state.resultNumber.length
									)}
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
