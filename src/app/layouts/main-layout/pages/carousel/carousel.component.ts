import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscribeModalComponent } from 'src/app/@shared/modals/subscribe-model/subscribe-modal.component';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { FavoriteProfileService } from 'src/app/@shared/services/favorite.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  @ViewChild('slidesContainer') slidesContainer: ElementRef;
  @ViewChild('btnPrev') btnPrev!: ElementRef;
  @ViewChild('btnNext') btnNext!: ElementRef;

  imgWidth: number = 0;
  isSlideAnimating: boolean = false;
  dataList: any = [];
  pagination: any = {
    page: 0,
    limit: 10,
  };

  currentSlideIndex = 0;
  currentImageIndex: number = this.dataList.length - 1;
  profileId: number;

  constructor(
    private customerService: CustomerService,
    private modelService: NgbModal,
    private seoService: SeoService,
    private tokenStorageService: TokenStorageService,
    private favoriteProfileService: FavoriteProfileService,
    private toasterService: ToastService,
  ) {
    this.profileId = +localStorage.getItem('profileId');
    const data = {
      title: 'Organic-Carousel',
      url: `${location.href}`,
      description: '',
    };
    this.seoService.updateSeoMetaData(data);
  }

  ngOnInit(): void {
    this.currentImageIndex = this.dataList.length;
    this.getPictures(this.pagination);
  }

  prev() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.dataList.length - 1;
    }
  }

  next() {
    if (this.currentImageIndex < this.dataList.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }
  backFirst() {
    this.currentImageIndex = 0;
  }

  getPictures(paggination): void {
    const gender = this.tokenStorageService.getUser()?.gender;

    this.customerService
      .getPictures(paggination.page, paggination.limit, this.profileId, gender)
      .subscribe({
        next: (res: any) => {
          this.dataList = res.data;
        },
        error: (err) => {},
      });
  }

  isFirstSlide(): boolean {
    return this.currentSlideIndex === 0;
  }

  isLastSlide(): boolean {
    const slides = this.slidesContainer?.nativeElement?.children;

    return this.currentSlideIndex === slides?.length - 1;
  }
  subscribeBtn() {
    const modalRef = this.modelService.open(SubscribeModalComponent, {
      centered: true,
    });
    // modalRef.componentInstance.data = this.dataList;
  }

  addFavorite(dataList: any){
    const data = {
      profileId: dataList.profileId,
      likedByProfileId: this.profileId
    }
    this.favoriteProfileService.addFavoriteProfile(data).subscribe({
      next: (res) => {
        this.favoriteProfileService.fetchFavoriteProfiles();
        this.toasterService.success('Profile successfully added to your favorites');
        this.getPictures(this.pagination);
      }
    })
  }

  removeFavorite(dataList: any){
    this.favoriteProfileService.removeFavoriteProfile(this.profileId, dataList.profileId).subscribe({
      next: (res) => {
        this.favoriteProfileService.fetchFavoriteProfiles();
        this.toasterService.danger('Profile successfully remove from your favorites');
        this.getPictures(this.pagination);
      }
    })
  }
}
