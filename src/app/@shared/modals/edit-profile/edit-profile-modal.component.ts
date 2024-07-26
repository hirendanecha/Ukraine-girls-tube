import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { SharedService } from '../../services/shared.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { UploadFilesService } from '../../services/upload-files.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent implements OnInit {
  @Input() cancelButtonLabel: string | undefined = 'Cancel';
  @Input() confirmButtonLabel: string | undefined = 'Done';
  @Input() title: string | undefined;
  @Input() message: string | undefined;

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
  whatImCovid: string = '';
  whatImFlu: string = '';
  statusofChild: string = '';
  statusofStudy: string = '';
  statusofEthnicity: string = '';
  statusofReligion: string = '';
  statusofSmoke: string = '';
  selectedRelationOptions: string[] = [];
  profileId: number;
  updateUserData: any = {};
  idealText: string = '';
  currentStepIndex: number = 0;
  currentImageIndex: number = this.profilePics.length - 1;

  matchStatusofVaccine: string = '';
  matchStatusofChild: string = '';
  matchStatusofStudy: string = '';
  matchStatusofEthnicity: string = '';
  matchStatusofBody: string = '';
  matchStatusofReligion: string = '';
  matchStatusofSmoke: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private customerService: CustomerService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private tokenStorageService: TokenStorageService,
    private uploadService: UploadFilesService,
    private spinner: NgxSpinnerService
  ) {
    this.getAllinterests();
    this.profileId = this.tokenStorageService.getUser()?.profileId;
  }

  ngOnInit(): void {
    this.updateUserData = this.sharedService?.userData;
    //set default values
    this.updateUserData.profilePictures.forEach((item) => {
      if (item.imageUrl) {
        this.profilePics.push(item.imageUrl);
      }
    });
    this.whatImCovid = this.updateUserData?.isVaccinated
    this.whatImFlu = this.updateUserData?.isFluShot
    this.statusofChild = this.updateUserData?.haveChild
    this.statusofStudy = this.updateUserData?.education
    this.statusofEthnicity = this.updateUserData?.ethnicity
    this.statusofReligion = this.updateUserData?.religion
    this.statusofSmoke = this.updateUserData?.isSmoke === 'Y' ? 'Yes' : (this.updateUserData?.isSmoke === 'N' ? 'No' : '');
    this.selectedRelationOptions = this.updateUserData?.relationshipType
    this.statusofRelation = this.updateUserData?.relationshipHistory;
    this.statusofBody = this.updateUserData?.bodyType;
    this.idealText = this.updateUserData?.idealDate;
    this.selectedInterests = this.updateUserData?.interestList.map(
      (interest) => interest.interestId
    );

    this.matchStatusofVaccine = this.updateUserData?.matchIsVaccinated;
    this.matchStatusofChild = this.updateUserData?.matchHaveChild  === 'Y' ? 'Yes' : (this.updateUserData?.matchHaveChild === 'N' ? 'No' : null);
    this.matchStatusofStudy = this.updateUserData?.matchEducation;
    this.matchStatusofEthnicity = this.updateUserData?.matchEthnicity;
    this.matchStatusofBody = this.updateUserData?.matchBodyType;
    this.matchStatusofReligion = this.updateUserData?.matchReligion;
    this.matchStatusofSmoke = this.updateUserData?.matchIsSmoke === 'Y' ? 'Yes' : (this.updateUserData?.matchIsSmoke === 'N' ? 'No' : null);

    this.currentImageIndex = this.profilePics.length - 1;
  }

  relationOptions = [
    'Never Married',
    'Separated',
    'Divorced',
    'Widowed',
    'Tell you later',
  ];

  bodyTypeOptions = ['Slim', 'Athletic', 'Average', 'Stout'];

  childOptions = [
    'No',
    'Yes, at home with me',
    "Yes, but they don't live with me",
  ];
  smokeOptions = ['No', 'Yes'];

  religions: string[] = [
    'Agnostic',
    'Atheist',
    'Buddist',
    'Christian',
    'Christian - Catholic',
    'Hindu',
    'Jewish',
    'Muslim',
    'Other',
    'Sikh',
    'Spiritual',
  ];
  ethnicities = [
    'White / Caucasian',
    'Black / African Descent',
    'East Asian',
    'Hispanic / Latinx',
    'Middle Eastern',
    'Mixed',
    'Other',
    'South Asian',
  ];
  studyOptions = [
    'No degree',
    'High school graduate',
    'Attended college',
    'College graduate',
    'Advanced degree',
  ];

  relationshipOptions = [
    'Friendship',
    'Short term dating',
    'Long term dating',
    'Casual dating',
    `Don't know yet`,
    'Other',
  ];

  getImageName(title: string): string {
    switch (title) {
      case 'Relationship History':
        return 'history.png';
      case `Body Type`:
        return 'human-body.png';
      case 'My Story':
        return 'idealDate.png';
      case 'Vaccine status':
        return 'vaccine.png';
      case 'Child':
        return 'children.png';
      case `Education`:
        return 'education.png';
      case `Ethnicity`:
        return 'ethnicity.png';
      case `Height`:
        return 'height.png';
      case `Religion`:
        return 'religion.png';
      case 'Smoking':
        return 'smoke.png';
      case 'Looking For':
        return 'relationship.png';
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
            this.uploadfiles(url);
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

  uploadfiles(image) {
    const uploadFile = {
      profileId: this.profileId,
      imageUrl: image,
    };
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

  uploadImage() {
    this.activeModal.close('success');
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
        this.activeModal.close('success');
        this.submitForm();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  calculateTotalHeight(event: Event) {
    const feet = parseInt(
      (document.getElementById('heightFeet') as HTMLSelectElement).value
    );
    const inches = parseInt(
      (document.getElementById('heightInches') as HTMLSelectElement).value
    );
    const height = feet + ' Feet ' + inches + ' Inches';
    this.updateUserData.height = height;
    // this.submitForm();
  }

  vaccineStatus(vaccine: string, type: string) {
    if (type === 'covid') {
      this.whatImCovid = vaccine;
      this.updateUserData.isVaccinated = this.whatImCovid;
      this.submitForm();
    } else if (type === 'flu') {
      this.whatImFlu = vaccine;
      this.updateUserData.isFluShot = this.whatImFlu;
      this.submitForm();
    }
  }

  childStatus(child: string) {
    this.statusofChild = child;
    this.updateUserData.haveChild = this.statusofChild;
    this.submitForm();
  }

  studyStatus(study: string) {
    this.statusofStudy = study;
    this.updateUserData.education = this.statusofStudy;
    this.submitForm();
  }

  ethnicityStatus(ethnicity: string) {
    this.statusofEthnicity = ethnicity;
    this.updateUserData.ethnicity = this.statusofEthnicity;
    this.submitForm();
  }

  religionStatus(religion: string) {
    this.statusofReligion = religion;
    this.updateUserData.religion = this.statusofReligion;
    this.submitForm();
  }

  smokeStatus(smoke: string) {
    let mappedValue: string;
    if (smoke === 'Yes') {
      mappedValue = 'Y';
    } else if (smoke === 'No') {
      mappedValue = 'N';
    }
    this.statusofSmoke = smoke;
    this.updateUserData.isSmoke = mappedValue;
    this.submitForm();
  }

  relationshipOption(option: string) {
    this.selectedRelationOptions = [];
    this.selectedRelationOptions.push(option);
    const selectedValue = this.selectedRelationOptions.join(', ');
    this.updateUserData.relationshipType = selectedValue;
    this.submitForm();
  }

  matchBody() {
    return ['It Does Not Matter', ...this.bodyTypeOptions];
  }
  matchEthnicities() {
    return ['It Does Not Matter', ...this.ethnicities];
  }

  matchReligions() {
    return ['It Does Not Matter', ...this.religions];
  }

  matchnoYesOptions() {
    return ['It Does Not Matter', ...this.smokeOptions];
  }

  matchVaccineStatus(vaccine: string) {
    this.matchStatusofVaccine = vaccine;
    this.updateUserData.matchIsVaccinated = this.matchStatusofVaccine;
    this.submitForm();
  }

  matchChildStatus(child: string) {
    let mappedValue: string;
    if (child === 'Yes') {
      mappedValue = 'Y';
    } else if (child === 'No') {
      mappedValue = 'N';
    } else {
      mappedValue = null;
    }
    this.matchStatusofChild = child;
    this.updateUserData.matchHaveChild = mappedValue;
    this.submitForm();
  }

  matchStudyStatus(study: string) {
    this.matchStatusofStudy = study;
    this.updateUserData.matchEducation = this.matchStatusofStudy;
    this.submitForm();
  }

  matchBodyType(body: string) {
    this.matchStatusofBody = body;
    this.updateUserData.matchBodyType = this.matchStatusofBody;
    this.submitForm();
  }

  matchEthnicityStatus(ethnicity: string) {
    this.matchStatusofEthnicity = ethnicity;
    this.updateUserData.matchEthnicity = this.matchStatusofEthnicity;
    this.submitForm();
  }

  matchReligionStatus(religion: string) {
    this.matchStatusofReligion = religion;
    this.updateUserData.matchReligion = this.matchStatusofReligion;
    this.submitForm();
  }

  matchSmokeStatus(smoke: string) {
    let mappedValue: string;
    if (smoke === 'Yes') {
      mappedValue = 'Y';
    } else if (smoke === 'No') {
      mappedValue = 'N';
    } else {
      mappedValue = null;
    }
    this.matchStatusofSmoke = smoke;
    this.updateUserData.matchIsSmoke = mappedValue;
    this.submitForm();
  }

  submitForm(): void {
    this.activeModal.close('success');
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
}
