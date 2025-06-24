import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
} from '@nativescript/angular';
import { ComposeComponent } from '../compose/compose.component'

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
  imports: [NativeScriptCommonModule, NativeScriptRouterModule, ComposeComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeComponent {

}
