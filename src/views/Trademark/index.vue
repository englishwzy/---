<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="medium"
      style="margin-bottom: 20px"
      @click="dialogFormVisible = true"
      >添加</el-button
    >
    <el-table :data="records" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="50px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="updateTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTrade(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      layout="prev, pager, next,jumper,->,sizes,total"
      :total="pageList.total"
      :page-size="pageList.size"
      :page-count="7"
      :current-page="this.page"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="getPageList2"
    >
    </el-pagination>

    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="this.tmForm.logoUrl"
              :src="this.tmForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUPdateadd">取 消</el-button>
        <el-button type="primary" @click="updateAddtademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  mounted() {
    this.getPageList();
  },
  data() {
    // 自定义验证规则
    let validateTmName = (rule, value, callback) => {
      // console.log(rule, value);
      // callback为放行
      if (value.length < 2 || value.length > 10) {
        return callback(new Error("年龄不能为空"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 3,
      records: [],
      pageList: {},
      dialogFormVisible: false,
      tmForm: { logoUrl: "", tmName: "" },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true }],
      },
    };
  },
  methods: {
    async getPageList(page = 1) {
      let result = await this.$API.Trademark.getPageList(page, this.limit);
      console.log(result);
      if (result.code == 200) {
        this.pageList = result.data;
        this.records = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
      }
    },

    async getPageList2(limit = 3) {
      let result = await this.$API.Trademark.getPageList(this.page, limit);
      console.log(result);
      if (result.code == 200) {
        this.pageList = result.data;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.records = result.data.records;
      }
    },

    handleAvatarSuccess(res, file) {
      console.log(res);
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 点击修改
    updateTrademark(row) {
      console.log(row);
      this.dialogFormVisible = true;
      // 浅拷贝
      this.tmForm = { ...row };
    },

    // 点击确定
    updateAddtademark() {
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid);bool类型
        if (!valid) {
          alert("验证失败");
        } else {
          // 把dialogue设置为取消
          this.dialogFormVisible = false;
          // console.log(this.$API);
          let result = await this.$API.Trademark.addUpdatetrademark(
            this.tmForm
          );
          console.log(result);
          if (result.code == 200) {
            // 消息提示
            this.$message({
              message: this.tmForm.id ? "修改品牌成功!" : "添加品牌成功！",
              type: "success",
            });
            this.tmForm.id ? this.getPageList(this.page) : this.getPageList();
          }
          // 请求完清空id
          this.tmForm.id = "";
          this.tmForm.logoUrl = "";
          this.tmForm.tmName = "";
        }
      });
    },

    // 点击取消
    cancelUPdateadd() {
      this.tmForm.logoUrl = "";
      this.tmForm.tmName = "";
      this.tmForm.id = "";
      this.dialogFormVisible = false;
    },

    // 删除
    deleteTrade(row) {
      this.$confirm("将删除此品牌信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.Trademark.deleteTrademark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(
              this.records.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>