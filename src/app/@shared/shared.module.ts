import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { ImgPickerComponent } from './components/img-picker/img-picker.component';
import { CommunityCardComponent } from './components/community-card/community-card.component';
import { RightSidebarComponent } from '../layouts/main-layout/components/right-sidebar/right-sidebar.component';
import { PostMetaDataCardComponent } from './components/post-meta-data-card/post-meta-data-card.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { TagUserInputComponent } from './components/tag-user-input/tag-user-input.component';
import { ImgPreviewComponent } from './components/img-preview/img-preview.component';
import { InlineLoaderComponent } from './components/inline-loader/inline-loader.component';
import { LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faAngleDoubleUp,
  faCamera,
  faEye,
  faXmark,
  faBars,
  faBorderAll,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faCirclePlus,
  faMagnifyingGlass,
  faDownload,
  faUser,
  faCalendarDays,
  faClock,
  faMessage,
  faThumbsUp,
  faRotate,
  faTrashCan,
  faEllipsis,
  faUserMinus,
  faPenToSquare,
  faLink,
  faComment,
  faImage,
  faPaperPlane,
  faBell,
  faHouse,
  faBookOpen,
  faPlay,
  faNetworkWired,
  faLayerGroup,
  faCertificate,
  faGear,
  faUserPlus,
  faUserXmark,
  faRightFromBracket,
  faUnlockKeyhole,
  faSun,
  faMoon,
  faPlus,
  faSatelliteDish,
  faVideo,
  faUserCheck,
  faCheck,
  faSquareCheck,
  faSquareXmark,
  faFileUpload,
  faFile,
  faFilePdf,
  faShare,
  faHouseMedical,
  faStethoscope,
  faArrowLeftLong,
  faArrowRightLong,
  faGlobe,
  faList,
  faCircle,
  faPhone,
  faHeartCirclePlus,
  faWandMagicSparkles,
  faGift,
  faChild,
  faSmoking,
  faGraduationCap,
  faHeart,
  faEllipsisV,
  faSlidersH,
  faAngleRight,
  faAngleLeft,
  faChevronLeft,
  faHistory,
  faPencil,
  faBookOpenReader,
  faStar,
  faChildren,
  faMapLocationDot,
  faEyeSlash,
  faEnvelope,
  faPaperclip,
  faReply,
  faPhotoFilm,
  faUsers,
  faPhoneSlash,
  faTicketAlt,
  faBan,
  faSquarePlus,
  faMobile,
  faPhoneFlip,
  faVoicemail,
  faPhoneVolume,
  faCircleChevronUp,
  faCircleChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { ClaimTokenModalComponent } from './modals/clai-1776-token-modal/claim-token-modal.component';
import { WalletLinkComponent } from './modals/wallet-download-modal/1776-wallet.component';
import { ReplyCommentModalComponent } from './modals/reply-comment-modal/reply-comment-modal.component';
import { PipeModule } from './pipe/pipe.module';
import { VideoPostModalComponent } from './modals/video-post-modal/video-post-modal.component';
import { ForgotPasswordComponent } from '../layouts/auth-layout/pages/forgot-password/forgot-password.component';
import { MentionModule } from 'angular-mentions';
//import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PostDetailComponent } from '../layouts/main-layout/pages/home/post-detail/post-detail.component';
import { EditResearchModalComponent } from './modals/edit-research-modal/edit-research-modal.component';
import { SharePostModalComponent } from './modals/share-post-modal/share-post-modal.component';
import { RePostCardComponent } from './components/re-post-card/re-post-card.component';
import { HealthPraatitionerCardComponent } from './components/health-partitioner-card/health-partitioner-card.component';
import { EditPostModalComponent } from './modals/edit-post-modal/edit-post-modal.component';
import { CompleteProfileModalComponent } from './modals/complete-profile/complete-profile-modal.component';
import { SubscribeModalComponent } from './modals/subscribe-model/subscribe-modal.component';
import { EditProfileModalComponent } from './modals/edit-profile/edit-profile-modal.component';
import { IncomingcallModalComponent } from './modals/incoming-call-modal/incoming-call-modal.component';
import { OutGoingCallModalComponent } from './modals/outgoing-call-modal/outgoing-call-modal.component';
import { CreateGroupModalComponent } from './modals/create-group-modal/create-group-modal.component';
import { EditGroupModalComponent } from './modals/edit-group-modal/edit-group-modal.component';
import { QrScanModalComponent } from './modals/qrscan-modal/qrscan-modal.component';
import { ForwardChatModalComponent } from './modals/forward-chat-modal/forward-chat-modal.component';
import { AppQrModalComponent } from './modals/app-qr-modal/app-qr-modal.component';
import { MediaGalleryComponent } from './components/media-gallery/media-gallery.component';
import { GalleryImgPreviewComponent } from './components/gallery-img-preview/gallery-img-preview.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RequestModalComponent } from './modals/request-modal/request-modal.component';
import { ConferenceLinkComponent } from './modals/create-conference-link/conference-link-modal.component';

const sharedComponents = [
  ConfirmationModalComponent,
  PostListComponent,
  PostCardComponent,
  ImgPickerComponent,
  CommunityCardComponent,
  RightSidebarComponent,
  PostMetaDataCardComponent,
  TagUserInputComponent,
  ImgPreviewComponent,
  InlineLoaderComponent,
  CopyClipboardDirective,
  ClaimTokenModalComponent,
  WalletLinkComponent,
  ReplyCommentModalComponent,
  VideoPostModalComponent,
  ForgotPasswordComponent,
  PdfPreviewComponent,
  PostDetailComponent,
  EditResearchModalComponent,
  SharePostModalComponent,
  RePostCardComponent,
  HealthPraatitionerCardComponent,
  EditPostModalComponent,
  CompleteProfileModalComponent,
  SubscribeModalComponent,
  EditProfileModalComponent,
  IncomingcallModalComponent,
  OutGoingCallModalComponent,
  CreateGroupModalComponent,
  EditGroupModalComponent,
  MediaGalleryComponent,
  ImgPreviewComponent,
  QrScanModalComponent,
  ForwardChatModalComponent,
  AppQrModalComponent,
  GalleryImgPreviewComponent,
  RequestModalComponent,
  ConferenceLinkComponent
];

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbCollapseModule,
  NgbModule,
  NgxSpinnerModule,
  RouterModule,
  NgxTrimDirectiveModule,
  FontAwesomeModule,
  PipeModule,
  MentionModule,
  QRCodeModule,
];

@NgModule({
  declarations: [sharedComponents],
  imports: [sharedModules],
  exports: [...sharedModules, ...sharedComponents],
  providers: [
    NgbActiveModal,
    NgbActiveOffcanvas,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
  ],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faAngleDoubleUp,
      faCamera,
      faEye,
      faXmark,
      faBars,
      faBorderAll,
      faChevronDown,
      faChevronUp,
      faChevronRight,
      faCirclePlus,
      faMagnifyingGlass,
      faDownload,
      faUser,
      faCalendarDays,
      faClock,
      faMessage,
      faThumbsUp,
      faRotate,
      faTrashCan,
      faEllipsis,
      faUserMinus,
      faPenToSquare,
      faLink,
      faComment,
      faImage,
      faPaperPlane,
      faBell,
      faHouse,
      faBookOpen,
      faPlay,
      faNetworkWired,
      faLayerGroup,
      faCertificate,
      faGear,
      faUserPlus,
      faUserXmark,
      faRightFromBracket,
      faUnlockKeyhole,
      faSun,
      faMoon,
      faPlus,
      faSatelliteDish,
      faVideo,
      faUserCheck,
      faCheck,
      faSquareCheck,
      faSquareXmark,
      faFileUpload,
      faFile,
      faFilePdf,
      faDownload,
      faShare,
      faHouseMedical,
      faStethoscope,
      faArrowLeftLong,
      faArrowRightLong,
      faGlobe,
      faList,
      faCircle,
      faPhone,
      faHeartCirclePlus,
      faWandMagicSparkles,
      faGift,
      faChild,
      faSmoking,
      faGraduationCap,
      faHeart,
      faEllipsisV,
      faSlidersH,
      faAngleRight,
      faAngleLeft,
      faCheck,
      faChevronRight,
      faChevronLeft,
      faHistory,
      faPencil,
      faBookOpenReader,
      faStar,
      faChildren,
      faMapLocationDot,
      faEyeSlash,
      faPhone,
      faMessage,
      faEnvelope,
      faPaperclip,
      faReply,
      faPhotoFilm,
      faUsers,
      faPhoneSlash,
      faTicketAlt,
      faBan,
      faSquarePlus,
      faMobile,
      faCheck,
      faChevronLeft,
      faPhoneFlip,
      faVoicemail,
      faPhoneVolume,
      faCircleChevronUp,
      faCircleChevronDown
      
    );
  }
}
