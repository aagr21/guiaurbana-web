import { Component, inject, OnInit } from '@angular/core';
import { MapComponent } from './map/map.component';
import { MapService } from '@services/map.service';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayersService } from '@services/layers.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxSpinnerModule, MapComponent, MatSidenavModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isLoading = true;
  showBusesOption = false;
  mapService = inject(MapService);
  layersService = inject(LayersService);
  spinner = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show();
    this.layersService.showBusesOption$.subscribe({
      next: (data) => {
        this.showBusesOption = data;
      },
    });
    this.mapService.getAll().subscribe({
      next: (response) => {
        this.mapService.setAllData(response);
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (_) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
}
