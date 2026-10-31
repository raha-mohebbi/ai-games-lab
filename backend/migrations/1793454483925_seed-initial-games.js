
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Seed initial games and their algorithms.
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = async (pgm) => {
  const games = [
    {
      slug: "maze-solver",
      title: "Maze Solver",
      description: "Find a path through a maze using search algorithms.",
    },
    {
      slug: "eight-queens",
      title: "Eight Queens",
      description: "Place eight queens on a chessboard without conflicts.",
    },
    {
      slug: "eight-puzzle",
      title: "Eight Puzzle",
      description: "Solve the sliding tile puzzle using search algorithms.",
    },
    {
      slug: "water-jug",
      title: "Water Jug",
      description: "Measure a target amount of water using two jugs.",
    },
    {
      slug: "river-crossing",
      title: "River Crossing",
      description: "Move the wolf, goat, and cabbage safely across the river.",
    },
    {
      slug: "tic-tac-toe",
      title: "Tic Tac Toe",
      description: "Play Tic Tac Toe against an AI opponent.",
    },
    {
      slug: "traveling-salesman",
      title: "Traveling Salesman",
      description: "Find a short route visiting every city exactly once.",
    },
    {
      slug: "sudoku",
      title: "Sudoku",
      description: "Solve Sudoku puzzles using constraint satisfaction.",
    },
  ];

  for (const game of games) {
    pgm.sql(`
      INSERT INTO games (slug, title, description)
      VALUES (
        '${game.slug}',
        '${game.title}',
        '${game.description}'
      )
      ON CONFLICT (slug) DO NOTHING;
    `);
  }

  const algorithms = [
    // Maze Solver
    ["maze-solver", "Breadth-First Search", "bfs", "Explores nodes level by level."],
    ["maze-solver", "Depth-First Search", "dfs", "Explores one path deeply before backtracking."],
    ["maze-solver", "A Star", "astar", "Uses path cost and heuristic to find a path."],
    ["maze-solver", "Greedy Best-First Search", "greedy", "Chooses nodes based on heuristic."],

    // Eight Queens
    ["eight-queens", "Backtracking", "backtracking", "Places queens while avoiding conflicts."],
    ["eight-queens", "Min Conflicts", "min-conflicts", "Repairs conflicts using local search."],

    // Eight Puzzle
    ["eight-puzzle", "Breadth-First Search", "bfs", "Finds a shortest solution for small state spaces."],
    ["eight-puzzle", "A Star", "astar", "Uses heuristics to guide the search."],
    ["eight-puzzle", "Greedy Best-First Search", "greedy", "Prioritizes states with lower heuristic values."],

    // Water Jug
    ["water-jug", "Breadth-First Search", "bfs", "Finds a shortest sequence of jug operations."],
    ["water-jug", "Depth-First Search", "dfs", "Explores possible jug operations recursively."],

    // River Crossing
    ["river-crossing", "Breadth-First Search", "bfs", "Finds the minimum number of safe crossings."],
    ["river-crossing", "Depth-First Search", "dfs", "Explores valid crossing sequences."],

    // Tic Tac Toe
    ["tic-tac-toe", "Minimax", "minimax", "Chooses optimal moves assuming an optimal opponent."],
    ["tic-tac-toe", "Alpha-Beta Pruning", "alpha-beta", "Optimizes minimax by pruning unnecessary branches."],

    // Traveling Salesman
    ["traveling-salesman", "Nearest Neighbor", "nearest-neighbor", "Builds a route by choosing the nearest unvisited city."],
    ["traveling-salesman", "2-opt", "two-opt", "Improves a route by swapping edges."],
    ["traveling-salesman", "Simulated Annealing", "simulated-annealing", "Searches for better routes using probabilistic moves."],

    // Sudoku
    ["sudoku", "Backtracking", "backtracking", "Searches for a valid assignment recursively."],
    ["sudoku", "Forward Checking", "forward-checking", "Removes invalid future candidates after each assignment."],
  ];

  for (const [gameSlug, name, slug, description] of algorithms) {
    pgm.sql(`
      INSERT INTO algorithms (game_id, name, slug, description)
      SELECT id, '${name}', '${slug}', '${description}'
      FROM games
      WHERE games.slug = '${gameSlug}'
      ON CONFLICT (game_id, slug) DO NOTHING;
    `);
  }
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = async (pgm) => {
  pgm.sql(`
    DELETE FROM algorithms
    WHERE game_id IN (
      SELECT id FROM games
      WHERE slug IN (
        'maze-solver',
        'eight-queens',
        'eight-puzzle',
        'water-jug',
        'river-crossing',
        'tic-tac-toe',
        'traveling-salesman',
        'sudoku'
      )
    );

    DELETE FROM games
    WHERE slug IN (
      'maze-solver',
      'eight-queens',
      'eight-puzzle',
      'water-jug',
      'river-crossing',
      'tic-tac-toe',
      'traveling-salesman',
      'sudoku'
    );
  `);
};
