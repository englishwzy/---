<template>
  <el-card class="box-card">
    <!-- inline表示行内表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="tmForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="tmForm.category1Id"
          @change="handler1"
          :disabled="!show"
        >
          <!-- 组件内部封装了change自定义事件 -->
          <el-option
            :label="list.name"
            :value="list.id"
            v-for="list in list1"
            :key="list.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="tmForm.category2Id"
          @change="handler2"
          :disabled="!show"
        >
          <el-option
            :label="list.name"
            :value="list.id"
            v-for="list in list2"
            :key="list.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="tmForm.category3Id"
          @change="handler3"
          :disabled="!show"
        >
          <el-option
            :label="list.name"
            :value="list.id"
            v-for="list in list3"
            :key="list.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "CategorySelect",
  mounted() {
    this.getCategory1();
  },
  data() {
    return {
      tmForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      list1: [],
      list2: [],
      list3: [],
    };
  },
  props: ["show"],
  methods: {
    async getCategory1() {
      let result = await this.$API.Attr.getCategory1Id();
      console.log(result);
      if (result.code == 200) {
        console.log(result.data);
        this.list1 = result.data;
      }
    },

    async getCategory2(id) {
      let result = await this.$API.Attr.getCategory2Id(id);
      console.log(result);
      if (result.code == 200) {
        console.log(result.data);
        this.list2 = result.data;
      }
    },

    async getCategory3(id) {
      let result = await this.$API.Attr.getCategory3Id(id);
      console.log(result);
      if (result.code == 200) {
        console.log(result.data);
        this.list3 = result.data;
      }
    },

    // 处理1id
    handler1(id) {
      this.tmForm.category3Id = "";
      this.tmForm.category2Id = "";
      this.list3 = [];
      this.list2 = [];
      let { category1Id, category2Id, category3Id } = this.tmForm;
      if (id) {
        this.getCategory2(id);
      }
      this.$emit("getCategoryId", { category1Id, category2Id, category3Id });
    },
    // 处理2id
    handler2(id) {
      this.tmForm.category3Id = "";
      this.list3 = [];
      let { category1Id, category2Id, category3Id } = this.tmForm;
      if (id) {
        this.getCategory3(id);
      }
      this.$emit("getCategoryId", { category1Id, category2Id, category3Id });
    },
    handler3() {
      let { category1Id, category2Id, category3Id } = this.tmForm;
      if (category1Id && category2Id && category3Id) {
        // console.log(category1Id, category2Id, category3Id);
        this.$emit("getCategoryId", { category1Id, category2Id, category3Id });
      }
    },
  },
};
</script>

<style>
</style>

