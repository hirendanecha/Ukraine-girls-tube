import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subscribe-modal',
  templateUrl: './subscribe-modal.component.html',
  styleUrls: ['./subscribe-modal.component.scss'],
})
export class SubscribeModalComponent implements OnInit{
  @Input() cancelButtonLabel: string | undefined = 'Cancel';
  @Input() confirmButtonLabel: string | undefined = 'Confirm';
  @Input() title: string | undefined = 'UkrainianGirls.tube';
  @Input() dataList: any = [];
  @Input() message: string | undefined ='Subscribe to send ashley your message now';

  customer: any;

  constructor(public activeModal: NgbActiveModal) {}
  
  ngOnInit(): void {
    this.customer = this.dataList
  }
}
