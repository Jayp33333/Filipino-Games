import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaHistory } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Tictactoe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // ✅ new modal state

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
    for (let [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const isBoardFull = (squares) => squares.every((sq) => sq !== null);

  const handleClick = (i) => {
    if (board[i] || gameOver || resetting) return;

    const squares = [...board];
    squares[i] = isXNext ? "X" : "O";
    setBoard(squares);

    const result = calculateWinner(squares);

    if (result) {
      const { winner, line } = result;
      setScores((prev) => ({
        ...prev,
        [winner.toLowerCase()]: prev[winner.toLowerCase()] + 1,
      }));
      setGameHistory([...gameHistory, { board: squares, winner }]);
      setWinningLine(line);
      setIsDraw(false);
      toast.success(`🎉 Player ${winner} wins!`);
      setGameOver(true);
    } else if (isBoardFull(squares)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      setGameHistory([...gameHistory, { board: squares, winner: "Draw" }]);
      setWinningLine([]);
      setIsDraw(true);
      toast.info("🤝 It's a draw!");
      setGameOver(true);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setResetting(true);
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setGameOver(false);
      setWinningLine([]);
      setIsDraw(false);
      setResetting(false);
    }, 1000);
  };

  const resetScores = () => {
    setScores({ x: 0, o: 0, draws: 0 });
    setGameHistory([]);
    setWinningLine([]);
    setIsDraw(false);
    toast.warn("Scores and history reset!");
    resetGame();
  };

  const renderSquare = (i) => {
    const isWinningSquare = winningLine.includes(i);
    return (
      <button
        className={`w-24 h-24 sm:w-32 sm:h-32 border-2 border-black text-2xl sm:text-4xl font-bold flex items-center justify-center
          ${
            isWinningSquare
              ? "bg-green-300"
              : isDraw
              ? "bg-blue-300"
              : "bg-white"
          } 
          hover:bg-gray-100 transition-colors duration-200`}
        onClick={() => handleClick(i)}
      >
        <AnimatePresence>
          {board[i] && !resetting && (
            <motion.span
              key={board[i] + i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.3, delay: i * 0.08 },
              }}
              className="block"
            >
              {board[i]}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  };

  const result = calculateWinner(board);
  const winner = result ? result.winner : null;
  const full = isBoardFull(board);
  const status = winner
    ? `Winner: ${winner}`
    : full && gameOver
    ? "It's a draw!"
    : `Next player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-black">
        Tic Tac Toe
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center">
        {/* Score Sheet */}
        <div className="score-sheet bg-white border-2 border-black p-6 rounded-lg shadow-lg w-full sm:w-auto">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">
            Score
          </h2>
          <div className="score-grid grid grid-cols-3 gap-4 mb-6">
            <div className="score-item flex flex-col items-center p-3 bg-gray-100 rounded">
              <span className="font-semibold text-black">X</span>
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {scores.x}
              </span>
            </div>
            <div className="score-item flex flex-col items-center p-3 bg-gray-100 rounded">
              <span className="font-semibold text-black">O</span>
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {scores.o}
              </span>
            </div>
            <div className="score-item flex flex-col items-center p-3 bg-gray-100 rounded">
              <span className="font-semibold text-black">Draws</span>
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {scores.draws}
              </span>
            </div>
          </div>
          <button
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition-colors duration-200"
            onClick={resetScores}
          >
            Reset Scores
          </button>
        </div>

        {/* Game Board */}
        <div className="flex flex-col items-center">
          <div className="game-board mb-6">
            <div className="grid grid-cols-3 gap-0">
              {renderSquare(0)}
              {renderSquare(1)}
              {renderSquare(2)}
            </div>
            <div className="grid grid-cols-3 gap-0">
              {renderSquare(3)}
              {renderSquare(4)}
              {renderSquare(5)}
            </div>
            <div className="grid grid-cols-3 gap-0">
              {renderSquare(6)}
              {renderSquare(7)}
              {renderSquare(8)}
            </div>
          </div>

          {/* Game Info */}
          <div className="text-center mb-6">
            <div className="text-lg sm:text-xl font-semibold mb-4 text-black">
              {status}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
                onClick={resetGame}
                disabled={resetting}
              >
                {resetting ? "Resetting..." : "New Game"}
              </button>

              {/* History Icon */}
              <button
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setShowHistory(true)}
                title="View Game History"
              >
                <FaHistory className="text-xl text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Game History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center text-black">
                Game History
              </h2>
              <ul className="divide-y divide-gray-300">
                {gameHistory.map((game, index) => (
                  <li key={index} className="py-2 text-black">
                    Game {index + 1}:{" "}
                    {game.winner === "Draw" ? "Draw" : `${game.winner} won`}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  onClick={() => setShowHistory(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Tictactoe;
