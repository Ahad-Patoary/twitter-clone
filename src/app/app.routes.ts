import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'compose',
    loadComponent: () =>
      import('./components/compose/compose.component').then(m => m.ComposeComponent)
  },
  {
    path: 'tweet/:tweetID',
    loadComponent: () =>
      import('./components/tweet/tweet.component').then(m => m.TweetComponent)
  },
  {
    path: 'profile/:userID',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./components/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(m => m.SignUpComponent)
  },
];
