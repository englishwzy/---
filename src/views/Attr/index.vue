<template>
  <div>
    <CategorySelect
      @getCategoryId="getCategoryId"
      :show="isShowTable"
      style="margin: 20px 0"
    ></CategorySelect>

    <el-card class="box-card" style="margin: 20px 0px">
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="clickAddAttr"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attr">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                style="margin: 0 10px"
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="clickUpdateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 修改删除 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" class="demo-form-inline" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="cancel">取消</el-button>
        <el-table style="width: 100%" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值"
                v-show="!isShowValue && row"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span v-else @click="focusAttr(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="deleteAttr($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttr"
          :disabled="attrInfo.attrValueList.length <= 0"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      attr: [],
      category3Id: "",
      isShowTable: true,
      isShowValue: false,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    async getCategoryId({ category1Id, category2Id, category3Id }) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      if (category1Id && category2Id && category3Id) {
        let result = await this.$API.Attr.getAttr(
          category1Id,
          category2Id,
          category3Id
        );
        console.log(result);
        if (result.code == 200) {
          this.attr = result.data;
        }
      }
    },

    // 点击添加属性值
    addAttrValue() {
      // push方法能改变元数组，vue能监测到数据的变化。
      this.attrInfo.attrValueList.push({
        // attrid默认是undefined,因为添加新属性，没有对应的attrid
        attrId: this.attrInfo.id ? this.attrInfo.id : undefined,
        valueName: "",
        flag: true,
        // 添加flag主要是为了方便切换查看和编辑
      });
      // 新添加的一项，直接获取焦点。
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //点击添加属性
    clickAddAttr() {
      this.isShowTable = false;
      // 解决数据回显的问题
      // 清空数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 点击修改属性
    clickUpdateAttr(row) {
      this.isShowTable = false;
      console.log(row);
      // 这里浅拷贝已经不能解决问题，复杂数据类型传的还是地址，所以即使点击取消数据还是会改变。
      // 所以需要深拷贝
      this.attrInfo = cloneDeep(row);

      // 后加的属性vue是监测不到的，不是响应式。
      // 后加的属性使用$set
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },

    // 点击取消
    cancel() {
      this.isShowTable = true;

      // 清空数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      };
    },

    // 失去焦点
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }

      let result = this.attrInfo.attrValueList.some((item) => {
        if (item != row) {
          return item.valueName == row.valueName;
        }
      });
      // 解决属性值不能相同的问题。
      if (result) {
        this.$message("属性值不能相同");
        return;
      }
      row.flag = false;
    },
    // 自动聚焦
    focusAttr(row, index) {
      row.flag = true;
      // 点击时，数据才发生变化，而input框是v-if生成的，需要时间进行渲染，所以结构渲染完毕才能获取到refs
      // 使用nexttick，等结构渲染完，再进行焦点
      this.$nextTick(() => {
        console.log(this.$refs[index]);
        this.$refs[index].focus();
      });
    },

    // 删除
    deleteAttr(index) {
      // 使用splice删除元素
      this.attrInfo.attrValueList.splice(index, 1);
    },

    // 保存发起请求
    async saveAttr() {
      let bool = this.attrInfo.attrValueList.some((item) => {
        return item.flag == true;
      });
      if (!bool) {
        this.attrInfo.attrValueList.forEach((item) => {
          delete item.flag;
        });
        console.log(this.attrInfo);
        let result = await this.$API.Attr.saveAttr(this.attrInfo);
        console.log(result);
        if (result.code == 200) {
          this.$message({ type: "success", message: "保存成功" });
          this.isShowTable = true;
          let { category1Id, category2Id, category3Id } = this;
          this.getCategoryId({ category1Id, category2Id, category3Id });
        } else {
          this.$message("保存失败");
        }
      }
    },
  },
};
</script>

<style>
</style>