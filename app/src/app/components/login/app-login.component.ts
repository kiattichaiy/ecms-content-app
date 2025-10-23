/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '@alfresco/adf-core';
import { AppSettingsService } from '@alfresco/aca-shared';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule
  ]
})
export class AppLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  settings = inject(AppSettingsService);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', Validators.required]
    });

    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      void this.router.navigate(['/personal-files']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password, true).subscribe({
      next: () => {
        this.isLoading = false;
        void this.router.navigate(['/personal-files']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);

        if (error.status === 403) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
