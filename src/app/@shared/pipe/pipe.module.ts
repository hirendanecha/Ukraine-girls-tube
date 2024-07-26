import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';
import { GetImageUrlPipe } from './get-image-url.pipe';
import { CommaSeperatePipe } from './comma-seperate.pipe';
import { DateDayPipe } from '../services/date-day.pipe';
import { NoSanitizePipe } from './sanitize.pipe';
import { MessageTimePipe } from './message-time.pipe';
import { HighlightPipe } from './hightlight-text.pipe';
import { SearchFilterPipe } from './search-filter.pipe';

@NgModule({
  declarations: [
    SafePipe,
    GetImageUrlPipe,
    CommaSeperatePipe,
    DateDayPipe,
    NoSanitizePipe,
    MessageTimePipe,
    HighlightPipe,
    SearchFilterPipe
  ],
  imports: [CommonModule],
  exports: [
    SafePipe,
    GetImageUrlPipe,
    CommaSeperatePipe,
    DateDayPipe,
    NoSanitizePipe,
    MessageTimePipe,
    HighlightPipe,
    SearchFilterPipe
  ],
})
export class PipeModule {}
