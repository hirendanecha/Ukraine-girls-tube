import { NgModule } from '@angular/core';

import { OnBoardingRoutingModule } from './on-boarding-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { OnBoardingComponent } from './on-boarding.component';

@NgModule({
  declarations: [OnBoardingComponent],
  imports: [OnBoardingRoutingModule, SharedModule],
})
export class OnBoardingModule {}
