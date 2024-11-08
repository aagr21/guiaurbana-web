import { Component, inject, OnInit } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';
import { Feature, Geometry } from 'geojson';
import { AllData, LineRoute } from '@models/interfaces';
import { MapService } from '@services/map.service';
import {
  Control,
  latLng,
  Layer,
  LocationEvent,
  Map,
  MapOptions,
  polyline,
  tileLayer,
} from 'leaflet';
import { LeafletPanelLayersComponent } from './controls/leaflet-panel-layers/leaflet-panel-layers.component';
import { LayersService, Option } from '@services/layers.service';
import { CameraDialogComponent } from './dialogs/camera-dialog/camera-dialog.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    LeafletModule,
    LeafletPanelLayersComponent,
    MatSidenavModule,
    NgxLeafletLocateModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  options: MapOptions = {
    zoom: 13,
    center: latLng(-17.779223, -63.18164),
    attributionControl: false,
    maxBoundsViscosity: 1.0,
    zoomAnimation: true,
  };
  locateOptions: Control.LocateOptions = {
    flyTo: true,
    position: 'bottomright',
  };

  googleMapsLayer = tileLayer(
    'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 22,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );
  lineRouteSelected?: LineRoute;

  baseLayers: { [name: string]: Layer } = {
    'Google Maps': this.googleMapsLayer,
    'Google Satélite': tileLayer(
      'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ),
    'Open Street Map': tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 20,
      }
    ),
  };
  showBusesOption = false;

  dialog = inject(MatDialog);

  onEachFeature(feature: Feature<Geometry, any>, layer: Layer): void {
    layer.on({
      click: (e) => {
        const dialogRef = this.dialog.open(CameraDialogComponent, {
          data: feature.properties,
        });
        dialogRef.afterOpened().subscribe((_) => {
          setTimeout(() => {
            dialogRef.close();
          }, 30000);
        });
      },
    });
  }

  map!: Map;
  allData!: AllData;
  mapService = inject(MapService);
  layersService = inject(LayersService);
  baseLayer!: string;
  optionsMap!: {
    [k: string]: Option;
  };

  ngOnInit(): void {
    this.mapService.allData$.subscribe({
      next: (data) => {
        this.allData = data;
      },
    });
    this.baseLayer = 'Google Maps';
    this.layersService.setBaseLayer(this.baseLayer);
    this.optionsMap = this.layersService.getOptionsMap(
      this.allData,
      this.onEachFeature.bind(this)
    );
    this.layersService.setOptionsMap(this.optionsMap);
    this.layersService.lineRoute$.subscribe({
      next: (data) => {
        this.lineRouteSelected = data;
      },
    });
    this.layersService.showBusesOption$.subscribe({
      next: (data) => {
        this.showBusesOption = data;
      },
    });
  }

  lineRouteSelectedLayer(lineRouteSelected: LineRoute) {
    const coordinates: L.LatLngTuple[] = lineRouteSelected.geom.coordinates.map(
      (coord) => [coord[1], coord[0]]
    );

    return polyline(coordinates);
  }

  styleMap() {
    return 'height: 100%; width: 100%';
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('locateactivate', (e) => {
      // TODO:
    });
    this.map.on('locatedeactivate', (e) => {
      // TODO:
    });
    this.layersService.baseLayer$.subscribe({
      next: (data) => {
        this.baseLayer = data;
      },
    });
  }

  onNewLocation(e: LocationEvent) {
    console.log(e);
  }
}
