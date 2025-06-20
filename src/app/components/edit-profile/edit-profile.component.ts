import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
} from '@nativescript/angular';

@Component({
  selector: 'EditProfile',
  templateUrl: './edit-profile.component.html',
  imports: [NativeScriptCommonModule, NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class EditProfileComponent {

}
