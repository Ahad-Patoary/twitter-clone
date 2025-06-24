import * as Sqlite from "nativescript-sqlite";
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Tweet } from '../models/tweet.model';

const isDev = global.isDevEnvironment ?? true; // Set this to false in production
const dbName = isDev ? "twitter_clone_dev.db" : "twitter_clone.db";

@Injectable({ providedIn: 'root' })
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

      const count = Array.isArray(row) ? row[0] : row?.count;

      if (count === 0) {
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
          if (err) {
            console.error("Database error:", err);
            reject(err);
          } else if (row) {
            const user: User = {
              userID: row[0],
              username: row[1],
              firstName: row[2],
              lastName: row[3],
              email: row[4],
              password: row[5],
              bio: row[6],
              profileImage: row[7],
              createdAt: row[8]
            };
            resolve(user);
          } else {
            resolve(null);
          }
        }
      );
    });
  }


  createUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.execSQL(
        `INSERT INTO User (username, firstName, lastName, email, password, bio, profileImage, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.username,
          user.firstName,
          user.lastName,
          user.email,
          user.password,
          user.bio,
          user.profileImage,
          user.createdAt
        ],
        (err) => {
          if (err) {
            console.error("Error inserting user:", err);
            reject(err);
          } else {
            console.log("User created successfully.");
            resolve();
          }
        }
      );
    });
  }

  deleteUserById(userID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.execSQL(
        `DELETE FROM User WHERE userID = ?`,
        [userID],
        (err) => {
          if (err) {
            console.error("Error deleting user:", err);
            reject(err);
          } else {
            console.log(`User with ID ${userID} deleted.`);
            resolve();
          }
        }
      );
    });
  }


  logAllUsers(): void {
    this.db.all(`SELECT * FROM User`, [], (err, rows) => {
      if (err) {
        console.error("Error fetching users:", err);
      } else {
        if (rows.length === 0) {
          console.log("User table is empty.");
        } else {
          console.log("All users in the User table:");
          rows.forEach((row, index) => {
            console.log(`User ${index + 1}:`, row);
          });
        }
      }
    });
  }



  insertTweet(tweet: Tweet): Promise<void> {
    return new Promise((resolve, reject) => {
      const {
        tweetTitle,
        contents,
        mediaURL,
        isReply = 0,
        replyToTweetID = null,
        createdAt,
        userID
      } = tweet;

      this.db.execSQL(
        `INSERT INTO Tweet (tweetTitle, contents, mediaUrl, isReply, replyToTweetID, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [tweetTitle, contents, mediaURL, isReply, replyToTweetID, createdAt],
        (err, result) => {
          if (err) {
            console.error("Error inserting tweet:", err);
            reject(err);
          } else {
            // Get the last inserted tweet ID
            this.db.get("SELECT last_insert_rowid() AS tweetID", [], (err, row) => {
              if (err) {
                console.error("Error retrieving tweet ID:", err);
                reject(err);
              } else {
                const tweetID = row.tweetID;

                if (userID) {
                  this.db.execSQL(
                    `INSERT INTO UserTweet (userID, tweetID, createdAt)
                     VALUES (?, ?, ?)`,
                    [userID, tweetID, createdAt],
                    (err) => {
                      if (err) {
                        console.error("Error linking tweet to user:", err);
                        reject(err);
                      } else {
                        resolve();
                      }
                    }
                  );
                } else {
                  resolve();
                }
              }
            });
          }
        }
      );
    });
  }

  clearTweetTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.execSQL(`DELETE FROM Tweet`, [], (err) => {
        if (err) {
          console.error("Error clearing Tweet table:", err);
          reject(err);
        } else {
          console.log("Tweet table cleared.");
          resolve();
        }
      });
    });
  }

}

