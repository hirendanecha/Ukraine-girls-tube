import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnBoardingComponent } from './on-boarding.component';

const routes: Routes = [
  {
    path: '',
    component: OnBoardingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnBoardingRoutingModule {}
