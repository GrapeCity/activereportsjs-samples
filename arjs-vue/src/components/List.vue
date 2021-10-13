<template>
  <div>
    <h5 class="list-title">{{ title }}</h5>
    <ul class="list">
      <li
        v-for="(item, index) in items"
        :key="index"
        v-on:click="$emit('selectionChanged', index)"
        class="list-item"
        v-bind:class="{
          active: index === currentIndex,
          'gc-accent-color': index === currentIndex,
        }"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: "List",
  props: {
    title: String,
    items: Array,
    currentIndex: Number,
  },
};
</script>

<style>
.list {
  list-style: none;
  padding: 0;
  margin: 6px 0;
  overflow: auto;
}

.list-title {
  align-items: center;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  font-size: 1em;
  font-weight: 400;
  height: 52px;
  margin: 0 10px;
  padding: 0 2px;
  user-select: none;
}

.list-item {
  font-size: 0.875em;
  cursor: pointer;
  padding: 6px 30px 6px 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.list-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.list-item.active {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
