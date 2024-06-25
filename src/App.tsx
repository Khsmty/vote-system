import { useState } from 'react';

type Color =
  | 'red'
  | 'yellow'
  | 'orange'
  | 'green'
  | 'blue'
  | 'gainsboro'
  | 'purple'
  | 'black';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentVote, setCurrentVote] = useState(1);
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
    if (currentVote === 6) return;

    const tmp = [...tmpVote, color];

    if (
      (currentPlayer !== 5 && currentVote <= 5) ||
      (currentPlayer === 5 && currentVote <= 4)
    ) {
      let next = currentVote + 1;
      if (next === currentPlayer) {
        tmp.push(null);
        next++;
      }

      setTmpVote(tmp);
      setCurrentVote(next);
    }
  }

  function undo() {
    if (
      (currentPlayer === 0 && currentVote === 1) ||
      (currentPlayer !== 0 && currentVote === 0)
    ) {
      return alert('これ以上は取り消せません');
    }

    const tmp = [...tmpVote];
    const last = tmp.pop();

    if (last === null) {
      tmp.pop();
    }

    setTmpVote(tmp);

    const next = currentVote - 1;
    setCurrentVote(next === currentPlayer ? next - 1 : next);
  }

  function sendPlayers() {
    if (players.some((p) => !p)) {
      return alert('全てのプレイヤー名を入力してください');
    }

    setStatus(1);
  }

  function nextPlayer() {
    setVotes([...votes, tmpVote]);

    if (currentPlayer === 5) return setStatus(2);

    setTmpVote([]);
    setCurrentPlayer(currentPlayer + 1);
    setCurrentVote(0);
  }

  function reload() {
    if (!window.confirm('結果をリセットしてもよろしいですか？')) return;

    setCurrentPlayer(0);
    setCurrentVote(1);
    setStatus(0);
    setTmpVote([null]);
    setPlayers([null, null, null, null, null, null]);
    setVotes([]);
  }

  if (status === 0) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center">
        <p className="mb-6 text-3xl font-bold">プレイヤー名入力</p>

        {[0, 1, 2, 3, 4, 5].map((i) => {
          return (
            <div key={i} className="my-2 flex items-center gap-2">
              <p>Player {i + 1} …</p>
              <input
                type="text"
                value={players[i] || ''}
                onChange={(e) => {
                  const newPlayers = [...players];
                  newPlayers[i] = e.target.value;
                  setPlayers(newPlayers);
                }}
                className="rounded border border-gray-400 px-2 py-1"
              />
            </div>
          );
        })}

        <button
          type="button"
          className="mt-5 rounded-full bg-blue-700 px-5 py-2 text-white"
          onClick={() => sendPlayers()}
        >
          スタート
        </button>
      </div>
    );
  }

  if (status === 1) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center">
        <p className="text-3xl font-bold">
          {players[currentPlayer]} さんの番です
        </p>

        <div className="my-5 flex flex-col items-end text-4xl">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            if (i === currentPlayer) return;
            return (
              <div key={i} className="my-2 flex items-center gap-2">
                <p>{players[i]} …</p>
                <div
                  className={`size-12 rounded-full ${currentVote === i ? 'animate-pulse border border-black' : ''}`}
                  style={{
                    background: tmpVote[i] as string,
                  }}
                />
              </div>
            );
          })}
        </div>

        {currentVote !== 6 && (
          <>
            <div className="mb-2 mt-5 grid grid-cols-4 gap-4">
              {(
                [
                  'red',
                  'yellow',
                  'orange',
                  'green',
                  'blue',
                  'gainsboro',
                  'purple',
                  'black',
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
          className="mt-3 rounded-full border border-gray-500 px-5 py-2"
          onClick={() => undo()}
        >
          取り消し
        </button>

        {currentVote === 6 && (
          <button
            type="button"
            className="mt-3 rounded-full bg-blue-700 px-5 py-2 text-white"
            onClick={() => nextPlayer()}
          >
            {currentPlayer === 5 ? '結果を見る' : '次のプレイヤーへ'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center py-10">
      <p className="text-3xl font-bold">集計結果</p>

      <div className="my-6 text-2xl space-y-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <p className="font-semibold">{players[i]}</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {[0, 1, 2, 3, 4, 5].map((j) => {
                if (i === j) return null;

                return (
                  <div
                    key={j}
                    className="rounded-full px-4 py-1 text-sm"
                    style={{
                      background: votes[j][i] as string,
                      color: !['yellow', 'gainsboro'].includes(
                        votes[j][i] as string,
                      )
                        ? 'white'
                        : 'black',
                    }}
                  >
                    {players[j]}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 rounded-full bg-blue-700 px-5 py-2 text-white"
        onClick={() => reload()}
      >
        もう一度
      </button>
    </div>
  );
}

export default App;
