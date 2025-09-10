import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaHistory, FaTrophy } from "react-icons/fa"; // 🏆 Trophy icon for scoreboard
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

  // modals
  const [showHistory, setShowHistory] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);

  const [scoreIncrement, setScoreIncrement] = useState({
    x: false,
    o: false,
    draws: false,
  });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
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
      setScoreIncrement({ ...scoreIncrement, [winner.toLowerCase()]: true });
      setTimeout(
        () =>
          setScoreIncrement({
            ...scoreIncrement,
            [winner.toLowerCase()]: false,
          }),
        1000
      );

      setGameHistory([...gameHistory, { board: squares, winner }]);
      setWinningLine(line);
      setIsDraw(false);
      toast.success(`🎉 Player ${winner} wins!`);
      setGameOver(true);
    } else if (isBoardFull(squares)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      setScoreIncrement({ ...scoreIncrement, draws: true });
      setTimeout(
        () => setScoreIncrement({ ...scoreIncrement, draws: false }),
        1000
      );

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
        className={`w-32 h-32 sm:w-44 sm:h-44 border-2 border-black text-4xl sm:text-6xl font-bold flex items-center justify-center
          ${
            isWinningSquare
              ? "bg-green-300"
              : isDraw
              ? "bg-blue-300"
              : "bg-white"
          } transition-colors duration-200`}
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

      {/* Icon container with both buttons */}
      <div className="flex gap-4 mb-4">
        <button
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => setShowHistory(true)}
          title="View Game History"
        >
          <FaHistory className="text-2xl text-black" />
        </button>

        <button
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => setShowScoreboard(true)}
          title="View Scoreboard"
        >
          <FaTrophy className="text-2xl text-black" />
        </button>
      </div>

      {/* Bigger Game Board */}
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
        <button
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
          onClick={resetGame}
          disabled={resetting}
        >
          {resetting ? "Resetting..." : "New Game"}
        </button>
      </div>

      {/* Scoreboard Modal */}
      <AnimatePresence>
        {showScoreboard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Scoreboard
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* X */}
                <div className="flex flex-col items-center p-3 bg-gray-100 rounded relative">
                  <span className="font-semibold text-black">X</span>
                  <span className="text-2xl sm:text-3xl font-bold text-black">
                    {scores.x}
                  </span>
                  {scoreIncrement.x && (
                    <motion.span
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -40 }}
                      transition={{ duration: 1.5 }}
                      className="absolute text-green-500 font-bold text-lg"
                    >
                      +1
                    </motion.span>
                  )}
                </div>
                {/* O */}
                <div className="flex flex-col items-center p-3 bg-gray-100 rounded relative">
                  <span className="font-semibold text-black">O</span>
                  <span className="text-2xl sm:text-3xl font-bold text-black">
                    {scores.o}
                  </span>
                  {scoreIncrement.o && (
                    <motion.span
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -40 }}
                      transition={{ duration: 1.5 }}
                      className="absolute text-green-500 font-bold text-lg"
                    >
                      +1
                    </motion.span>
                  )}
                </div>
                {/* Draws */}
                <div className="flex flex-col items-center p-3 bg-gray-100 rounded relative">
                  <span className="font-semibold text-black">Draws</span>
                  <span className="text-2xl sm:text-3xl font-bold text-black">
                    {scores.draws}
                  </span>
                  {scoreIncrement.draws && (
                    <motion.span
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -40 }}
                      transition={{ duration: 1.5 }}
                      className="absolute text-green-500 font-bold text-lg"
                    >
                      +1
                    </motion.span>
                  )}
                </div>
              </div>
              <button
                className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition-colors duration-200 mb-3"
                onClick={resetScores}
              >
                Reset Scores
              </button>
              <button
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setShowScoreboard(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game History Modal */}
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
