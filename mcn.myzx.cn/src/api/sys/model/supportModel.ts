export interface RegionModel {
  label: number | string;
  value: number | string;
  children?: RegionModel[];
}
