<template>
  <el-card>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input type="number" v-model.number="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量(千克)"
          v-model.number="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            :inline="true"
            v-for="attr in AttrInfoList"
            :key="attr.id"
            style="margin-top: 10px"
          >
            <el-select v-model="attr.attrAndId" placeholder="请选择">
              <el-option
                :label="attrmini.valueName"
                :value="`${attrmini.id}:${attrmini.attrId}`"
                v-for="attrmini in attr.attrValueList"
                :key="attrmini.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" width="80px">
          <el-form-item
            :label="sale.saleAttrName"
            v-for="sale in SaleAttrList"
            :key="sale.id"
          >
            <el-select v-model="sale.attrIdAndId" placeholder="请选择">
              <el-option
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="`${spuSaleAttrValue.id}:${spuSaleAttrValue.baseSaleAttrId}`"
                v-for="spuSaleAttrValue in sale.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="ImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="width"> </el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置为默认</el-button
              >
              <el-button type="success" size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancelSku">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      skuInfo: {
        // 父组件传的
        spuId: 0,
        tmId: 0,
        category3Id: 0,
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        // 第二类，v-model收集
        price: 0,
        skuDefaultImg: "",
        skuDesc: "",
        weight: 0,
        skuName: "",
        skuImageList: [
          // {
          //   // id: 0,
          //   // imgName: "string",
          //   // imgUrl: "string",
          //   // isDefault: "string",
          //   // skuId: 0,
          //   // spuImgId: 0,
          // },
        ],

        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      AttrInfoList: [],
      SaleAttrList: [],
      ImageList: [],
      Image: [],
    };
  },
  methods: {
    // 点击取消，返回spu
    cancelSku() {
      Object.assign(this._data, this.$options.data());
      this.$emit("cancelSku");
    },

    // 发起请求
    async getData(row, id1, id2) {
      this.spu = row;
      this.skuInfo.id = row.id;
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.tmId = row.tmId;

      console.log("测试", row, id1, id2);
      // 1.获取商品基础属性
      let result = await this.$API.Sku.getAttrInfoList(
        id1,
        id2,
        row.category3Id
      );
      console.log("base", result);
      // 2.获取销售spu属性列表
      let result2 = await this.$API.Sku.getSaleAttrList(row.id);
      console.log("sale", result2);

      // 3.获取spu的图片列表
      let result3 = await this.$API.Sku.getImageList(row.id);
      console.log("image", result3);

      if (result.code == 200) {
        this.AttrInfoList = result.data;
      }
      if (result2.code == 200) {
        this.SaleAttrList = result2.data;
      }
      if (result3.code == 200) {
        this.ImageList = result3.data;
        this.ImageList.forEach((item) => {
          this.$set(item, "isDefault", "0");
        });
      }
    },
    // 选择图片
    handleSelectionChange(selection) {
      console.log(selection);
      this.Image = selection;
    },
    // 排他改变默认
    changeDefault(row) {
      console.log(row);
      this.ImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
    },

    // 保存整理数据

    async save() {
      //  使用reduce完成整理数据
      this.skuInfo.skuAttrValueList = this.AttrInfoList.reduce((prev, item) => {
        if (item.attrAndId) {
          const [attrId, valueId] = item.attrAndId.split(":");
          prev.push({ attrId: attrId + 0, valueId: valueId + 0 });
        }
        return prev;
      }, []);

      // 销售属性同理
      this.skuInfo.skuSaleAttrValueList = this.SaleAttrList.reduce(
        (prev, item) => {
          if (item.attrIdAndId) {
            const [saleAttrId, saleAttrValueId] = item.attrIdAndId.split(":");
            prev.push({
              saleAttrId: saleAttrId + 0,
              saleAttrValueId: saleAttrValueId + 0,
            });
          }
          return prev;
        },
        []
      );

      this.skuInfo.skuImageList = this.Image.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      // 提交数据
      let result = await this.$API.Sku.addSku(this.skuInfo);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加成功" });
        // 清空数据
        Object.assign(this._data, this.$options.data());
        this.$emit("cancelSku");
      }
    },
  },
};
</script>

<style>
</style>