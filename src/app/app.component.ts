// app.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  countries: any[] = [];
  filteredCountries: any[] = [];
  searchText = '';
  displayLimit = 1;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getCountries()
      .pipe(
        switchMap((response) => {
          if (response) {
            this.countries = response;
          }
          return of(null);
        }),
        catchError((error) => {
          console.error('Error fetching countries:', error);
          return of(null);
        }),
        finalize(() => {
          this.updateFilteredCountries();
        })
      )
      .subscribe();
  }

  updateFilteredCountries() {
    this.filteredCountries = this.countries
      .filter((country) =>
        country.name.common.toLowerCase().includes(this.searchText.toLowerCase())
      )
      .slice(0, this.displayLimit);
  }

  onSearchChange() {
    this.updateFilteredCountries();
  }
}
