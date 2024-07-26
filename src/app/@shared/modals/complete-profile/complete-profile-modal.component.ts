import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { SharedService } from '../../services/shared.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { UploadFilesService } from '../../services/upload-files.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-complete-profile-modal',
  templateUrl: './complete-profile-modal.component.html',
  styleUrls: ['./complete-profile-modal.component.scss'],
})
export class CompleteProfileModalComponent implements OnInit, AfterViewInit {
  @Input() cancelButtonLabel: string | undefined = 'Cancel';
  @Input() confirmButtonLabel: string | undefined = 'Done';
  @Input() title: string | undefined = 'Complete All Steps';
  @Input() steps: string[] = [];
  @Input() message: string | undefined;
  @Input() progressValue: number | undefined = 25;

  profilePics: string[] = [];
  profileImg: any = {
    file: null,
    url: '',
  };
  statusofRelation: string = '';
  statusofBody: string = '';
  selectedInterests: number[] = [];
  removeInterestList: number[] = [];
  interests: any[];
  profileId: number;
  updateUserData: any = {};
  idealText: string = '';
  currentStepIndex: number = 0;
  currentImageIndex: number = this.profilePics.length - 1;

  constructor(
    public activeModal: NgbActiveModal,
    private customerService: CustomerService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private tokenStorageService: TokenStorageService,
    private uploadService: UploadFilesService,
    private spinner: NgxSpinnerService,
  ) {
    this.getAllinterests();
    this.profileId = this.tokenStorageService.getUser()?.profileId;
  }

  ngOnInit(): void {
    this.updateUserData = this.sharedService.userData;

    //set default values
    this.updateUserData.profilePictures.forEach(item => {
      if (item.imageUrl) {
        this.profilePics.push(item.imageUrl);
      }
    });
    this.statusofRelation = this.updateUserData.relationshipHistory;
    this.statusofBody = this.updateUserData.bodyType;
    this.idealText = this.updateUserData.idealDate;
    this.selectedInterests = this.updateUserData.interestList.map(
      (interest) => interest.interestId
    );

    this.currentImageIndex = this.profilePics.length - 1;
  }

  ngAfterViewInit(): void {
    if (this.steps.length > 0) {
      this.title = this.steps[0];
    }
  }

  relationOptions = [
    'Never Married',
    'Separated',
    'Divorced',
    'Widowed',
    'Tell you later',
  ];

  bodyTypeOptions = ['Slim', 'Athletic', 'Average', 'Stout'];

  getImageName(title: string): string {
    switch (title) {
      case 'Relationship History':
        return 'history.png';
      case `Body Type`:
        return 'human-body.png';
      case 'Photos':
        return 'photo.png';
      case 'My Story':
        return 'idealDate.png';
      default:
        return 'default.png';
    }
    // case 'Verification':
    //   return 'photo.png';
    // case 'Industry':
    //   return 'children.png';
    // case `Interests`:
    //   return 'ethnicity.png';
    // case `Icebreakers`:
    //   return 'height.png';
  }

  prev() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.profilePics.length - 1;
    }
  }
  
  next() {
    if (this.currentImageIndex < this.profilePics.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  generateId(label: string) {
    return label.toLowerCase().replace(/\s+/g, '');
  }

  selectFiles(event) {
    this.profileImg = event;
    this.upload(this.profileImg?.file);
  }

  upload(file: any = {}) {
    this.spinner.show();
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (res: any) => {
          if (res.body) {
            const url: string = res.body.url;
            this.profilePics.push(url);
            this.uploadfiles(url)
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.profileImg = {
            file: null,
            url: '',
          };
          return 'Could not upload the file:' + file.name;
        },
      });
    }
  }

  uploadfiles(image){
  const uploadFile = {
    profileId: this.profileId,
    imageUrl: image
  }
    this.customerService.addProfileImages(uploadFile).subscribe({
      next: (result) => {
        const url = result.data;
        this.profilePics.push(url);
        this.profileImg.file = null;
        this.profileImg.url = '';
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  uploadImage(){
    if (this.steps.length) {
      this.nextStep()
    } else {
      this.activeModal.close();
    }
  }

  relationStatus(relation: string) {
    this.statusofRelation = relation;
    this.updateUserData.relationshipHistory = relation;
    this.submitForm();
  }

  bodyType(body: string) {
    this.statusofBody = body;
    this.updateUserData.bodyType = body;
    this.submitForm();
  }

  submitIdealText() {
    this.updateUserData.idealDate = this.idealText;
    this.submitForm();
  }

  getAllinterests() {
    this.customerService.getInterests().subscribe({
      next: (result) => {
        this.interests = result.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onClickInterest(id: number) {
    const index = this.selectedInterests.indexOf(id);
    if (index === -1 && this.selectedInterests.length < 30) {
      this.selectedInterests.push(id);
      if (this.removeInterestList.includes(id)) {
        this.removeInterestList.splice(index, 1);
      }
    } else if (index !== -1) {
      this.selectedInterests.splice(index, 1);
      this.updateUserData?.interestList.forEach((interest: any) => {
        if (id === interest.interestId && !this.removeInterestList.includes(id)) {
          this.removeInterestList.push(id)}
      });
    } else {
      this.toastService.danger('You can only select up to 30 values at a time.');
    }
  }

  isSelected(id: number): boolean {
    return this.selectedInterests.includes(id);
  }

  submitInterests() {
    const existingValue = this.updateUserData.interestList.map(
      (interest) => interest.interestId
    );
    const filteredValue = this.selectedInterests.filter((ele) =>
      !existingValue.includes(ele) ? ele : null
    );
    const data = {
      profileId: this.profileId,
      interestsList: filteredValue,
      removeInterestList: this.removeInterestList
    }; 
    this.customerService.addInterests(data).subscribe({
      next: (result) => {
        this.activeModal.close();
        this.sharedService.getUserDetails();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  submitForm(): void {
    if (this.steps.length) {
      this.nextStep()
    } else {
      this.activeModal.close();
    }
    this.customerService
      .updateProfile(this.profileId, this.updateUserData)
      .subscribe({
        next: (res: any) => {
          if (!res.error) {
            this.toastService.success(res.message);
            this.sharedService.getUserDetails();

          } else {
            this.toastService.danger(res?.message);
          }
        },
        error: (error) => {
          this.toastService.danger(error.error.message);
        },
      });
  }

  nextStep() {
    const titleIndex = this.steps.indexOf(this.title);
    if (titleIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.title = this.steps[this.currentStepIndex];
    }
  }
}
