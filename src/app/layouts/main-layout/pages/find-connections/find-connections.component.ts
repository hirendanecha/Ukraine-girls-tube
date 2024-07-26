import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestModalComponent } from 'src/app/@shared/modals/request-modal/request-modal.component';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { UnsubscribeProfileService } from 'src/app/@shared/services/unsubscribe-profile.service';

@Component({
  selector: 'app-find-connections',
  templateUrl: './find-connections.component.html',
  styleUrls: ['./find-connections.component.scss'],
})
export class ConnectionsComponent implements OnInit {
  activeSlideIndex: number;
  profileList: any = [];
  currentIndex: number = 0;
  message: string = '';
  pagination: any = {
    page: 0,
    limit: 10,
  };
  profileId: number;
  constructor(
    private seoService: SeoService,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private modelService: NgbModal,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private unsubscribeProfileService: UnsubscribeProfileService,
    private socketService: SocketService,
    private toastService: ToastService
  ) {
    const data = {
      title: 'Organic-Connections',
      url: `${location.href}`,
      description: '',
    };
    this.seoService.updateSeoMetaData(data);
    this.profileId = +localStorage.getItem('profileId');
  }

  ngOnInit(): void {
    this.getProfile(this.pagination);
  }

  getProfile(paggination): void {
    this.spinner.show();
    const gender = this.tokenStorageService.getUser()?.gender;
    this.customerService
      .getProfiles(
        paggination.page,
        paggination.limit,
        this.profileId,
        String(gender)
      )
      .subscribe({
        next: (res: any) => {
          this.profileList = res.data;
          this.spinner.hide();
          // console.log('hello', res);
        },
        error: (err) => {
          this.spinner.hide();
        },
      });
  }

  getNextPageGroupPostsById(event: NgbSlideEvent): void {
    if (event.source === 'arrowRight') {
      ++this.currentIndex;
      // this.currentIndex = +event.current.split('-')[2];
      if (this.currentIndex === 10) {
        this.pagination.page = this.pagination.page + 1;
        this.getProfile(this.pagination);
      }
      // if (!group?.page) {
      //   group['page'] = this.pagination.page;
      // } else {
      //   group.page += 1;
      // }
    } else if (event.source === 'arrowLeft') {
      --this.currentIndex;
      // this.currentIndex = +event.current.split('-')[2];
    }
  }

  addDefaultImageIfNeeded(profile): any[] {
    if (!profile.profilePictures || profile.profilePictures.length === 0) {
      profile.profilePictures = [
        {
          imageUrl: '/assets/images/landingpage/OD-default-profile.png',
        },
      ];
    }
    return profile.profilePictures;
  }

  SendMessageInpt(dataList, type: string) {
    const modalRef = this.modelService.open(RequestModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.dataList = dataList;
    modalRef.componentInstance.title = type;
    // this.router.navigate(['/chats'])
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.inviteForChat(dataList, type);
      }
    });
  }

  inviteForChat(invite, type): void {
    this.socketService.createChatRoom(
      {
        profileId1: this.profileId,
        profileId2: invite?.profileId,
        type: type
      },
      (data: any) => {
        this.toastService.success('Invitation sent successfully');
        // console.log(data);
      }
    );
  }

  unsubscribe(post: any): void {
    // post['hide'] = true;
    console.log(post);

    this.unsubscribeProfileService
      .create({
        profileId: this.profileId,
        unsubscribeProfileId: post?.profileId,
      })
      .subscribe({
        next: (res) => {
          this.toastService.danger('block successfully');
          this.getProfile(this.pagination);
          return true;
        },
      });
  }
}
