import * as Sqlite from "nativescript-sqlite";

const isDev = global.isDevEnvironment ?? true; // Set this to false in production
const dbName = isDev ? "twitter_clone_dev.db" : "twitter_clone.db";

export class DatabaseService {
  private db: any;

  constructor() {
    new Sqlite(dbName, (err, db) => {
      if (err) {
        console.error("SQLite DB error:", err);
      } else {
        this.db = db;
        this.initTables();

        if (isDev) {
          this.seedDummyData(); // Only seed in development
        }
      }
    });
  }

  private initTables() {
    this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS User (
        userID INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        password TEXT,
        bio TEXT,
        profileImage TEXT,
        createdAt TEXT
      );
    `);

    this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS Tweet (
        tweetID INTEGER PRIMARY KEY AUTOINCREMENT,
        tweetTitle TEXT,
        contents TEXT,
        mediaUrl TEXT,
        isReply INTEGER DEFAULT 0,
        replyToTweetID INTEGER,
        likes INTEGER DEFAULT 0,
        retweets INTEGER DEFAULT 0,
        createdAt TEXT,
        FOREIGN KEY (replyToTweetID) REFERENCES Tweet(tweetID)
      );
    `);

    this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS UserTweet (
        userID INTEGER,
        tweetID INTEGER,
        createdAt TEXT,
        isRetweet INTEGER DEFAULT 0,
        originalTweetID INTEGER,
        PRIMARY KEY (userID, tweetID),
        FOREIGN KEY (userID) REFERENCES User(userID),
        FOREIGN KEY (tweetID) REFERENCES Tweet(tweetID),
        FOREIGN KEY (originalTweetID) REFERENCES Tweet(tweetID)
      );
    `);

    this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS TweetReply (
        replyID INTEGER PRIMARY KEY AUTOINCREMENT,
        tweetID INTEGER,
        userID INTEGER,
        tweetTitle TEXT,
        content TEXT,
        createdAt TEXT,
        FOREIGN KEY (tweetID) REFERENCES Tweet(tweetID),
        FOREIGN KEY (userID) REFERENCES User(userID)
      );
    `);
  }

  private seedDummyData() {
    this.db.get("SELECT COUNT(*) AS count FROM User", [], (err, row) => {
      if (err) {
        console.error("Error checking User table:", err);
        return;
      }

      if (row.count === 0) {
        this.db.execSQL(`
          INSERT INTO User (username, firstName, lastName, email, password, bio, profileImage, createdAt)
          VALUES
            ('johndoe', 'John', 'Doe', 'john@example.com', 'password123', 'Just a test user.', '', datetime('now')),
            ('janedoe', 'Jane', 'Doe', 'jane@example.com', 'password123', 'Another test user.', '', datetime('now'));
        `);

        this.db.execSQL(`
          INSERT INTO Tweet (tweetTitle, contents, mediaUrl, createdAt)
          VALUES
            ('Hello World', 'This is my first tweet!', '', datetime('now')),
            ('Another Day', 'Just testing the app.', '', datetime('now'));
        `);

        this.db.execSQL(`
          INSERT INTO UserTweet (userID, tweetID, createdAt)
          VALUES
            (1, 1, datetime('now')),
            (2, 2, datetime('now'));
        `);

        console.log("Dummy data seeded.");
      } else {
        console.log("Dummy data already exists. Skipping seed.");
      }
    });
  }
  getUserByCredentials(username: string, password: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM User WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        }
      );
    });
  }
}
