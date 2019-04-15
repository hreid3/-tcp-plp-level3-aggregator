import axios from 'axios';

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

const getResponse = (response: any): any => response && response.data && response.data.response;
const getCategoryCount = async (options: Options, categoryL3: string): Promise<number> => {
  let count = 0;
  try {
    const params = {...options.parameters, start: 0, rows: 1, fields: 'alt_img', 'p-id': `categoryPathId:"${options.categoryPathL2}>${categoryL3}"`};
    const response = await axios.get(`${options.unbxdBase}/category`, {headers: options.headers, params});
    count = getResponse(response) && getResponse(response).numberOfProducts || 0;
    // console.log("Fetch row count for", categoryL3, count);
  } catch (ex) {
    return Promise.reject(ex);
  }
  return Promise.resolve(count);
};

export const fetchL3Categories = (options: Options): Promise<any> => {
  return new Promise(async (res, rej) => {
    try {
      // we need to fetch the counts from each required category based on the options data
      const { start, rows } = options.parameters;
      const end = start + rows;
      let rowsCntr = 0;
      let firstResponse = null;
      let load = false;
      let calcStart = 0;
      let calcRows = 0;
      let remaining = rows;
      for (const catId of options.categoryIdsL3) {
        const l3Rows = await getCategoryCount(options, catId);
        if (l3Rows + rowsCntr > start) {
          calcStart = 0;
          if (!load) {
            calcStart = l3Rows - ((l3Rows + rowsCntr) - start);
            calcRows = l3Rows - calcStart < remaining ? l3Rows - calcStart : remaining;
            rowsCntr = (l3Rows - calcRows) - calcStart;
            load = true;
          } else {
            calcRows = l3Rows < remaining ? l3Rows : remaining;
          }
          const unbxdResponse = await axios.get(`${options.unbxdBase}/category`, {headers: options.headers, params: {...options.parameters, start: calcStart, rows: calcRows}});
          if (!firstResponse) {
            firstResponse = unbxdResponse;
          } else {
            const response = getResponse(firstResponse)
            response.products.push(...unbxdResponse.data.response.products);
          }
          remaining -= calcRows;
        }
        rowsCntr += l3Rows;
        if (rowsCntr >= end) {
          break;
        }
      }
      res(firstResponse);
    } catch (e) {
      rej(e);
    }
  });
};

export default fetchL3Categories;
