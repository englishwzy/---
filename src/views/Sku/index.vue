<template>
  <div>
    <el-table style="width: 100%" :data="skuList.records" border>
      <el-table-column type="index" label="序号" width="width" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="width">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80px">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="80px">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isSale != true"
            type="success"
            size="mini"
            icon="el-icon-sort-up"
            @click="updown(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-sort-down"
            @click="down(row)"
            v-else
          ></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="getDetail(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      :page-size="limit"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->,sizes, total"
      :total="50"
      @current-change="changeCurrent"
      @size-change="changeSize"
    >
    </el-pagination>

    <!-- 抽屉 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="50%"
    >
      <el-row style="margin-top: 100px">
        <el-col :span="5" style="margin: 10px">
          <div class="grid-content bg-purple" style="text-align: center">
            名称
          </div></el-col
        >
        <el-col :span="16" style="margin: 10px">
          <div class="grid-content bg-purple-light">
            {{ skuDetail.skuName }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5" style="margin: 10px">
          <div class="grid-content bg-purple" style="text-align: center">
            描述
          </div></el-col
        >
        <el-col :span="16" style="margin: 10px">
          <div class="grid-content bg-purple-light">
            {{ skuDetail.skuDesc }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5" style="margin: 10px">
          <div class="grid-content bg-purple" style="text-align: center">
            价格
          </div></el-col
        >
        <el-col :span="16" style="margin: 10px"
          >{{ skuDetail.price }}
          <div class="grid-content bg-purple-light"></div
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="5" style="margin: 10px">
          <div class="grid-content bg-purple" style="text-align: center">
            平台属性
          </div></el-col
        >
        <el-col :span="16" style="margin: 10px">
          <el-tag
            type="success"
            v-for="l in skuDetail.skuAttrValueList"
            :key="l.id"
          >
            {{ l.attrId }}--{{ l.valueId }}
          </el-tag></el-col
        >
      </el-row>
      <el-row>
        <el-carousel height="300px">
          <el-carousel-item
            v-for="item in skuDetail.skuImageList"
            :key="item.id"
          >
            <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%" />
          </el-carousel-item>
        </el-carousel>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  mounted() {
    this.getData();
  },
  data() {
    return {
      page: 1,
      limit: 10,
      skuList: {},
      drawer: false,
      skuDetail: {},
    };
  },
  methods: {
    async getData(page = 1, limit = 10) {
      let result = await this.$API.Sku.getSkuList(page, limit);
      console.log(result);
      if (result.code == 200) {
        this.skuList = result.data;
      }
    },
    changeCurrent(page) {
      this.page = page;
      this.getData(this.page, this.limit);
    },
    changeSize(limit) {
      this.limit = limit;
      this.getData(this.page, this.limit);
    },

    // 上架操作
    async updown(row) {
      console.log(row);
      let result = await this.$API.Sku.upSku(row.id);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "上架成功！" });
        this.getData(this.page, this.limit);
      }
    },

    async down(row) {
      let result = await this.$API.Sku.downSku(row.id);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "下架成功！" });
        this.getData(this.page, this.limit);
      }
    },

    // 点击详情，获取详情信息
    async getDetail(row) {
      let result = await this.$API.Sku.getDetail(row.id);
      console.log(result);
      this.drawer = true;
      if (result.code == 200) {
        this.skuDetail = result.data;
      }
    },
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: skyblue;
  border-radius: 50%;
}
</style>