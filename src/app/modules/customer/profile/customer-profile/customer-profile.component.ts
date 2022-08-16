import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import Swal from 'sweetalert2';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { base64ToFile } from 'ngx-image-cropper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
  currentData: any;
  loading: boolean = true;
  userToken: string;
  addressList: any;
  newAddressForm: FormGroup;
  profileForm: FormGroup;
  editOn: boolean = false;
  avatarRemoved: boolean = false;
  avatarEdited: boolean = false;
  editFormNo: number;
  editAddId: string;
  emptyAddrForm = {
    street: '',
    addressLine2: '',
    city: '',
    state: '',
    pin: '',
  };

  updateFormCreated: boolean = false;

  imageChangedEvent: any = '';
  originalImageUrl: string;
  avatarUrl: string;
  croppedImage: any = '';

  isCropperOn: boolean = false;

  constructor(
    private http: HttpService,
    private previousRouteService: PreviousRouteService,
    private lstore: LocalStorageService,
    private fb: FormBuilder,
    private router: Router,
    private headerTitleService: HeaderTitleService,
    private toasterService: HotToastService
  ) {
    this.headerTitleService.setTitle('Account Details');
  }

  ngOnInit(): void {
    this.previousRouteService.setDefPrevUrl('/');
    this.userToken = this.lstore.getCustomerToken();
    this.getProfileDetails();
    this.getAddresses();
    this.createNewAdrForm(this.emptyAddrForm);
  }

  getProfileDetails() {
    this.loading = true;
    this.http.getSecured('shop/auth/self', this.userToken).subscribe({
      next: (data) => {
        this.currentData = data;
        this.originalImageUrl = data['picture'];
        this.avatarUrl = this.originalImageUrl;
        console.log(this.currentData);
        this.loading = false;
        this.createProfileForm();
        this.headerTitleService.getCustomerData();
      },
      error: (error) => {
        console.log(error);
        // this.location.back();
      },
    });
  }

  createProfileForm() {
    this.avatarUrl = this.originalImageUrl;
    this.profileForm = this.fb.group({
      name: [this.currentData.name, Validators.required],
      email: [
        this.currentData.email,
        [
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          Validators.required,
        ],
      ],
    });
    this.updateFormCreated = true;
  }

  getAddresses() {
    this.http.getSecured('customers/address', this.userToken).subscribe({
      next: (data) => {
        this.addressList = data;
        console.log(this.addressList);
      },
      error: (error) => {
        console.error('Error in fetching address list:', error.message);
      },
    });
  }

  editAddress(i: number, id) {
    this.editFormNo = i;
    this.editAddId = id;
    this.editOn = true;
    this.createNewAdrForm(this.addressList[i]);
  }

  emptyAddress() {
    this.editOn = false;
    this.createNewAdrForm(this.emptyAddrForm);
  }

  createNewAdrForm(address) {
    this.newAddressForm = this.fb.group({
      street: [address.street, [Validators.required]],
      addressLine2: [address.addressLine2, [Validators.required]],
      city: [address.city, [Validators.required]],
      state: [address.state, [Validators.required]],
      pin: [address.pin, [Validators.required]],
    });
  }

  submitAddrForm() {
    if (!this.editOn) {
      console.log('new address:', this.newAddressForm.value);
      this.http
        .postSecured(
          'customers/address',
          this.newAddressForm.value,
          this.userToken
        )
        .subscribe({
          next: (data) => {
            this.toasterService.success(`"Address list updated!`);

            this.getAddresses();
          },
          error: (error) => {
            console.error('Error in fetching address list:', error.message);
          },
        });
    } else {
      this.editOn = false;
      console.log(
        'updated address at',
        this.editFormNo,
        this.newAddressForm.value
      );
      this.http
        .putSecured(
          `customers/address/${this.editAddId}`,
          this.newAddressForm.value,
          this.userToken
        )
        .subscribe({
          next: (data) => {
            this.toasterService.success(`"Address list updated!`);

            this.getAddresses();
          },
          error: (error) => {
            console.error('Error in fetching address list:', error.message);
          },
        });
    }
  }

  deleteAddress(id) {
    this.http
      .deleteSecured(`customers/address/${this.editAddId}`, this.userToken)
      .subscribe({
        next: (data) => {
          this.toasterService.success(`"Address deleted!`);

          this.getAddresses();
        },
        error: (error) => {
          console.error('Error in fetching address list:', error.message);
        },
      });
  }

  sweetDeleteAddress(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete from list!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAddress(id);
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  sweetDeleteAvatar() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove your profile picture!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove',
    }).then((result) => {
      if (result.isConfirmed) {
        this.avatarUrl = 'https://i.imgur.com/CR1iy7U.png';
        this.avatarRemoved = true;
        this.avatarEdited = false;
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  onFileSelected(event) {
    this.imageChangedEvent = event;

    const file: File = event.target.files[0];

    // if (file) {
    //   this.newPhotos.push(file);
    //   this.fileName = file.name;
    //   let reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = (event) => {
    //     this.photosArr.push(event.target.result);
    //     this.imgFlag[1].push(false);
    //   };
    // }
    this.isCropperOn = true;

    // console.log('New photos:', this.newPhotos);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  isCropped() {
    this.avatarUrl = this.croppedImage;
    this.isCropperOn = false;
    this.avatarRemoved = false;
    this.avatarEdited = true;
  }

  cropCancelled() {
    this.isCropperOn = false;
  }

  updateAvatar() {
    if (this.avatarRemoved) {
      this.http
        .deleteSecured('customers/profile-picture', this.userToken)
        .subscribe((data) => {
          console.log('Profile pic removed!');
          this.getProfileDetails();
        });
    } else if (this.avatarEdited) {
      const formData = new FormData();
      formData.append('picture', base64ToFile(this.avatarUrl));
      this.http
        .postSecured('customers/profile-picture', formData, this.userToken)
        .subscribe((data) => {
          console.log('Profile pic updated!');
          this.getProfileDetails();
        });
    } else {
      console.log('Profile updated!');
      this.getProfileDetails();
    }
    this.avatarEdited = false;
    this.avatarRemoved = false;
  }

  updateProfile() {
    this.http
      .patchSecured(
        'customers/update-profile',
        this.profileForm.value,
        this.userToken
      )
      .subscribe({
        next: (data) => {
          console.log('Profile updated!');
          this.updateAvatar();
          // this.getProfileDetails();
        },
        error: (err) => {
          console.log('Error in update:', err);
          // this.toasterService.error('Error:', err.message);
        },
      });
  }

  logOut() {
    this.lstore.customerLogOut();
    this.router.navigate(['/']);
  }

  deleteAcc() {
    this.http
      .deleteSecured('customers/account', this.userToken)
      .subscribe((data) => {
        this.logOut();
      });
  }

  sweetLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Log Out',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logOut();
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  sweetDeleteAccount() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete this account',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAcc();
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  get regAdStreet() {
    return this.newAddressForm.get('street');
  }
  get regAdLine2() {
    return this.newAddressForm.get('addressLine2');
  }
  get regAdCity() {
    return this.newAddressForm.get('city');
  }
  get regAdState() {
    return this.newAddressForm.get('state');
  }
  get regAdPin() {
    return this.newAddressForm.get('pin');
  }

  get profName() {
    return this.profileForm.get('name');
  }

  get profEmail() {
    return this.profileForm.get('email');
  }
}
