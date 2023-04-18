<template>
  <el-card>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spulist.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spulist.tmId">
          <el-option
            :label="trade.tmName"
            :value="trade.id"
            v-for="trade in tradeList"
            :key="trade.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="描述"
          rows="4"
          v-model="spulist.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 携带dev-api前缀 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="imageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="unselectAttrId"
          :placeholder="`还有${unselectedSaleAttr.length}未选择`"
          value=""
        >
          <el-option
            :label="unsale.name"
            :value="unsale"
            v-for="unsale in unselectedSaleAttr"
            :key="unsale.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="unselectedSaleAttr.length == 0"
          >添加销售属性</el-button
        >
        <!-- 销售属性 -->
        <el-table style="width: 100%" border :data="spulist.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="width">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                style="width: 80px"
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteSaleAttr(row, $index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-button type="primary" @click="saveSpu">保存</el-button>
      <el-button @click="cancelSave">取消</el-button>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spulist: {
        category3Id: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tradeList: [],
      saleList: [],
      imageList: [],
      saleId: "",
      unselectAttrId: "",
    };
  },
  methods: {
    handleRemove(file, fileList) {
      // file是删除的图片文件 filelist是删除完之后的文件列表；
      this.imageList = fileList;
      // console.log("@", file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      // res表示返回值，file表示添加的图片文件，filelist表添加完成后的文件列表。
      // console.log(res, file, fileList);
      this.imageList = fileList;
    },
    cancelSave() {
      Object.assign(this._data, this.$options.data());
      this.$emit("cancelSave", 1);
    },

    // 点击父组件修改发请求
    async getList(row) {
      // 点击父元素的修改按钮后，利用ref调用子元件的函数。
      // console.log(row);
      let result = await this.$API.Spu.getSpuById(row.id);
      let tradeResult = await this.$API.Spu.getTrademarkList();
      let saleResult = await this.$API.Spu.getSaleAttrList();
      let imageResult = await this.$API.Spu.getSpuImageList(row.id);

      console.log(imageResult);
      if (result.code == 200) {
        this.spulist = result.data;
      }
      if (tradeResult.code == 200) {
        this.tradeList = tradeResult.data;
      }
      if (saleResult.code == 200) {
        this.saleList = saleResult.data;
      }
      if (imageResult.code == 200) {
        this.imageList = imageResult.data;
        this.imageList.forEach((item) => {
          (item.name = item.imgName), (item.url = item.imgUrl);
        });
      }
    },

    // 添加销售属性
    addSaleAttr() {
      const { id, name } = this.unselectAttrId;
      this.spulist.spuSaleAttrList.push({
        baseSaleAttrId: id,
        saleAttrName: name,
        spuSaleAttrValueList: [],
      });
      this.unselectAttrId = "";

      // console.log(newsale);
    },

    // 点击添加tag
    showInput(row) {
      //由于对象后加的属性是非响应式的，所以使用$set变成响应式。
      // row.inputVisible = true;
      // row.inputValue = "";
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    // 添加tag失去焦点
    handleInputConfirm(row) {
      if (row.inputValue.trim() == "") {
        return this.$message("请输入不为空的属性值");
      }
      const { baseSaleAttrId, inputValue } = row;
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      row.inputVisible = false;
    },
    handleClose(row, index) {
      // 删除index索引的元素
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 删除属性
    deleteSaleAttr(row, $index) {
      this.spulist.spuSaleAttrList.splice($index, 1);
    },
    // 点击保存发起请求
    async saveSpu() {
      this.spulist.spuImageList = this.spuImageList;
      let result = this.$API.Spu.addUpdateSpu(this.spulist);
      // 保存成功则跳回原来的页面。

      // 清空原来的数据
      // this._data是现在的数据，options.data()里面的是data配置最开始的数据，用assign合并两者，清空

      if (this.spulist.id) {
        Object.assign(this._data, this.$options.data());
        this.$message({ type: "success", message: "修改成功！" });
        this.$emit("saveSuccess", 1);
      } else {
        Object.assign(this._data, this.$options.data());
        this.$message({ type: "success", message: "添加成功！" });
        this.$emit("saveSuccess", 2);
      }
    },

    // 点击父元素的添加spu调用此函数
    async addSpu(category3Id) {
      console.log(category3Id);
      this.spulist.category3Id = category3Id;
      // 发请求，但只需要请求品牌和销售属性就可
      // 点击父元素的修改按钮后，利用ref调用子元件的函数。
      // console.log(row);
      let tradeResult = await this.$API.Spu.getTrademarkList();
      let saleResult = await this.$API.Spu.getSaleAttrList();

      if (tradeResult.code == 200) {
        this.tradeList = tradeResult.data;
      }
      if (saleResult.code == 200) {
        this.saleList = saleResult.data;
      }
    },
  },
  computed: {
    unselectedSaleAttr() {
      return this.saleList.filter((item) => {
        // 销售属性的每一个对象，与已有属性进行对比
        // every，搜寻这个数组中是否全部都不是这个id，即未选中的id
        return this.spulist.spuSaleAttrList.every((item1) => {
          return item1.baseSaleAttrId != item.id;
        });
      });
    },
    spuImageList() {
      return this.imageList.map((item) => {
        item.imgUrl = item.id ? item.imgUrl : item.response.data;
        item.imgName = item.name;
        return item;
      });
    },
  },
};
</script>

<style>
</style>