<!-- <div class="container">
  <div>
    <h3>Child1 component</h3>
    <form>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" name="name" />
        <div [hidden]="true" class="alert alert-danger">Name is required</div>
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <input type="text" class="form-control" id="address" name="address" />
      </div>

      <div class="form-group">
        <label for="gender">Gender</label>
        <select class="form-control" id="gender" name="gender">
          <option *ngFor="let gen of genders" [value]="gen">{{ gen }}</option>
        </select>
      </div>

      <button type="submit" class="btn btn-success">Add</button>
    </form>
  </div>
</div> -->

<div class="container">
  <div>
    <h3>Reactive form component</h3>
    <form [formGroup]="reactForm" (ngSubmit)="submitForm()">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" formControlName="name" id="name" name="name" />
        <div [hidden]="name.valid && name.pristine" class="alert alert-danger">Name is required</div>
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <input
          type="text"
          formControlName="address"
          id="address"
          name="address"
        />
      </div>

      <div class="form-group">
        <label for="gender">Gender</label>
        <select formControlName="gender" id="gender" name="gender">
          <option *ngFor="let gen of genders" [value]="gen">{{ gen }}</option>
        </select>
      </div>

      <button type="submit" class="btn btn-success">Add</button>
    </form>
  </div>
</div>

<!-- <form [formGroup]="reactForm" (ngSubmit)="submitForm()">
      
</form> -->

// *******************************************

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.css']
})
export class Child1Component implements OnInit {
  genders = ['Male', 'Female', 'Other', "Don't want to disclose"];

  reactForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }
  
  createForm(){
    this.reactForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      gender: ['']
    })
  }

  submitForm(){
    console.log(this.reactForm.value);
  }

  get name(){
    return this.reactForm.get('name');
  }
}
