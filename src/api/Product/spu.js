import request from '@/utils/request'

// GET /admin/product/baseTrademark/getTrademarkList
//GET /admin/product/baseSaleAttrList
// GET /admin/product/spuImageList/{spuId}
export const getSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取spu基本信息
export const getSpuById = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

// 获取品牌信息
export const getTrademarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' });

// 销售属性
export const getSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });

// 获取图片列表
export const getSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

export const addUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data: spuInfo,
        })
    } else {
        request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data: spuInfo,
        })
    }
}


// 删除spu

export const deleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });

