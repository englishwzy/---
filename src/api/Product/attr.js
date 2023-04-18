import request from '@/utils/request'

// 一级分类id
export const getCategory1Id = (id) => request({ url: `/admin/product/getCategory1`, method: 'get' });

// 二级分类id
export const getCategory2Id = (id) => request({ url: `/admin/product/getCategory2/${id}`, method: 'get' });

// 三级分类id
export const getCategory3Id = (id) => request({ url: `/admin/product/getCategory3/${id}`, method: 'get' });

// 商品基础属性接口
export const getAttr = (id1, id2, id3) => request({ url: `/admin/product/attrInfoList/${id1}/${id2}/${id3}`, method: 'get' })

// 新增修改商品基础属性
export const saveAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data });
