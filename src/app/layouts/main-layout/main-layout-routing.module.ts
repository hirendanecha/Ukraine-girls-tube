import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthenticationGuard } from 'src/app/@shared/guards/authentication.guard';
import { AppointmentCallComponent } from 'src/app/@shared/components/appointment-call/appointment-call.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true,
        },
      },
      {
        path: 'on-boarding',
        loadChildren: () =>
          import('./pages/on-boarding/on-boarding.module').then(
            (m) => m.OnBoardingModule
          ),
        data: {
          // isShowLeftSideBar: true,
        },
        // canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'connection',
        loadChildren: () =>
          import('./pages/find-connections/find-connections.module').then(
            (m) => m.ConnectionsModule
          ),
        data: {
          isShowLeftSideBar: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'carousel',
        loadChildren: () =>
          import('./pages/carousel/carousel.module').then(
            (m) => m.CarouselModule
          ),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'community',
        loadChildren: () =>
          import('./pages/communities/communities.module').then(
            (m) => m.CommunitiesModule
          ),
        data: {
          isShowLeftSideBar: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'promote-you',
        loadChildren: () =>
          import('./pages/freedom-page/freedom-page.module').then(
            (m) => m.FreedomPageModule
          ),
        data: {
          isShowLeftSideBar: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
        data: {
          isShowLeftSideBar: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./pages/notifications/notification.module').then(
            (m) => m.NotificationsModule
          ),
        data: {
          isShowLeftSideBar: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'research',
        loadChildren: () =>
          import('./pages/research/research.module').then(
            (m) => m.ResearchModule
          ),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true,
          isShowResearchLeftSideBar: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'request-video-call',
        loadChildren: () =>
          import(
            'src/app/layouts/main-layout/pages/healing-practitioner-registration/healing-practitioner-registration.module'
          ).then((m) => m.HealingPractitionerRegistrationModule),
        data: {
          isShowLeftSideBar: false,
          isShowRightSideBar: false,
          isShowResearchLeftSideBar: false,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'chats',
        loadChildren: () =>
          import('./pages/profile-chats/profile-chats.module').then(
            (m) => m.ProfileChartsModule
          ),
        data: {
          isShowLeftSideBar: false,
          isShowRightSideBar: false,
          isShowResearchLeftSideBar: false,
          isShowChatModule: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'dating-call/:callId',
        component: AppointmentCallComponent,
        data: {
          isShowLeftSideBar: false,
          isShowRightSideBar: false,
          isShowResearchLeftSideBar: false,
          isShowChatListSideBar: false,
          isShowChatModule: true,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainLayoutRoutingModule {}
