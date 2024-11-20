import React, { useEffect, useState } from "react";
import "./App.css";

type Cell = null | string;

const App: React.FC = () => {
  const [N, setN] = useState<number>(3);
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: N * N }, () => null),
  );
  const [turn, setTurn] = useState<string>("O");
  const [updateIndex, setUpdateIndex] = useState<number>(-1);
  const [gameStatus, setGameStatus] = useState<number>(0);
  const [endMessage, setEndMessage] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  /*
    Checks the board game status.
    Returns:
      0 - resume
      1 - current turn is winner
      2 - draw

    Algorithm inspired by https://stackoverflow.com/questions/1056316/algorithm-for-determining-tic-tac-toe-game-over
    Modified to work on an array instead of matrix.
  */
  const checkGameStatus = (index: number): number => {
    const val = cells[index];
    const col = index % N;
    const row = Math.floor(index / N);
    let isWin = false;

    // check col
    for (let i = 0; i < N; i++) {
      if (cells[col + i * N] !== val) break;
      if (i === N - 1) isWin = true;
    }

    // check row
    if (!isWin) {
      for (let i = 0; i < N; i++) {
        if (cells[row * N + i] !== val) break;
        if (i === N - 1) isWin = true;
      }
    }

    // check diag
    if (col === row && !isWin) {
      for (let i = 0; i < N; i++) {
        if (cells[i * N + i] !== val) break;
        if (i === N - 1) isWin = true;
      }
    }

    // check anti diag
    if (col + row === N - 1 && !isWin) {
      for (let i = 0; i < N; i++) {
        if (cells[col + (N - 1) * i] !== val) break;
        if (i === N - 1) isWin = true;
      }
    }

    if (isWin) return 1;

    // check if board is filled up
    const anyEmpty = cells.reduce(
      (accum, curr) => (accum = accum || curr === null),
      false,
    );
    if (!anyEmpty) return 2;
    return 0;
  };

  const switchTurn = () => setTurn((prev) => (prev === "O" ? "X" : "O"));

  const handleCellUpdate = (index: number) => {
    setGameStarted(true);
    setCells((prev) => {
      prev[index] = turn;
      return [...prev];
    });
    setUpdateIndex(index);
  };

  const handleResetGame = () => {
    setGameStarted(false);
    setCells(Array.from({ length: N * N }, () => null));
    setGameStatus(0);
    setEndMessage("");
    switchTurn();
    setUpdateIndex(-1);
  };

  useEffect(() => {
    setCells(Array.from({ length: N * N }, () => null));
  }, [N]);

  useEffect(() => {
    if (updateIndex === -1) return;
    const res = checkGameStatus(updateIndex);
    if (res === 0) {
      switchTurn();
    } else if (res === 1) {
      setGameStatus(1);
      setEndMessage(`Player ${turn} wins`);
    } else {
      setGameStatus(2);
      setEndMessage("Draw.");
    }
  }, [cells]);

  return (
    <div className="container__app">
      <h1 className="text__title">Tic Tac Toe</h1>
      <div className="container__game_status_window">
        {gameStatus === 0 && (
          <h2 className="text__subtitle">CurrentPlayer: {turn}</h2>
        )}
        {gameStatus !== 0 && (
          <>
            <p
              className={`text__status ${
                gameStatus === 1 ? "text__green" : "text__red"
              }`}
            >
              {endMessage}
            </p>
            <button className="button__reset" onClick={handleResetGame}>
              Reset
            </button>
          </>
        )}

        {!gameStarted && (
          <div>
            <p>
              Grid Size: {N}x{N}
            </p>
            <input
              type="range"
              min="3"
              max="10"
              value={N}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className={`container__grid_${N}`}>
        {cells.map((cell, index) => (
          <button
            key={index}
            className="cell"
            disabled={cell !== null || gameStatus !== 0}
            onClick={() => handleCellUpdate(index)}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
