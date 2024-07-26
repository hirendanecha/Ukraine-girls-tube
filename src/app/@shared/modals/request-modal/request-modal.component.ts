import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.scss'],
})
export class RequestModalComponent implements OnInit{
  @Input() cancelButtonLabel: string | undefined = 'No';
  @Input() confirmButtonLabel: string | undefined = 'Yes';
  @Input() title: string | undefined = '';
  @Input() dataList: any = [];
  @Input() message: string | undefined ='Subscribe to send ashley your message now';

  customer: any;

  constructor(public activeModal: NgbActiveModal) {}
  
  ngOnInit(): void {
    this.customer = this.dataList
  }
}
