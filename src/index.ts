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

interface CategoryCounts {
  id?: string;
  count?: number;

  [propName: string]: any;
}

const getCategoryCounts = async (options: Options): Promise<CategoryCounts> => {
  const categoryCounts: CategoryCounts = {};
  try {
    const countParameters = {
      'facet.multilevel': 'categoryPath',
      'f.categoryPath.nameId': 'true',
      'f.categoryPath.max.depth': 4,
    };
    const params = {
      ...options.parameters,
      ...countParameters,
      start: 0,
      rows: 0,
      fields: 'alt_img',
      'p-id': `categoryPathId:"${options.categoryPathL2}"`
    };
    const response = await axios.get(`${options.unbxdBase}/category`, {headers: options.headers, params});
    if (response
      && response.data
      && response.data.facets
      && response.data.facets.multilevel
      && response.data.facets.multilevel.bucket
      && response.data.facets.multilevel.bucket.length) {
      const buckets = response.data.facets.multilevel.bucket;
      buckets.forEach((bucket: { values: any }) => {
        bucket.values.forEach(({id, count}: any) => {
          categoryCounts[id] = count;
        });
      });
    }
  } catch (ex) {
    return Promise.reject(ex);
  }
  return Promise.resolve(categoryCounts);
};
export const fetchL3Categories = (options: Options): Promise<any> => {
  return new Promise(async (res, rej) => {
    try {
      // we need to fetch the counts from each required category based on the options data
      const {start, rows} = options.parameters;
      const end = start + rows;
      let rowsCntr = 0;
      let firstResponse = null;
      let load = false;
      let calcStart = 0;
      let calcRows = 0;
      let remaining = rows;
      const categoryCounts = await getCategoryCounts(options);
      const numberOfProducts = Object.keys(categoryCounts).reduce((acc, curr) => acc + categoryCounts[curr], 0);
      for (const catId of options.categoryIdsL3) {
        const l3Rows = categoryCounts[catId];
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
          const unbxdResponse = await axios
            .get(`${options.unbxdBase}/category`,
              {
                headers: options.headers,
                params: {
                  ...options.parameters,
                  'p-id': `categoryPathId:"${options.categoryPathL2}>${catId}"`,
                  start: calcStart,
                  rows: calcRows
                }});
          if (!firstResponse) {
            firstResponse = unbxdResponse;
          } else {
            const response = getResponse(firstResponse);
            response.products.push(...unbxdResponse.data.response.products);
          }
          remaining -= calcRows;
        }
        rowsCntr += l3Rows;
        if (rowsCntr >= end || !remaining) {
          break;
        }
      }
      if (firstResponse) {
        firstResponse.data.response.numberOfProducts = numberOfProducts;
      } else {
        // Return an empty response to mimick Solr
        firstResponse = {
          data: {
            response: {
              numberOfProducts: 0,
              products: [],
              start: 0,
            },
            facets: {},
            searchMetaData: {},
          }
        };
      }
      res(firstResponse);
    } catch (e) {
      rej(e);
    }
  });
};

export default fetchL3Categories;
