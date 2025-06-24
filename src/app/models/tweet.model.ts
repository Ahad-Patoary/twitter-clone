export interface Tweet {
  tweetID?: number;
  tweetTitle: string;
  contents: string;
  mediaURL: string;
  isReply?: number;
  replyToTweetID?: number | null;
  likes?: number;
  retweets?: number;
  createdAt: string;
  userID?: number;
}
