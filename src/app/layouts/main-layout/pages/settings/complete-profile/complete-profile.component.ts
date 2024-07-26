import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompleteProfileModalComponent } from 'src/app/@shared/modals/complete-profile/complete-profile-modal.component';
import { SharedService } from 'src/app/@shared/services/shared.service';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileComponent implements OnInit, AfterViewInit {
  stepLeft: number;
  progressValue: number;
  steps: string[] = [
    'Photos',
    'Relationship History',
    'My Story',
    'Body Type',
    'Interests',
  ];
  existingUserData: any = {};
  // 'Industry',
  // 'Verification',
  // 'Icebreakers',

  constructor(
    private modalService: NgbModal,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.existingUserData = this.sharedService.userData;
    this.updateStepLeft();
  }

  ngAfterViewInit(): void {}

  selectedStep(step: string) {
    this.openModel(step);
  }

  completeAllSteps() {
    this.openModel(this.steps);
  }

  openModel(step: string | string[]) {
    const modalRef = this.modalService.open(CompleteProfileModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = step;
    if (Array.isArray(step)) {
      modalRef.componentInstance.steps = step;
    }
    modalRef.componentInstance.progressValue = this.progressValue
    // modalRef.componentInstance.confirmButtonLabel = 'Done';
    // modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.result.then((res) => {
      if (res) {
        console.log(res);
      }
    });
  }

  isDone(title: string): boolean {
    switch (title) {
      case 'Relationship History':
        return this.existingUserData.relationshipHistory !== null;
      case 'Photos':
        return this.existingUserData.profilePictures.length;
      case 'Body Type':
        return this.existingUserData.bodyType !== null;
      case 'My Story':
        return this.existingUserData.idealDate !== null;
      case 'Interests':
        return (
          this.existingUserData.interestList !== null &&
          this.existingUserData.interestList.length > 0
        );
      default:
        return false;
    }
  }

  updateStepLeft() {
    const completedSteps = this.steps.reduce((count, step) => {
      return this.isDone(step) ? count + 1 : count;
    }, 0);
    this.stepLeft = this.steps.length - completedSteps;
    const progressPercentage = (completedSteps / this.steps.length) * 100;
    this.progressValue = Math.round(progressPercentage);
  }
}
