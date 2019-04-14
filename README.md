
# The Children's Place L3 Aggregator

Aggregates L3 Categories using a SEO L3 sort order to improve SLA business requirements.
This module uses a cutting edge tech (Typescript, async) to meet the requirement for both Mobile App
and Desktop platforms.

## Usage

```js
import { fetchL3Categories } from '@tcp/plp-level3-aggregator';
const response = fetchL3Categories(options)
  .then((res) => {
    // Do something with the response
  })
  .catch(err => console.log(err));
```

## Options
The Options are as follows:

```js
const options = {
  // The generated unbxdBase URL
  unbxdBase: 'https://search.unbxd.io/8c1bc6cc0fa47076d417690a1e5e1120/test-childrensplace-com702771523873394',
  
  // A string with L1 > L2 category ids normally passed to unbxd 'p-id' request parameter
  categoryPathL2: '47511>49012',
  
  // A list of L3 catgory ids to fetch
  categoryIdsL3: ['54179', '54177', "54180", "54181"],
  
  // Headers normally passed to API client
  headers: {},
  
  // Parameters normally passed to API Client
  parameters,
};
````
## Sample parameters
Sample parameters.  Review debug script used to build module.  [./debug.ts]
```js
const parameters = {
  pagetype: 'boolean',
  'p-id': `categoryPathId:"47511>49012"`, // TODO: Dynamically generate
  rows: 100,
  start: 40,
  variants: true,
  'variants.count': 0,
  filter: null as any,
  version: 'V2',
  'facet.multiselect': true,
  selectedfacet: true,
  fields:
    'alt_img,style_partno,giftcard,TCPProductIndUSStore,TCPFitMessageUSSstore,' +
    'TCPFit,TCPWebOnlyFlagUSStore,TCPSwatchesUSStore,product_name,TCPColor,imagename,' +
    'productid,uniqueId,favoritedcount,TCPBazaarVoiceReviewCount,categoryPath3_fq,' +
    'categoryPath3,categoryPath3_catMap,product_short_description,min_list_price,min_offer_price,' +
    'TCPBazaarVoiceRating,seo_token,prodpartno,banner,facets,auxdescription,list_of_attributes,' +
    'numberOfProducts,redirect,searchMetaData,didYouMean,top_rated,TCPLoyaltyPromotionTextUSStore,' +
    'TCPLoyaltyPLCCPromotionTextUSStore,high_list_price,low_list_price,low_offer_price,high_offer_price',
};
```

## Development
- Download node 10.15.x
- Download yarn

```bash
yarn install && yarn build
```
