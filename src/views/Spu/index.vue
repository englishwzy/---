<template>
  <div>
    <!-- 1.三级联动 -->
    <CategorySelect
      style="margin: 20px 0"
      :show="isShowTable == 1"
      @getCategoryId="getCategoryId"
    ></CategorySelect>

    <!-- 2.数据显示区域 -->
    <el-card v-if="isShowTable == 1">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addSpu"
        :disabled="category3Id == ''"
        >添加SPU</el-button
      >
      <el-table style="width: 100%" :data="spuRecords.records" border>
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="width">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row }">
            <HintButton
              title="添加sku"
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click.native="addSku(row)"
            ></HintButton>
            <HintButton
              title="修改spu"
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click.native="getList(row)"
            ></HintButton>
            <HintButton
              title="查看当前spu全部sku列表"
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="showInfo(row)"
            ></HintButton>

            <el-popconfirm title="确定删除spu吗？" @onConfirm="deleteSpu(row)">
              <HintButton
                title="删除spu"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, ->, sizes,total"
        :page-size="spuRecords.size"
        :total="spuRecords.total"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        style="text-align: center"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-card>
    <spuForm
      v-show="isShowTable == 2"
      @cancelSave="cancelSave"
      @saveSuccess="saveSuccess"
      ref="spuform"
    ></spuForm>
    <skuForm
      v-show="isShowTable == 3"
      ref="skuForm"
      @cancelSku="cancelSku"
    ></skuForm>

    <!-- skuinfo -->
    <el-dialog
      :title="`${spu.spuName}的skuInfo信息`"
      :visible.sync="dialogTableVisible"
      :before-close="beforeclose"
    >
      <el-table :data="skuList" v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuForm from "./spuForm";
import skuForm from "./skuForm";
export default {
  name: "Spu",
  data() {
    return {
      isShowTable: 1,
      page: 1,
      limit: 3,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuRecords: {},
      spu: {},
      skuList: [],
      dialogTableVisible: false,
      loading: true,
    };
  },
  components: {
    spuForm,
    skuForm,
  },
  methods: {
    async getCategoryId({ category1Id, category2Id, category3Id }) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      // console.log("前", this.page);
      if (category1Id && category2Id && category3Id) {
        let result = await this.$API.Spu.getSpuList(
          this.page,
          this.limit,
          this.category3Id
        );
        // console.log(this.page);
        console.log(result);
        if (result.code == 200) {
          this.spuRecords = result.data;
        }
      }
    },

    addSpu() {
      this.isShowTable = 2;
      this.$refs.spuform.addSpu(this.category3Id);
    },

    // 当前页面发生变化
    handleCurrentChange(page) {
      this.page = page;
      let { category1Id, category2Id, category3Id } = this;
      this.getCategoryId({ category1Id, category2Id, category3Id });
    },

    // size变化
    handleSizeChange(limit) {
      this.limit = limit;
      let { category1Id, category2Id, category3Id } = this;
      this.getCategoryId({ category1Id, category2Id, category3Id });
    },
    cancelSave(index) {
      this.isShowTable = index;
    },
    // 单击修改
    getList(row) {
      this.isShowTable = 2;
      // console.log(row);
      this.$refs.spuform.getList(row);
    },

    // 更新成功
    saveSuccess(index) {
      this.isShowTable = 1;
      console.log(index);
      // 如果是添加，则跳转到第一页，反之修改则回到原页数。
      if (index == 2) {
        this.page = 1;
      }
      let { category1Id, category2Id, category3Id } = this;
      this.getCategoryId({ category1Id, category2Id, category3Id });
    },

    // 删除spu
    async deleteSpu(row) {
      let result = await this.$API.Spu.deleteSpu(row.id);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功！" });
      }
      if (this.spuRecords.records.length <= 1) {
        this.page = this.page - 1;
      }
      console.log(this.page);
      let { category1Id, category2Id, category3Id } = this;
      this.getCategoryId({ category1Id, category2Id, category3Id });
    },
    // 1.添加sku
    addSku(row) {
      this.isShowTable = 3;
      console.log(this.$refs.skuForm);
      this.$refs.skuForm.getData(row, this.category1Id, this.category2Id);
    },
    // 2.取消显示sku
    cancelSku() {
      this.isShowTable = 1;
    },

    // 3.展示skuinfo
    async showInfo(row) {
      this.dialogTableVisible = true;
      console.log(row);
      this.spu = row;
      let result = await this.$API.Sku.showSku(row.id);
      console.log(result);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    beforeclose(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>