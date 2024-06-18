import { useState } from "react";

type Color =
	| "red"
	| "yellow"
	| "orange"
	| "green"
	| "blue"
	| "indigo"
	| "purple"
	| "black";

function App() {
	const [nowPlayer, setNowPlayer] = useState(0);
	const [nowVote, setNowVote] = useState(1);
	const [status, setStatus] = useState(0);
	const [tmpVote, setTmpVote] = useState<(Color | null)[]>([null]);
	const [players, setPlayers] = useState<(string | null)[]>([
		null,
		null,
		null,
		null,
		null,
		null,
	]);
	const [votes, setVotes] = useState<(Color | null)[][]>([]);

	function vote(color: Color) {
		if (nowVote === 6) return;

		const tmp = [...tmpVote, color];

		if (
			(nowPlayer !== 5 && nowVote <= 5) ||
			(nowPlayer === 5 && nowVote <= 4)
		) {
			let next = nowVote + 1;
			if (next === nowPlayer) {
				tmp.push(null);
				next++;
			}

			setTmpVote(tmp);
			setNowVote(next);
		}
	}

	function undo() {
		if (
			(nowPlayer === 0 && nowVote === 1) ||
			(nowPlayer !== 0 && nowVote === 0)
		) {
			return alert("これ以上は取り消せません");
		}

		const tmp = [...tmpVote];
		const last = tmp.pop();

		if (last === null) {
			tmp.pop();
		}

		setTmpVote(tmp);

		const next = nowVote - 1;
		setNowVote(next === nowPlayer ? next - 1 : next);
	}

	function sendPlayers() {
		if (players.some((p) => !p)) {
			return alert("全てのプレイヤー名を入力してください");
		}

		setStatus(1);
	}

	function nextPlayer() {
		setVotes([...votes, tmpVote]);

		if (nowPlayer === 5) return setStatus(2);

		setTmpVote([]);
		setNowPlayer(nowPlayer + 1);
		setNowVote(0);
	}

	function reload() {
		if (!window.confirm("結果をリセットしてもよろしいですか？")) return;

		setNowPlayer(0);
		setNowVote(1);
		setStatus(0);
		setTmpVote([null]);
		setPlayers([null, null, null, null, null, null]);
		setVotes([]);
	}

	if (status === 0) {
		return (
			<div className="flex flex-col items-center min-h-svh justify-center">
				<p className="text-3xl font-bold mb-6">プレイヤー名入力</p>

				{[0, 1, 2, 3, 4, 5].map((i) => {
					return (
						<div key={i} className="flex items-center gap-2 my-2">
							<p>Player {i + 1} …</p>
							<input
								type="text"
								value={players[i] || ""}
								onChange={(e) => {
									const newPlayers = [...players];
									newPlayers[i] = e.target.value;
									setPlayers(newPlayers);
								}}
								className="border border-gray-400 px-2 py-1 rounded"
							/>
						</div>
					);
				})}

				<button
					type="button"
					className="bg-blue-700 text-white px-5 py-2 rounded-full mt-5"
					onClick={() => sendPlayers()}
				>
					スタート
				</button>
			</div>
		);
	}

	if (status === 1) {
		return (
			<div className="flex flex-col items-center min-h-svh justify-center">
				<p className="text-3xl font-bold">{players[nowPlayer]} さんの番です</p>

				<div className="my-5 text-4xl flex flex-col items-end">
					{[0, 1, 2, 3, 4, 5].map((i) => {
						if (i === nowPlayer) return;
						return (
							<div key={i} className="flex items-center gap-2 my-2">
								<p>{players[i]} …</p>
								<div
									className={`size-12 rounded-full ${nowVote === i ? "border border-black animate-pulse" : ""}`}
									style={{
										background: tmpVote[i] as string,
									}}
								/>
							</div>
						);
					})}
				</div>

				{nowVote !== 6 && (
					<>
						<div className="grid grid-cols-4 gap-4 mt-5 mb-2">
							{(
								[
									"red",
									"yellow",
									"orange",
									"green",
									"blue",
									"indigo",
									"purple",
									"black",
								] as Color[]
							).map((color) => {
								return (
									<button
										key={color}
										type="button"
										className="size-14 rounded-full border border-gray-400"
										style={{ background: color }}
										onClick={() => vote(color)}
									/>
								);
							})}
						</div>
					</>
				)}

				<button
					type="button"
					className="border border-gray-500 px-5 py-2 rounded-full mt-3"
					onClick={() => undo()}
				>
					取り消し
				</button>

				{nowVote === 6 && (
					<button
						type="button"
						className="bg-blue-700 text-white px-5 py-2 rounded-full mt-3"
						onClick={() => nextPlayer()}
					>
						{nowPlayer === 5 ? "結果を見る" : "次のプレイヤーへ"}
					</button>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center min-h-svh justify-center">
			<p className="text-3xl font-bold">集計結果</p>

			<div className="my-5 text-2xl">
				{[0, 1, 2, 3, 4, 5].map((i) => {
					const results: { [key in Color]: number } = {
						red: 0,
						yellow: 0,
						orange: 0,
						green: 0,
						blue: 0,
						indigo: 0,
						purple: 0,
						black: 0,
					};

					for (let j = 0; j < 6; j++) {
						const color = votes[j][i];
						if (color) {
							results[color]++;
						}
					}

					return (
						<div key={i} className="flex flex-col items-center gap-1 my-4">
							<p className="font-semibold">{players[i]}</p>
							<div className="flex gap-2">
								{Object.entries(results).map(([color, count]) => {
									if (count === 0) return null;

									return (
										<div key={color} className="flex items-center gap-1">
											<div
												className="size-6 rounded-full"
												style={{ background: color as string }}
											/>
											<p className="text-gray-700">×{count}</p>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			<button
				type="button"
				className="bg-blue-700 text-white px-5 py-2 rounded-full mt-3"
				onClick={() => reload()}
			>
				もう一度
			</button>
		</div>
	);
}

export default App;
