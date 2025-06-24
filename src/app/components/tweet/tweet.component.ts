import { Component, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
} from '@nativescript/angular';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/auth-service.service';

@Component({
  selector: 'Tweet',
  templateUrl: './tweet.component.html',
  imports: [NativeScriptCommonModule, NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class TweetComponent {
  tweetFeed: any[] = [];
  userID: number;

  constructor(private databaseService : DatabaseService, private userService : UserService) {
    this.userID = this.userService.getCurrentUserID();
  }

  ngOnInit(): void {
    this.databaseService.logAllTweets();
    this.databaseService.logAllUserTweets();
    this.loadUserTweets();
  }

  loadUserTweets(): void {
    this.databaseService.getUserTweets(this.userID)
    .then(tweets => {
      console.log("Tweets loaded into tweetFeed:", tweets)
      this.tweetFeed = tweets;
    })
    .catch(error => {
      console.error('Failed to Load Tweet', error);
    });
  }
}
