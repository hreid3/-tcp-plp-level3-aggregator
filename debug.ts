import { Options, fetchL3Categories } from './src';

const parameters = {
  pagetype: 'boolean',
  'p-id': `categoryPathId:"47511>49012"`, // TODO: Dynamically generate
  rows: 10,
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

const options: Options = {
  unbxdBase: 'https://search.unbxd.io/8c1bc6cc0fa47076d417690a1e5e1120/test-childrensplace-com702771523873394',
  categoryPathL2: '47511>49012',
  categoryIdsL3: ['54179', '54177', "54180", "54181"],
  headers: {},
  parameters,
};

const response = fetchL3Categories(options)
  .then((res) => {
    console.log("Horace final", res.data.response.products.length);
  })
  .catch(err => console.log(err));
