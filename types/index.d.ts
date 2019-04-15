export interface ServiceParameters {
  start: number;
  rows: number;
  [propName: string]: any;
}
export interface Options {
  unbxdBase: string;
  categoryPathL2: string;
  categoryIdsL3: string[];
  parameters: ServiceParameters;
  headers: any;
}
export function fetchL3Categories(options: Options): Promise<any>;
export default fetchL3Categories;
