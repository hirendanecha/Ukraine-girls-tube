import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, fromEvent } from 'rxjs';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { UploadFilesService } from 'src/app/@shared/services/upload-files.service';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss'],
})
export class OnBoardingComponent implements OnInit {
  currentStep: number = 0;
  steps = [
    'Tell Us Your Location',
    'Add a photo',
    'Vaccine status',
    'Do You Have Children',
    `What's Your Highest Level of Education?`,
    `What's Your Ethnicity?`,
    `What's Your Height?`,
    `What's Your Religion?`,
    'Do You Smoke?',
    'What type of relationship are you looking for?',
    //for match user
    'WHO ARE YOU LOOKING FOR?',
    'WHO ARE YOU LOOKING FOR?',
    'WHO ARE YOU LOOKING FOR?',
    'WHO ARE YOU LOOKING FOR?',
    'WHO ARE YOU LOOKING FOR?',
    'WHO ARE YOU LOOKING FOR?',
    'WHO ARE YOU LOOKING FOR?',
    'My Story',
    'Interest',
  ];
  childOptions = [
    'No',
    'Yes, at home with me',
    "Yes, but they don't live with me",
  ];
  noYesOptions = ['No', 'Yes'];
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
  bodyTypeOptions = [
    'It Does Not Matter',
    'Slim',
    'Athletic',
    'Average',
    'Stout',
  ];
  defaultCountry = 'US';
  feetOptions: number[] = [];
  inchOptions: number[] = [];
  allCountryData: any;
  @ViewChild('zipCode') zipCode: ElementRef;
  profilePic: string;
  profileImg: any = {
    file: null,
    url: '',
  };
  whatImCovid: string = '';
  whatImFlu: string = '';
  statusofChild: string = '';
  statusofStudy: string = '';
  statusofEthnicity: string = '';
  statusofReligion: string = '';
  statusofSmoke: string = '';
  selectedRelationOptions: string[] = [];
  userId: number;
  profileId: number;

  matchStatusofVaccine: string = '';
  matchStatusofChild: string = '';
  matchStatusofStudy: string = '';
  matchStatusofEthnicity: string = '';
  matchStatusofBody: string = '';
  matchStatusofReligion: string = '';
  matchStatusofSmoke: string = '';

  onBoardingForm = new FormGroup({
    userId: new FormControl(null),
    userName: new FormControl(''),
    isVaccinated: new FormControl('', [Validators.required]),
    isFluShot: new FormControl('', [Validators.required]),
    haveChild: new FormControl('', [Validators.required]),
    education: new FormControl('', [Validators.required]),
    ethnicity: new FormControl('', [Validators.required]),
    religion: new FormControl('', [Validators.required]),
    isSmoke: new FormControl('', [Validators.required]),
    relationshipType: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
    country: new FormControl('US', [Validators.required]),
    zip: new FormControl({ value: '', disabled: true }, [Validators.required]),
    city: new FormControl({ value: '', disabled: true }, [Validators.required]),
    state: new FormControl('', [Validators.required,]),
    imageUrl: new FormControl('', [Validators.required]),
    matchIsVaccinated: new FormControl('', [Validators.required]),
    matchHaveChild: new FormControl('', [Validators.required]),
    matchEducation: new FormControl('', [Validators.required]),
    matchEthnicity: new FormControl('', [Validators.required]),
    matchBodyType: new FormControl('', [Validators.required]),
    matchReligion: new FormControl('', [Validators.required]),
    matchIsSmoke: new FormControl(''),
    idealDate: new FormControl('', [
      Validators.minLength(20),
      Validators.maxLength(500),
    ]),
    interests: new FormControl([]),
  });

  selectedInterests: number[] = [];
  removeInterestList: number[] = [];
  interests: any[];

  constructor(
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private toastService: ToastService,
    private uploadService: UploadFilesService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private sharedService: SharedService,
    private socketService: SocketService
  ) {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      this.tokenStorageService.saveToken(token);
    });
  }

  ngOnInit(): void {
    this.getAllCountries();
    this.getAllinterests();
  }

  ngAfterViewInit(): void {
    fromEvent(this.zipCode.nativeElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        const val = event['target'].value;
        if (val.length > 3) {
          this.onZipChange(val);
        }
      });
  }
  visibleSteps(): number[] {
    let rangeStart = Math.max(0, this.currentStep - 2);
    let rangeEnd = Math.min(this.steps.length - 1, rangeStart + 9);
    if (rangeEnd - rangeStart < 9) {
      if (rangeStart === 1) {
        rangeEnd = Math.min(
          this.steps.length,
          rangeEnd + (9 - (rangeEnd - rangeStart))
        );
      } else {
        rangeStart = Math.max(1, rangeStart - (9 - (rangeEnd - rangeStart)));
      }
    }
    return Array.from(
      { length: rangeEnd - rangeStart + 1 },
      (_, i) => i + rangeStart
    );
  }

  getImageName(step: string): string {
    switch (step) {
      case 'Tell Us Your Location':
        return 'location.png';
      case 'Add a photo':
        return 'photo.png';
      case 'Vaccine status':
        return 'vaccine.png';
      case 'Do You Have Children':
        return 'children.png';
      case `What's Your Highest Level of Education?`:
        return 'education.png';
      case `What's Your Ethnicity?`:
        return 'ethnicity.png';
      case `What's Your Height?`:
        return 'height.png';
      case `What's Your Religion?`:
        return 'religion.png';
      case 'Do You Smoke?':
        return 'smoke.png';
      case 'What type of relationship are you looking for?':
        return 'relationship.png';
      case 'WHO ARE YOU LOOKING FOR?':
        return 'search.png';
      default:
        return 'default.png';
    }
  }

  goToStep(index: number): void {
    this.currentStep = index;
  }

  validateAndNextStep(): void {
    const validations = [
      {
        step: 0,
        condition:
          this.onBoardingForm.get('zip').valid ||
          this.onBoardingForm.get('city').valid,
        errorMessage: 'Please fill in ZIP or city',
      },
      {
        step: 1,
        condition: !!this.profileImg.file,
        errorMessage: 'Please select an image',
      },
      {
        step: 2,
        condition:
          this.onBoardingForm.get('isFluShot').valid &&
          this.onBoardingForm.get('isVaccinated').valid,
        errorMessage: 'Please select options',
      },
      {
        step: 3,
        condition: this.onBoardingForm.get('haveChild').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 4,
        condition: this.onBoardingForm.get('education').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 5,
        condition: this.onBoardingForm.get('ethnicity').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 6,
        condition: this.onBoardingForm.get('height').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 7,
        condition: this.onBoardingForm.get('religion').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 8,
        condition: this.onBoardingForm.get('isSmoke').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 9,
        condition: this.onBoardingForm.get('relationshipType').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 10,
        condition: this.onBoardingForm.get('matchIsVaccinated').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 11,
        condition: this.onBoardingForm.get('matchHaveChild').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 12,
        condition: this.onBoardingForm.get('matchEducation').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 13,
        condition: this.onBoardingForm.get('matchEthnicity').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 14,
        condition: this.onBoardingForm.get('matchBodyType').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 15,
        condition: this.onBoardingForm.get('matchReligion').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 16,
        condition: this.onBoardingForm.get('matchIsSmoke').valid,
        errorMessage: 'Please select an option',
      },
      {
        step: 17,
        condition: true,
        errorMessage: '',
      },
      {
        step: 18,
        condition: true,
        errorMessage: '',
      },
    ];
    const validation = validations.find(
      (item) => item.step === this.currentStep
    );
    if (validation) {
      if (validation.condition) {
        this.nextStep();
      } else {
        this.toastService.danger(validation.errorMessage);
      }
    }
  }

  isNextButtonDisabled(): boolean {
    switch (this.currentStep) {
      case 0:
        return (
          !this.onBoardingForm.get('zip').valid &&
          !this.onBoardingForm.get('city').valid
        );
      case 1:
        return !this.profileImg.file;
      case 2:
        return (
          !this.onBoardingForm.get('isFluShot').valid ||
          !this.onBoardingForm.get('isVaccinated').valid
        );
      case 3:
        return !this.onBoardingForm.get('haveChild').valid;
      case 4:
        return !this.onBoardingForm.get('education').valid;
      case 5:
        return !this.onBoardingForm.get('ethnicity').valid;
      case 6:
        return !this.onBoardingForm.get('height').valid;
      case 7:
        return !this.onBoardingForm.get('religion').valid;
      case 8:
        return !this.onBoardingForm.get('isSmoke').valid;
      case 9:
        return !this.onBoardingForm.get('relationshipType').valid;
      case 10:
        return !this.onBoardingForm.get('matchIsVaccinated').valid;
      case 11:
        return !this.onBoardingForm.get('matchHaveChild').valid;
      case 12:
        return !this.onBoardingForm.get('matchEducation').valid;
      case 13:
        return !this.onBoardingForm.get('matchEthnicity').valid;
      case 14:
        return !this.onBoardingForm.get('matchBodyType').valid;
      case 15:
        return !this.onBoardingForm.get('matchReligion').valid;
      case 16:
        return !this.onBoardingForm.get('matchIsSmoke').valid;
      default:
        return !this.onBoardingForm.valid;
    }
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
    if (this.currentStep === 2 && this.profileImg?.file) {
      this.upload(this.profileImg?.file);
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitForm(): void {
    this.userId = this.tokenStorageService.getUser()?.userId;
    this.profileId = this.tokenStorageService.getUser()?.profileId;
    const userName = this.tokenStorageService.getUser()?.userName;
    this.onBoardingForm.get('userId').setValue(this.userId);
    this.onBoardingForm.get('userName').setValue(userName);
    this.onBoardingForm.get('interests').setValue(this.selectedInterests);
    console.log(this.onBoardingForm.value);
    this.customerService
      .updateProfile(this.profileId, this.onBoardingForm.value)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (!res.error) {
            localStorage.setItem('profileId', String(this.profileId));
            this.toastService.success(res.message);
            this.sharedService.getUserDetails();
            this.socketService.connect();
            this.router.navigate([`/home`]);
          } else {
            this.toastService.danger(res?.message);
          }
        },
        error: (error) => {
          console.log(error.error.message);
          this.spinner.hide();
          this.toastService.danger(error.error.message);
        },
      });
  }

  getAllCountries() {
    // this.spinner.show();
    this.customerService.getCountriesData().subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allCountryData = result;
        this.onBoardingForm.get('zip').enable();
        this.onBoardingForm.get('city').enable();
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  onZipChange(event) {
    // this.spinner.show();
    this.customerService
      .getZipData(event, this.onBoardingForm.get('country').value)
      .subscribe(
        (data) => {
          if (data[0]) {
            const zipData = data[0];
            // this.onBoardingForm.get('city').enable();
            this.onBoardingForm.patchValue({
              city: zipData.places,
            });
            this.onBoardingForm.patchValue({
              state: zipData.state,
            });
          } else {
            // this.onBoardingForm.get('city').enable();
            this.toastService.danger(data?.message);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
  }

  changeCountry() {
    console.log('change');
    this.onBoardingForm.get('zip').setValue('');
    this.onBoardingForm.get('state').setValue('');
    this.onBoardingForm.get('city').setValue('');
    // this.customer.zip = '';
    // this.customer.state = '';
    // this.customer.city = '';
    // this.customer.county = '';
    // this.customer.Place = '';
  }

  selectFiles(event) {
    this.profileImg = event;
  }

  upload(file: any = {}) {
    this.spinner.show();
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.body) {
            this.profilePic = res?.body?.url;
            this.onBoardingForm.get('imageUrl').setValue(this.profilePic);
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

  clearProfileImg(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    this.profileImg = {
      file: null,
      url: '',
    };
  }

  calculateTotalHeight(event: Event) {
    const feet = parseInt(
      (document.getElementById('heightFeet') as HTMLSelectElement).value
    );
    const inches = parseInt(
      (document.getElementById('heightInches') as HTMLSelectElement).value
    );
    const height = feet + ' Feet ' + inches + ' Inches';
    this.onBoardingForm.get('height').setValue(height);
  }

  vaccineStatus(vaccine: string, type: string) {
    if (type === 'covid') {
      this.whatImCovid = vaccine;
      this.onBoardingForm.get('isVaccinated').setValue(this.whatImCovid);
    } else if (type === 'flu') {
      this.whatImFlu = vaccine;
      this.onBoardingForm.get('isFluShot').setValue(this.whatImFlu);
    }
  }

  childStatus(child: string) {
    this.statusofChild = child;
    this.onBoardingForm.get('haveChild').setValue(this.statusofChild);
  }

  generateId(label: string) {
    return label.toLowerCase().replace(/\s+/g, '');
  }

  studyStatus(study: string) {
    this.statusofStudy = study;
    this.onBoardingForm.get('education').setValue(this.statusofStudy);
  }

  ethnicityStatus(ethnicity: string) {
    this.statusofEthnicity = ethnicity;
    this.onBoardingForm.get('ethnicity').setValue(this.statusofEthnicity);
  }

  religionStatus(religion: string) {
    this.statusofReligion = religion;
    this.onBoardingForm.get('religion').setValue(this.statusofReligion);
  }

  smokeStatus(smoke: string) {
    let mappedValue: string;
    if (smoke === 'Yes') {
      mappedValue = 'Y';
    } else if (smoke === 'No') {
      mappedValue = 'N';
    }
    this.statusofSmoke = smoke;
    this.onBoardingForm.get('isSmoke').setValue(mappedValue);
  }

  relationshipOption(option: string) {
    this.selectedRelationOptions = [];
    this.selectedRelationOptions.push(option);
    const selectedValue = this.selectedRelationOptions.join(', ');
    this.onBoardingForm.get('relationshipType').setValue(selectedValue);
  }

  //match pepole
  matchEthnicities() {
    return ['It Does Not Matter', ...this.ethnicities];
  }

  matchReligions() {
    return ['It Does Not Matter', ...this.religions];
  }

  matchnoYesOptions() {
    return ['It Does Not Matter', ...this.noYesOptions];
  }

  matchVaccineStatus(vaccine: string) {
    this.matchStatusofVaccine = vaccine;
    this.onBoardingForm
      .get('matchIsVaccinated')
      .setValue(this.matchStatusofVaccine);
  }

  matchChildStatus(child: string) {
    let mappedValue: string;
    if (child === 'Yes') {
      mappedValue = 'Y';
    } else if (child === 'No') {
      mappedValue = 'N';
    }
    this.matchStatusofChild = child;
    this.onBoardingForm.get('matchHaveChild').setValue(mappedValue);
  }

  matchStudyStatus(study: string) {
    this.matchStatusofStudy = study;
    this.onBoardingForm.get('matchEducation').setValue(this.matchStatusofStudy);
  }

  matchBodyType(body: string) {
    this.matchStatusofBody = body;
    this.onBoardingForm.get('matchBodyType').setValue(this.matchStatusofBody);
  }

  matchEthnicityStatus(ethnicity: string) {
    this.matchStatusofEthnicity = ethnicity;
    this.onBoardingForm
      .get('matchEthnicity')
      .setValue(this.matchStatusofEthnicity);
  }

  matchReligionStatus(religion: string) {
    this.matchStatusofReligion = religion;
    this.onBoardingForm
      .get('matchReligion')
      .setValue(this.matchStatusofReligion);
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
    this.onBoardingForm.get('matchIsSmoke').setValue(mappedValue);
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
      // if (this.removeInterestList.includes(id)) {
      //   this.removeInterestList.splice(index, 1);
      // }
    } else if (index !== -1) {
      this.selectedInterests.splice(index, 1);
      // this.selectedInterests.forEach((interest: any) => {
      //   if (
      //     id === interest.interestId &&
      //     !this.removeInterestList.includes(id)
      //   ) {
      //     this.removeInterestList.push(id);
      //   }
      // });
      console.log(this.selectedInterests);
    } else {
      this.toastService.danger(
        'You can only select up to 30 values at a time.'
      );
    }
  }

  isSelected(id: number): boolean {
    return this.selectedInterests.includes(id);
  }
}
