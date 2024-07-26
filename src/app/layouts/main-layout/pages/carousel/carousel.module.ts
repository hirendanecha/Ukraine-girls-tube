import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'src/app/@shared/shared.module';
import { CarouselComponent } from './carousel.component';
import { CarouselModuleRoutingModule  } from './carousel-routing.module';

@NgModule({
  declarations: [CarouselComponent],
  imports: [CarouselModuleRoutingModule , SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarouselModule {}
