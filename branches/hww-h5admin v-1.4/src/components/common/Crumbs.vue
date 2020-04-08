<template>
  <div class="crumbsBox">
    <slot name="crumbs"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style>
.crumbsBox{
  border-bottom: 1px solid darkgrey;
  padding-bottom: 18px;
  margin-bottom: 20px;
}
</style>
