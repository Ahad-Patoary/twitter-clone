import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
  NativeScriptFormsModule,
} from '@nativescript/angular';
import { DatabaseService } from '../../services/database.service';
import { Tweet } from '../../models/tweet.model';
import { UserService } from '../../services/auth-service.service';

@Component({
  selector: 'Compose',
  templateUrl: './compose.component.html',
  imports: [NativeScriptCommonModule, NativeScriptRouterModule, NativeScriptFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComposeComponent {
  tweetTitle: string = '';
  tweetText: string = '';
  mediaURL: string = '';
  confirmationMessage: string = '';

  constructor(private databaseService : DatabaseService, private userService : UserService) { }

  async postTweet() {
    const newTweet: Tweet = {
      tweetTitle: this.tweetTitle,
      contents: this.tweetText,
      mediaURL: this.mediaURL,
      isReply: 0,
      replyToTweetID: null,
      createdAt: new Date().toISOString().replace('T', ' '),
      userID: this.userService.getCurrentUserID(),
    }
    try {
      await this.databaseService.insertTweet(newTweet);

      this.confirmationMessage = 'Your Tweet has been Posted!';
      this.tweetTitle = '';
      this.tweetText = '';
      this.mediaURL = '';

      setTimeout(() => {
        this.confirmationMessage = '';
      }, 3000);
    } catch (error) {
      console.error('Error Posting Tweet:', error);
      this.confirmationMessage = 'Failed to Post Tweet';
    }
  }
}
