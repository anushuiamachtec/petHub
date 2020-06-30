import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { ErrorPageComponent } from './error-page/error-page.component';
import { HomePage } from './dashboard/home.page';
// import { createProfilePage } from './Registration/pet/pet-Registration/creatrprofile.page';

 const routes: Routes = [

  { path: 'home',redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadChildren: () => import('./dashboard/home.module').then(m => m.HomePageModule) },
  {
    path: 'auth',
    loadChildren: () => import('./Login/home/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./Login/signIn/login.module').then(m => m.LoginPageModule)
  },{
    path: 'login-pin',
    loadChildren: () => import('./Login/login_pin/login_pin.module').then(m => m.loginPinpageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./Registration/Owner/personalDetails/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'signup-next',
    loadChildren: () => import('./Registration/Owner/AddressDetails/signup-next.module').then(m => m.SignupNextPageModule)
  },
  {
    path: 'companyClause',
    loadChildren: () => import('./Registration/Owner/company-clause/company-clause.module').then(m => m.CompanyClausePageModule)
  },
  {
    path: 'EditOwnerProfile',
    loadChildren: () => import('./Registration/EditProfile/updateOwnerProfile/editOwnerInfo.module').then(m => m.editOwnerInfoModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./Login/changePassword/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./Login/forgetPassword/forget-password.module').then(m => m.ForgetPasswordPageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./Login/verification/verification.module').then(m => m.VerificationPageModule)
  },
  {
    path: 'auto-location',
    loadChildren: () => import('./auto-location/auto-location.module').then(m => m.AutoLocationPageModule)
  },
  {
    path: 'myMatches',
    loadChildren: () => import('./myMatches/myMatches.module').then(m => m.myMatchesModule)
  },
  {
    path: 'singleProfile',
    loadChildren: () => import('./singleProfile/singleProfile.module').then(m => m.singleProfileModule)
  },
  {
    path: 'Notifications',
    loadChildren: () => import('./Notifications/Notifications.module').then(m => m.NotificationsModule)
  },
  {
    path: 'searchPets',
    loadChildren: () => import('./searchPets/searchPets.module').then(m => m.searchPetsModule)
  },
   {
    path: 'Message',
    loadChildren: () => import('./Messages/Message_Servie.module').then(m => m.MessageServieModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./inbox-chat/inbox-chat.module').then( m => m.InboxChatPageModule)
  },
  {
    path: 'ViewTicket',
    loadChildren: () => import('./Support/viewTicket/ticket-detail.module').then( m=> m.TicketDetailPageModule)
  },
  {
    path: 'Ticket',
    loadChildren: () => import('./Support/Ticket/ticket.module').then( m=> m.TicketPageModule)
  },
  {
    path: 'createTicket',
    loadChildren: () => import('./Support/createTicket/ticket-form.module').then( m=> m.TicketFormPageModule)
  },
  {
    path: 'showPetRegistration',
    loadChildren: () => import('./Registration/Pet/ShowPopup/show.module').then( m=> m.showProfileModule)
  },
  {
    path: 'petRegistraion',
    loadChildren: () => import('./Registration/Pet/registerPet/petDetails/createProfile.module').then( m=> m.createProfileModule)
  },
  {
    path: 'UploadProfile',
    loadChildren: () => import('./Registration/Pet/registerPet/uploadImage/uploadProfile.module').then( m=> m.uploadProfileModule)
  },
  {
    path: 'viewPetProfile',
    loadChildren: () => import('./Registration/EditProfile/updatePetProfile/uploadProfile.module').then( m=> m.uploadProfileModule)
  },
  
]; 
/*
const routes: Routes = [ {
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
}, {
  path: 'dashboard',
  component: HomePage,
  children: [ {
    path: 'users',
    loadChildren: './dashboard/users/users.module#UsersModule'
  },
{
    path: 'MessageServie',
    loadChildren:'./Message_Servie/Message_Servie.module#MessageServieModule'
  },
    {
    path: 'searchPets',
    loadChildren:'./searchPets/searchPets.module#searchPetsModule'
  },
   {
    path: 'petRegistraion',
    loadChildren:'./Registration/pet/pet-Registration/createProfile.module#createProfileModule'
  },
  ]
},
];*/
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
