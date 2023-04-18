<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "progressCharts",
  mounted() {
    let mycharts1 = echarts.init(this.$refs.echarts);
    mycharts1.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        // 设置最小值最大值
        min: 0,
        max: 100,
      },
      yAxis: {
        //隐藏y轴
        show: false,
        type: "category",
      },
      //系列
      series: [
        {
          barWidth: 10,
          showBackground: true,
          backgroundColor: "#CCC",
          type: "bar",
          data: [67],
          label: {
            show: true,
            formatter: "|",
            position: "right",
          },
        },
      ],
      tooltip: {},
      color: "green",
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