import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, fromEvent } from 'rxjs';
import { Customer } from 'src/app/@shared/constant/customer';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { UploadFilesService } from 'src/app/@shared/services/upload-files.service';
import { environment } from 'src/environments/environment';

declare var turnstile: any;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  customer = new Customer();
  useDetails: any = {};
  isragister = false;
  registrationMessage = '';
  confirm_password = '';
  msg = '';
  userId = '';
  submitted = false;
  allCountryData: any;
  type = 'danger';
  defaultCountry = 'US';
  profilePic: string;
  profileImg: any = {
    file: null,
    url: '',
  };

  dates: any = [];
  years: any = [];
  months: any = [];
  whatIm = '';
  selectedDate: string;
  selectedMonth: number;
  selectedYear: number;
  captchaToken = '';
  passwordHidden: boolean = true;

  @ViewChild('zipCode') zipCode: ElementRef;
  registerForm = new FormGroup({
    Email: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
    // confirm_password: new FormControl('', [Validators.required]),
    fullname: new FormControl('', [Validators.required]),
    // captcha: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dateSelect: new FormControl('', Validators.required),
    monthSelect: new FormControl('', Validators.required),
    yearSelect: new FormControl('', Validators.required),
    birthDate: new FormControl('', [Validators.required]),
  });
  theme = '';
  @ViewChild('captcha', { static: false }) captchaElement: ElementRef;
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private uploadService: UploadFilesService,
    private toastService: ToastService,
    private seoService: SeoService,
    private tokenStorageService: TokenStorageService
  ) {
    const data = {
      title: 'Organic-Registration',
      url: `${environment.webUrl}register`,
      description: 'Registration page',
      image: `${environment.webUrl}assets/images/landingpage/OD-default-profile-banner.png`,
    };
    this.seoService.updateSeoMetaData(data);
    this.theme = localStorage.getItem('theme');
  }

  ngOnInit(): void {
    this.generateFullDates();
  }

  ngAfterViewInit(): void {
    this.loadCloudFlareWidget();
  }

  loadCloudFlareWidget() {
    turnstile?.render(this.captchaElement.nativeElement, {
      sitekey: environment.siteKey,
      theme: this.theme === 'dark' ? 'light' : 'dark',
      callback: function (token) {
        localStorage.setItem('captcha-token', token);
        this.captchaToken = token;
        console.log(`Challenge Success ${token}`);
        if (!token) {
          this.msg = 'invalid captcha kindly try again!';
          this.type = 'danger';
        }
      },
    });
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    this.passwordHidden = !this.passwordHidden;
  }

  validatepassword(): boolean {
    const pattern = '[a-zA-Z0-9]{5,}';
    // const pattern =
    //   '(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])(?=.*[0-9].*[0-9]).{8}';

    if (!this.registerForm.get('Password').value.match(pattern)) {
      this.msg = 'Password must be a minimum of 5 characters';
      // this.msg =
      //   'Password must be a minimum of 8 characters and include one uppercase letter, one lowercase letter, and one special character';
      this.scrollTop();
      return false;
    }

    if (
      this.registerForm.get('Password').value !==
      this.registerForm.get('confirm_password').value
    ) {
      this.msg = 'Passwords do not match';
      this.scrollTop();
      return false;
    }

    return true;
  }

  changeGender(gender: string) {
    this.whatIm = gender;
    this.registerForm.get('gender').setValue(this.whatIm);
  }

  onSubmit(): void {
    this.msg = '';
    const token = localStorage.getItem('captcha-token');
    if (!token) {
      this.msg = 'invalid captcha please kindly try again!';
      this.type = 'danger';
      this.scrollTop();
      return;
    }
    if (this.registerForm.valid) {
      this.spinner.show();
      const data = {
        email: this.registerForm.value.Email,
        userName: this.registerForm.value.fullname,
        password: this.registerForm.value.Password,
        gender: this.registerForm.value.gender,
        birthDate: this.registerForm.value.birthDate,
      };
      console.log(data);
      this.customerService.createCustomer(data).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          if (!data.error) {
            this.submitted = true;
            this.type = 'success';
            this.registrationMessage =
            `Email sent to ${this.registerForm.value.Email}, Please check your email and click the link to activate your account.`;
            this.scrollTop();
            this.isragister = true;
            const userData = data.data;
            if (userData) {
              // this.createProfile(this.registerForm.value);
              localStorage.setItem('register', String(this.isragister));
              this.tokenStorageService.saveUser(userData);
              // this.router.navigateByUrl('/login?isVerify=false');
            }
          }
        },
        error: (err) => {
          this.registrationMessage = err.error.message;
          this.type = 'danger';
          this.spinner.hide();
          this.scrollTop();
        },
      });
    } else {
      this.msg = 'Please enter mandatory fields(*) data.';
      this.scrollTop();
      // return false;
    }

    // if (
    //  this.registerForm.invalid ||
    //   this.registerForm.get('termAndPolicy')?.value === false ||
    //   !this.profileImg?.file?.name
    // ) {
    //   this.msg =
    //     'Please enter mandatory fields(*) data and please check terms and conditions.';
    //   this.scrollTop();
    //   return false;
    // }
  }

  changeCountry() {
    // this.registerForm.get('Zip').setValue('');
    // this.registerForm.get('State').setValue('');
    // this.registerForm.get('City').setValue('');
    // this.registerForm.get('County').setValue('');
  }

  getAllCountries() {
    this.spinner.show();

    this.customerService.getCountriesData().subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allCountryData = result;
        this.registerForm.get('Zip').enable();
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  // onZipChange(event) {
  //   this.spinner.show();
  //   this.customerService
  //     .getZipData(event, this.registerForm.get('Country').value)
  //     .subscribe(
  //       (data) => {
  //         if (data[0]) {
  //           const zipData = data[0];
  //           this.registerForm.get('State').enable();
  //           this.registerForm.get('City').enable();
  //           this.registerForm.get('County').enable();
  //           this.registerForm.patchValue({
  //             State: zipData.state,
  //             City: zipData.city,
  //             County: zipData.places,
  //           });
  //         } else {
  //           this.registerForm.get('State').disable();
  //           this.registerForm.get('City').disable();
  //           this.registerForm.get('County').disable();
  //           this.toastService.danger(data?.message);
  //         }

  //         this.spinner.hide();
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //         console.log(err);
  //       }
  //     );
  // }

  changetopassword(event) {
    event.target.setAttribute('type', 'password');
    this.msg = '';
  }

  createProfile(data) {
    this.spinner.show();
    const profile = {
      userName: data?.userName,
      FirstName: data?.FirstName,
      LastName: data?.LastName,
      Address: data?.Address,
      Country: data?.Country,
      City: data?.City,
      State: data?.State,
      County: data?.County,
      Zip: data?.Zip,
      MobileNo: data?.MobileNo,
      UserID: window?.sessionStorage?.user_id,
      IsActive: 'N',
      profilePicName: this.profilePic || null,
    };
    console.log(profile);

    this.customerService.createProfile(profile).subscribe({
      next: (data: any) => {
        this.spinner.hide();

        if (data) {
          const profileId = data.data;
          localStorage.setItem('profileId', profileId);
        }
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  clearProfileImg(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    this.profileImg = {
      file: null,
      url: '',
    };
  }

  scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  onChangeTag(event) {
    // this.registerForm
    //   .get('userName')
    //   .setValue(event.target.value.replaceAll(' ', ''));
  }

  convertToUppercase(event: any) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/\s/g, '');
    inputElement.value = inputValue.toUpperCase();
  }

  onVerify(event) {
    // this.registerForm.get('captcha').setValue(event);
    console.log('verify', event);
  }

  onExpired(event) {
    console.log('expire', event);
  }

  onError(event) {
    console.log('error', event);
  }

  generateFullDates(): void {
    const currentYear = new Date().getFullYear() - 18;
    for (let i = 1; i <= 31; i++) {
      this.dates.push(String(i));
    }
    this.months = Array.from({ length: 12 }, (_, i) => {
      return new Date(0, i).toLocaleString('default', { month: 'long' });
    });
    const startYear = 1930;
    this.years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => currentYear - i
    );
  }

  onDateMonthYearChange(controlName: string): void {
    const control = this.registerForm.get(controlName);
    if (control) {
      switch (controlName) {
        case 'dateSelect':
          this.selectedDate = control.value;
          break;
        case 'monthSelect':
          this.selectedMonth = control.value;
          break;
        case 'yearSelect':
          this.selectedYear = control.value;
          break;
      }
      if (this.selectedYear && this.selectedMonth && this.selectedDate) {
        const date = moment(
          `${this.selectedYear}-${this.selectedMonth}-${this.selectedDate}`,
          'YYYY-MM-DD'
        )?.format('YYYY-MM-DD');
        this.registerForm.get('birthDate').setValue(date);
      }
    }
  }
}
