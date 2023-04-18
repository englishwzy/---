import request from '@/utils/request'

//1。 spu模块中有关sku的接口

// 获取商品基础属性 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const getAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });


// 获取销售spu属性列表      GET /admin/product/spuSaleAttrList/{spuId}
export const getSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

// 获取spu的图片列表        GET /admin/product/spuImageList/{spuId}
export const getImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });


// 保存sku
export const addSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data: skuInfo });


// 展示sku
export const showSku = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });


// 2.sku模块
// 获取sku数据
export const getSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: "get" });


// 下架操作
// GET /admin/product/cancelSale/{skuId}
export const downSku = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });

// 上架操作
// GET /admin/product/onSale/{skuId}
export const upSku = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });


// 拿到sku详细信息      GET /admin/product/getSkuById/{skuId}
export const getDetail = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });

