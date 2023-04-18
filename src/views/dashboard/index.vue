<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <Card></Card>
    <Sale />
  </div>
</template>

<script>
import Sale from "./sale";
import Card from "./card";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    Card,
    Sale,
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 50px 20px;
}
.dashboard {
  &-container {
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
