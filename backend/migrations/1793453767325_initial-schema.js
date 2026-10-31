
export const up = (pgm) => {
  // 1. Users
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    username: { type: "varchar(30)", notNull: true, unique: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    password_hash: { type: "varchar(255)", notNull: true },
    created_at: { type: "timestamp", default: pgm.func("NOW()") },
  });

  // 2. Refresh Tokens
  pgm.createTable("refresh_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    token_hash: { type: "varchar(255)", notNull: true },
    expires_at: { type: "timestamp", notNull: true },
    created_at: { type: "timestamp", default: pgm.func("NOW()") },
    revoked_at: { type: "timestamp" },
  });

  // 3. Games
  pgm.createTable("games", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    slug: { type: "varchar(100)", notNull: true, unique: true },
    title: { type: "varchar(100)", notNull: true },
    description: { type: "text" },
    is_active: { type: "boolean", default: true },
    created_at: { type: "timestamp", default: pgm.func("NOW()") },
  });

  // 4. Game Sessions
  pgm.createTable("game_sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    game_id: {
      type: "uuid",
      notNull: true,
      references: '"games"',
      onDelete: "CASCADE",
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "in_progress",
    },
    started_at: { type: "timestamp", default: pgm.func("NOW()") },
    ended_at: { type: "timestamp" },
  });

  pgm.addConstraint("game_sessions", "valid_session_status", {
    check: "status IN ('in_progress', 'completed', 'abandoned')",
  });

  // 5. Game Results
  pgm.createTable("game_results", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    session_id: {
      type: "uuid",
      notNull: true,
      unique: true,
      references: '"game_sessions"',
      onDelete: "CASCADE",
    },
    score: { type: "integer", notNull: true, default: 0 },
    is_completed: { type: "boolean", notNull: true, default: false },
    duration_seconds: { type: "integer", notNull: true, default: 0 },
    moves_count: { type: "integer", notNull: true, default: 0 },
    created_at: { type: "timestamp", default: pgm.func("NOW()") },
  });

  pgm.addConstraint("game_results", "valid_score", {
    check: "score >= 0",
  });

  pgm.addConstraint("game_results", "valid_duration", {
    check: "duration_seconds >= 0",
  });

  pgm.addConstraint("game_results", "valid_moves", {
    check: "moves_count >= 0",
  });

  // 6. Algorithms
  pgm.createTable("algorithms", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    game_id: {
      type: "uuid",
      notNull: true,
      references: '"games"',
      onDelete: "CASCADE",
    },
    name: { type: "varchar(100)", notNull: true },
    slug: { type: "varchar(100)", notNull: true },
    description: { type: "text" },
    created_at: { type: "timestamp", default: pgm.func("NOW()") },
  });

  pgm.addConstraint("algorithms", "unique_algorithm_per_game", {
    unique: ["game_id", "slug"],
  });

  // 7. Achievements
  pgm.createTable("achievements", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    slug: { type: "varchar(100)", notNull: true, unique: true },
    title: { type: "varchar(100)", notNull: true },
    description: { type: "text" },
    icon: { type: "varchar(100)" },
    created_at: { type: "timestamp", default: pgm.func("NOW()") },
  });

  // 8. User Achievements
  pgm.createTable("user_achievements", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    achievement_id: {
      type: "uuid",
      notNull: true,
      references: '"achievements"',
      onDelete: "CASCADE",
    },
    unlocked_at: { type: "timestamp", default: pgm.func("NOW()") },
  });

  pgm.addConstraint("user_achievements", "unique_user_achievement", {
    unique: ["user_id", "achievement_id"],
  });
};

// This is a baseline migration.
// It must not be rolled back because the tables already exist.
export const down = () => {
  throw new Error("The initial database baseline cannot be rolled back.");
};
