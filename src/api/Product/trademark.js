import request from '@/utils/request'

// 1.请求品牌分页信息
export const getPageList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });


// 2.添加修改品牌信息

export const addUpdatetrademark = (tmForm) => {
    if (tmForm.id) {
        // 修改
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tmForm });
    } else {
        // 添加
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tmForm });
    }
}

// 3.删除品牌信息
export const deleteTrademark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });
