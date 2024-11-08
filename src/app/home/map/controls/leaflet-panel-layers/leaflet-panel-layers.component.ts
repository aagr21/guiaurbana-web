import { Component, inject, OnInit } from '@angular/core';
import { AllData } from '@models/interfaces';
import { LayersService, Option } from '@services/layers.service';
import { MapService } from '@services/map.service';

@Component({
  selector: 'leaflet-panel-layers',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-panel-layers.component.html',
  styleUrl: './leaflet-panel-layers.component.scss',
})
export class LeafletPanelLayersComponent implements OnInit {
  showBusesOption: boolean = false;

  expandedIndices: Set<number> = new Set();
  baseLayers = ['Google Maps', 'Google Satélite', 'Open Street Map'];
  baseLayerSelected!: string;
  layersService = inject(LayersService);
  mapService = inject(MapService);
  optionsMap!: {
    [k: string]: Option;
  };
  allData!: AllData;
  groupsMap: {
    [k: string]: boolean;
  } = {
    educationCentersGroups: false,
    trafficLightsGroups: false,
  };

  constructor() {
    this.expandedIndices.add(1);
  }

  ngOnInit(): void {
    this.mapService.allData$.subscribe({
      next: (data) => {
        this.allData = data;
      },
    });
    this.layersService.baseLayer$.subscribe({
      next: (data) => {
        this.baseLayerSelected = data;
      },
    });
    this.layersService.optionsMap$.subscribe({
      next: (data) => {
        this.optionsMap = data;
      },
    });
  }

  selectBaseLayer(baseLayer: string) {
    if (baseLayer === this.layersService.baseLayer) return;
    this.layersService.setBaseLayer(baseLayer);
  }

  selectOption(option: string, event: any, allGroup?: boolean, child?: Option) {
    const show = event.target.checked;
    if (child) {
      const index = this.optionsMap[option].children!.indexOf(child);
      this.optionsMap[option].children![index] = {
        show: show,
        layer: child.layer,
      };
      this.groupsMap[option] = this.optionsMap[option].children?.every(
        (value) => value.show === true
      )!;
    } else {
      if (!allGroup) {
        this.optionsMap[option].show = show;
      } else {
        this.optionsMap[option].children = this.optionsMap[
          option
        ].children!.map((element) => {
          return {
            show,
            layer: element.layer,
          };
        });
        this.groupsMap[option] = show;
      }
    }
    this.layersService.setOptionsMap(this.optionsMap);
  }

  selectBus(event: any) {
    const show = event.target.checked;
    this.layersService.setShowBusesOption(show);
  }

  toggleCollapse(index: number) {
    if (this.expandedIndices.has(index)) {
      this.expandedIndices.delete(index);
    } else {
      this.expandedIndices.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedIndices.has(index);
  }
}
