export const findLessCostPath = (board: number[][]): number => {
  const n = board.length;
  const m = board[0].length;

  // Initialize the new array with the first element of the original array
  const dp = [[board[0][0]]];

  // Fill the new array with the minimum cost to reach each cell
  for (let i = 1; i < n; i++) {
    dp[i] = [];
    for (let j = 0; j < m; j++) {
      const left = dp[i - 1][j - 1] !== undefined ? dp[i - 1][j - 1] : Infinity;
      const up = dp[i - 1][j] !== undefined ? dp[i - 1][j] : Infinity;
      const right = dp[i - 1][j + 1] !== undefined ? dp[i - 1][j + 1] : Infinity;
      dp[i][j] = board[i][j] + Math.min(left, up, right);
    }
  }

  // Find the minimum cost to reach the last element of the original array
  let minCost = Infinity;
  for (let j = 0; j < m; j++) {
    minCost = Math.min(minCost, dp[n - 1][j]);
  }

  return minCost;
}