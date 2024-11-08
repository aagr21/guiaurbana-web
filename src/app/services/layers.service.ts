import { Injectable } from '@angular/core';
import { AllData, LineRoute } from '@models/interfaces';
import { geoJSON, icon, Layer, marker, LatLng } from 'leaflet';
import { Feature, Geometry, Point } from 'geojson';
import { BehaviorSubject } from 'rxjs';

export interface Option {
  show?: boolean;
  layer?: Layer;
  children?: Option[];
}

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  private _baseLayerBS = new BehaviorSubject<string>(undefined!);
  get baseLayer() {
    return this._baseLayerBS.getValue();
  }
  get baseLayer$() {
    return this._baseLayerBS.asObservable();
  }
  setBaseLayer(baseLayer: string) {
    this._baseLayerBS.next(baseLayer);
  }

  private _optionsMapBS = new BehaviorSubject<{
    [k: string]: Option;
  }>(undefined!);
  get optionsMap$() {
    return this._optionsMapBS.asObservable();
  }
  get optionsMap() {
    return this._optionsMapBS.getValue();
  }
  setOptionsMap(optionsMap: { [k: string]: Option }) {
    this._optionsMapBS.next(optionsMap);
  }

  private _showBusesOptionBS = new BehaviorSubject<boolean>(false);
  get showBusesOption$() {
    return this._showBusesOptionBS.asObservable();
  }
  setShowBusesOption(value: boolean) {
    this._showBusesOptionBS.next(value);
  }

  private _lineRouteBS = new BehaviorSubject<LineRoute>(undefined!);
  get lineRoute$() {
    return this._lineRouteBS.asObservable();
  }
  setLineRoute(value?: LineRoute) {
    this._lineRouteBS.next(value!);
  }

  educationCentersGroupsObj: { [p: string]: string } = {
    'MÓDULOS EDUCATIVOS': 'MÓDULO EDUCATIVO',
    'COLEGIOS PRIVADOS': 'COLEGIO PRIVADO',
    'EDUCACIÓN ESPECIAL': 'EDUCACIÓN ESPECIAL',
    UNIVERSIDADES: 'UNIVERSIDAD',
    INSTITUTOS: 'INSTITUTO',
    'EDUCACIÓN COMPLEMENTARIA': 'EDUCACIÓN COMPLEMENTARIA',
  };

  getOptionsMap(
    allData: AllData,
    camerasOnEachFeature: (
      feature: Feature<Geometry, any>,
      layer: Layer
    ) => void
  ): {
    [k: string]: Option;
  } {
    return {
      busStops: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: allData.busStops.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {},
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [27, 27],
                  iconUrl: '/assets/images/bus-stop.svg',
                }),
              });
            },
          }
        ),
      },
      cityCameras: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: allData.cityCameras.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {
                  location: element.location,
                  camera: element.id,
                  urlVideo: '/assets/videos/traffic.mp4',
                },
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [52, 52],
                  iconUrl: '/assets/images/camera.svg',
                }),
              });
            },
            onEachFeature: camerasOnEachFeature,
          }
        ),
      },
      speedReducers: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: allData.speedReducers.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {
                  location: element.location,
                },
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [23, 23],
                  iconUrl: '/assets/images/bump.svg',
                }),
              });
            },
            onEachFeature(feature, layer) {
              layer.bindPopup(feature.properties.location);
            },
          }
        ),
      },
      parkings: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: allData.parkings.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {
                  isFree: !element.isFull,
                  imageUrl: element.imageUrl,
                },
              };
            }),
          } as any,
          {
            pointToLayer(feature: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [40, 40],
                  iconUrl: `/assets/images/${
                    feature.properties.isFree ? 'parking-free' : 'parking-full'
                  }.svg`,
                }),
              });
            },
            onEachFeature(feature, layer) {
              layer.bindPopup(`
                <style>
                  .image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 200px;
                    background-color: #ffffff;
                    margin-bottom: 10px;
                    margin-left: 0;
                    margin-right: 0;
                  }

                  .image {
                    max-height: 100%;
                    max-width: 100%;
                    height: auto;
                    width: auto;
                  }
                </style>
                <div class='image-container'>
                <img src='${feature.properties.imageUrl}' class='image my-2' loading='lazy'>
                </div>
                `);
            },
          }
        ),
      },
      channelsRoutes: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: allData.channelsRoutes.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: element.geom.coordinates,
                },
                properties: { strokeColor: element.color },
              };
            }),
          } as any,
          {
            style(feature) {
              return {
                color: feature!.properties.strokeColor,
                weight: 3.5,
              };
            },
          }
        ),
      },
      educationCentersGroups: {
        children: allData.educationCentersGroups.map((group) => {
          return {
            show: false,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: group.educationCenters.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                    properties: {
                      name: `${this.educationCentersGroupsObj[group.type]}: ${
                        element.name
                      }`,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [24, 24],
                      iconUrl: '/assets/images/education.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.name);
                },
              }
            ),
          };
        }),
      },
      trafficLightsGroups: {
        children: allData.trafficLightsGroups.map((group) => {
          return {
            show: false,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: group.trafficLights.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                    properties: {
                      location: element.location,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [29, 29],
                      iconUrl: '/assets/images/traffic-light.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.location);
                },
              }
            ),
          };
        }),
      },
    };
  }
}
