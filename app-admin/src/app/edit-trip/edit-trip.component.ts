import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      nights: [3, Validators.required],
      days: [3, Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (trip: any) => {
        if (!trip) {
          this.message = 'No trip retrieved!';
          return;
        }

        // Parse "4 nights / 5 days" → { nights: 4, days: 5 }
        const { nights, days } = this.parseLength(trip.length);

        // Normalize ISO date to yyyy-MM-dd for the date input
        const startDate = trip.start ? trip.start.substring(0, 10) : '';

        this.editForm.patchValue({ ...trip, nights, days, start: startDate });
        this.message = `Trip ${tripCode} retrieved`;
      },
      error: (error: any) => {
        console.error('Error fetching trip:', error);
        this.message = 'Failed to load trip.';
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      const { nights, days, ...rest } = this.editForm.value;
      const payload = { ...rest, length: `${nights} nights / ${days} days` };

      this.tripDataService.editTrip(payload).subscribe({
        next: () => this.router.navigate(['']),
        error: (error: any) => console.error('Error updating trip:', error)
      });
    }
  }

  get f() { return this.editForm.controls; }

  /** Extract nights and days from strings like "4 nights / 5 days". */
  private parseLength(length: string): { nights: number; days: number } {
    const match = length?.match(/(\d+)\s*nights?\s*\/\s*(\d+)\s*days?/i);
    return match
      ? { nights: parseInt(match[1], 10), days: parseInt(match[2], 10) }
      : { nights: 3, days: 3 };
  }
}
