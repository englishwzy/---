<template>
  <el-card>
    <div class="box" slot="header">
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"> </el-tab-pane>
        <el-tab-pane label="访问量" name="access"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span style="margin: 0 10px" @click="getDay">今日</span>
        <span style="margin: 0 10px" @click="setWeek">本周</span>
        <span style="margin: 0 10px" @click="setMouth">本月</span>
        <span style="margin: 0 10px" @click="setYear">本年</span>
        <el-date-picker
          style="margin: 0 10px"
          v-model="date"
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="fu">
      <el-row :gutter="10">
        <el-col :span="18">
          <div ref="chart" class="chart">dwadaw</div>
        </el-col>
        <el-col :span="6" class="right">
          <h2>门店{{ title }}排行</h2>
          <ul>
            <li>
              <span class="num">1</span>
              <span style="margin-left: 10px">肯德基</span>
              <span class="paiming">123456</span>
            </li>
            <li>
              <span class="num">2</span>
              <span style="margin-left: 10px">肯德基</span>
              <span class="paiming">123456</span>
            </li>
            <li>
              <span class="num">3</span>
              <span style="margin-left: 10px">肯德基</span>
              <span class="paiming">123456</span>
            </li>
            <li>
              <span>4</span>
              <span style="margin-left: 10px">肯德基</span>
              <span class="paiming">123456</span>
            </li>
            <li>
              <span>5</span>
              <span style="margin-left: 10px">肯德基</span>
              <span class="paiming">123456</span>
            </li>
            <li>
              <span>6</span>
              <span style="margin-left: 10px">肯德基</span>
              <span class="paiming">123456</span>
            </li>
            <li>
              <span>7</span>
              <span style="margin-left: 10px">肯德基</span>
              <span class="paiming">123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import echarts from "echarts";
export default {
  name: "sale",
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    data1() {
      // [100, 52, 20, 34, 30, 330, 220, 100, 20, 90, 110, 280]
      return this.activeName == "sale"
        ? [10, 52, 200, 334, 390, 330, 220, 100, 20, 90, 110, 28]
        : [100, 52, 20, 34, 30, 330, 220, 100, 20, 90, 110, 280];
    },
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.chart);
    //配置数据
    this.mycharts.setOption({
      title: {
        text: "销售趋势",
      },
      color: "cyan",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 100, 20, 90, 110, 28],
        },
      ],
    });

    //顶部是mounted：为什么第一次没有数据，没有数据因此不显示
  },
  watch: {
    title(newV, old) {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.data1,
          },
        ],
      });
    },
  },
  methods: {
    getDay() {
      let day = dayjs().format("YYYY-MM-DD");
      console.log(day);
      this.date = [day, day];
    },
    setWeek() {
      let day = dayjs().day(1).format("YYYY-MM-DD");
      let day2 = dayjs().day(7).format("YYYY-MM-DD");
      console.log(day, day2);
      this.date = [day, day2];
    },
    setMouth() {
      let day = dayjs().startOf("month").format("YYYY-MM-DD");
      let day2 = dayjs().endOf("month").format("YYYY-MM-DD");
      console.log(day, day2);
      this.date = [day, day2];
    },
    setYear() {
      let day = dayjs().startOf("year").format("YYYY-MM-DD");
      let day2 = dayjs().endOf("year").format("YYYY-MM-DD");
      console.log(day, day2);
      this.date = [day, day2];
    },
  },
};
</script>

<style>
* {
  list-style: none;
}
.box {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.chart {
  width: 100%;
  height: 300px;
}
.paiming {
  float: right;
}
.num {
  text-align: center;
  float: left;
  width: 15px;
  height: 15px;
  font-size: 15px;
  background-color: black;
  border-radius: 50%;
  color: #fff;
}
ul {
  padding: 0px;
}
.fu ul li {
  height: 8%;
  margin: 10px 0px;
}
.right span {
  margin: 0px 10px;
}
</style>