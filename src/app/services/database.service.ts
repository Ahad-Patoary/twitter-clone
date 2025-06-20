import * as Sqlite from "nativescript-sqlite";

export class DatabaseService {
  private db: any;

  constructor() {
    new Sqlite("twitter_clone.db", (err, db) => {
      if (err) {
        console.error("SQLite DB error:", err);
      } else {
        this.db = db;
        this.initTables();
        this.seedDummyData(); // Call after tables are initialized
      }
    });
  }

  private initTables() {
    // User Table
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

    // Tweet Table
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

    // UserTweet Join Table
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

    // TweetReply Table
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
    // Check if users already exist
    this.db.get("SELECT COUNT(*) AS count FROM User", [], (err, row) => {
      if (err) {
        console.error("Error checking User table:", err);
        return;
      }

      if (row.count === 0) {
        // Insert dummy users
        this.db.execSQL(`
          INSERT INTO User (username, firstName, lastName, email, password, bio, profileImage, createdAt)
          VALUES
            ('johndoe', 'John', 'Doe', 'john@example.com', 'password123', 'Just a test user.', '', datetime('now')),
            ('janedoe', 'Jane', 'Doe', 'jane@example.com', 'password123', 'Another test user.', '', datetime('now'));
        `);

        // Insert dummy tweets
        this.db.execSQL(`
          INSERT INTO Tweet (tweetTitle, contents, mediaUrl, createdAt)
          VALUES
            ('Hello World', 'This is my first tweet!', '', datetime('now')),
            ('Another Day', 'Just testing the app.', '', datetime('now'));
        `);

        // Link tweets to users
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
}
