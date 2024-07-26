import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { PostService } from 'src/app/@shared/services/post.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from 'src/app/@shared/modals/edit-profile/edit-profile-modal.component';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  customer: any = {};
  // customer: Customer = new Customer();
  customerPostList: any = [];
  userId = '';
  profilePic: any = {};
  coverPic: any = {};
  profileId: number;
  activeTab = 0;
  communityList = [];
  communityId = '';
  isExpand = false;
  pdfList: any = [];
  profilePreview: boolean = false;
  displayImage = '';

  constructor(
    private modalService: NgbActiveModal,
    private router: Router,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService,
    public sharedService: SharedService,
    private communityService: CommunityService,
    public breakpointService: BreakpointService,
    private postService: PostService,
    private seoService: SeoService,
    private modal: NgbModal
  ) {
    this.profileId = +this.tokenStorage.getUser()?.profileId;
    this.router.events.subscribe((event: any) => {
      const id = event?.routerEvent?.url.split('/')[3];
      // this.profileId = id
      if (id) {
        this.getProfile(id);
      } 
    });
    if (!this.router.routerState.snapshot.url.includes('settings/view-profile')) {
      this.getProfile(this.profileId);
    }
    // this.profileId = this.tokenStorage.getUser()?.profileId;
    // console.log(this.profileId);
    // if (this.profileId) {
    //   this.getProfile(this.profileId);
    // }
  }

  profilePre() {
    this.profilePreview = !this.profilePreview
  }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate([`/login`]);
    }
    this.modalService.close();
  }

  ngAfterViewInit(): void {}

  getProfile(id): void {
    this.spinner.show();
    this.customerService.getProfile(id).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.data) {
          this.customer = res.data;
          this.userId = res.data?.UserID;
          const data = {
            title: this.customer?.userName || 'ukrainiangirls.tube',
            url: `${environment.webUrl}settings/view-profile/${this.customer?.Id}`,
            description: '',
            image: this.customer?.profilePictures?.[0]?.imageUrl,
          };
          this.seoService.updateSeoMetaData(data);
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  getCommunities(): void {
    this.spinner.show();
    this.communityList = [];
    this.communityService
      .getCommunityByUserId(this.profileId, 'community')
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            // this.communityList = res.data;
            res.data.forEach((element) => {
              if (element.Id && element.isApprove === 'Y') {
                this.communityList.push(element);
              }
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }

  goToCommunityDetails(community: any): void {
    this.router.navigate(['connection ']);
  }

  openDropDown(id) {
    this.communityId = id;
    if (this.communityId) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }
  openEditProfile(): void {
    this.router.navigate([`settings/edit-profile/${this.profileId}`]);
  }

  ngOnDestroy(): void {
    this.communityList = [];
  }

  getPdfs(): void {
    this.postService.getPdfsFile(this.customer.Id).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res) {
          res.map((e: any) => {
            e.pdfName = e.pdfUrl.split('/')[3].replaceAll('%', ' ');
          });
          this.pdfList = res;
          console.log(this.pdfList);
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  viewUserPost(id) {
    // this.router.navigate([`post/${id}`]);
    window.open(`post/${id}`, '_blank');
  }

  downloadPdf(pdf): void {
    const pdfLink = document.createElement('a');
    pdfLink.href = pdf;
    // window.open(pdf);
    // pdfLink.download = "TestFile.pdf";
    pdfLink.click();
  }

  imageChange(img: any) {
    this.displayImage = img;
  }

  getStatus(value: string | null): string {
    if (value === 'Y') {
      return 'Yes';
    } else if (value === 'N') {
      return 'No';
    } else if (value === null) {
      return `It Does Not Matter`;
    } else {
      return value;
    }
  }

  openModel(field: string): void {
    const modalRef = this.modal.open(EditProfileModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = field;
    modalRef.result.then((res) => {
      if (res === 'success') {
        // this.customer = {};
        // this.getProfile(+this.profileId);
        setTimeout(() => this.getProfile(+this.profileId), 100);
      }
    })
  }
}
