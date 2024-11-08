import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LineName, LineRoute } from '@models/interfaces';
import { MapService } from '@services/map.service';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { FindLineRoute } from '@models/interfaces/find-line-route';
import { LayersService } from '@services/layers.service';

@Component({
  selector: 'app-lines',
  standalone: true,
  imports: [
    MatCardModule,
    TitleCasePipe,
    MatButton,
    MatFormField,
    MatInput,
    FormsModule,
    NgxSpinnerModule,
  ],
  templateUrl: './lines.component.html',
  styleUrl: './lines.component.scss',
})
export class LinesComponent implements OnInit, OnDestroy {
  linesNames: LineName[] = [];
  result: LineName[] = [];
  mapService = inject(MapService);
  searchText: string = '';
  isSmallScreen = false;
  private _subscription!: Subscription;
  breakpointObserver = inject(BreakpointObserver);
  spinner = inject(NgxSpinnerService);
  isLoading = false;
  layersService = inject(LayersService);
  lineRouteSelected?: LineRoute;

  constructor() {
    this._subscription = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .subscribe({
        next: (result) => {
          this.isSmallScreen = result.matches;
        },
      });
  }

  ngOnInit(): void {
    this.mapService.allData$.subscribe({
      next: (data) => {
        this.linesNames = data.linesNames;
        this.result = data.linesNames;
      },
    });
    this.layersService.lineRoute$.subscribe({
      next: (data) => {
        this.lineRouteSelected = data;
      },
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  selectLineRoute(lineName: LineName, ground: string) {
    if (
      this.lineRouteSelected &&
      this.lineRouteSelected!.name === lineName.name &&
      this.lineRouteSelected.ground === ground
    )
      return;
    const findLineRoute: FindLineRoute = {
      name: lineName.name,
      ground,
    };
    this.isLoading = true;
    this.spinner.show();
    this.mapService.findLineRoute(findLineRoute).subscribe({
      next: (response) => {
        this.layersService.setLineRoute(response);
        this.spinner.hide();
        this.isLoading = false;
      },
      error: (_) => {
        this.spinner.hide();
        this.isLoading = false;
      },
    });
  }

  search(searchText: string) {
    this.result = this.linesNames.filter((lineName) =>
      lineName.name!.includes(searchText.toUpperCase())
    );
  }

  onSearchText(searchText: string) {
    this.search(searchText);
  }
}
