<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "barCharts",
  mounted() {
    let mycharts1 = echarts.init(this.$refs.echarts);
    mycharts1.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          smooth: true,
          type: "bar",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 99, 1, 24],
        },
      ],
      tooltip: {},
      color: "skyblue",
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.echarts {
  /* border: 1px solid red; */
  width: 100%;
  height: 100%;
}
</style>