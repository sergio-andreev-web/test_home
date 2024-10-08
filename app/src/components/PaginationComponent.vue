<template>
  <div class="pagination">
    <div class="items-per-page">
      <label for="itemsPerPage">1-{{itemsPerPage}} из {{totalItems}} записей</label>
      <select id="itemsPerPage" v-model="localItemsPerPage" @change="changeItemsPerPage">
        <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <div>
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Назад</button>
      <span v-for="page in pages" :key="page" class="page-number" :class="{ active: page === currentPage }">
      <button @click="changePage(page)">{{ page }}</button>
    </span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Вперед</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      itemsPerPageOptions: [10, 25, 50, 100],
      localItemsPerPage: this.itemsPerPage, // Local data property for items per page
    };
  },
  watch: {
    itemsPerPage(newVal) {
      this.localItemsPerPage = newVal; // Update local value when prop changes
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.localItemsPerPage); // Use localItemsPerPage here
    },
    pages() {
      const pagesArray = [];
      const startPage = Math.max(1, this.currentPage - 4);
      const endPage = Math.min(this.totalPages, this.currentPage + 5);

      for (let i = startPage; i <= endPage; i++) {
        pagesArray.push(i);
      }
      return pagesArray;
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-changed', page);
      }
    },
    changeItemsPerPage() {
      this.$emit('items-per-page-changed', this.localItemsPerPage); // Emit the local value
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
}

.page-number {
  margin: 0 5px;
}

.active {
  font-weight: bold;
  background: #50B053;
  color: #ffffff;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.items-per-page {

}
</style>
