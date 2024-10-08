<template>
  <div class="appeals-list-container">
    <h1>Список заявок</h1>

    <button @click="openCreateModal">Создать новую заявку</button>

    <div class="appeals-list">
      <input v-model="search" placeholder="Поиск..." @input="fetchApplications"/>

      <table>
        <thead>
        <tr>
          <th>№</th>
          <th>Создана</th>
          <th>Адрес</th>
          <th>Заявитель</th>
          <th>Описание</th>
          <th>Срок</th>
          <th>Статус</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="appeal in applications" :key="appeal.id" @click="openEditModal(appeal)">
          <td>{{ appeal.number }}</td>
          <td>{{ appeal.created_at }}</td>
          <td>{{ (appeal.premise && appeal.premise.full_address) || 'Не указан' }}</td>
          <td>{{ appeal.applicant ? `${appeal.applicant.last_name} ${appeal.applicant.first_name} ${appeal.applicant.patronymic_name}` : 'Не указан' }}</td>
          <td>{{ appeal.description }}</td>
          <td>{{ appeal.due_date }}</td>
          <td>{{ appeal.status.name }}</td>
        </tr>
        </tbody>
      </table>

      <pagination-component
          :currentPage="currentPage"
          :totalItems="totalItems"
          :itemsPerPage="itemsPerPage"
          @page-changed="updateCurrentPage"
          @items-per-page-changed="updateItemsPerPage"
      />

      <edit-modal
          v-if="isCreateModalOpen || selectedAppeal"
          :appealData="isCreateModalOpen ? {} : selectedAppeal"
          :isEditing="!!selectedAppeal"
          @submitted="fetchApplications"
          @close="closeModal"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PaginationComponent from './PaginationComponent.vue';
import EditModal from './EditModal.vue';

export default {
  name: 'AppealsList',
  components: {
    EditModal,
    PaginationComponent,
  },
  data() {
    return {
      search: '', // Initialize search property
      isCreateModalOpen: false, // Initialize modal state
      selectedAppeal: null, // Initialize selected appeal state
    };
  },
  computed: {
    ...mapState(['applications', 'currentPage', 'itemsPerPage', 'totalItems']),
  },
  async mounted() {
    this.checkAuth();
    await this.fetchApplications();
  },
  methods: {
    ...mapActions(['fetchApplications', 'updateItemsPerPage', 'updateCurrentPage']),
    checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      }
    },
    openEditModal(appeal) {
      this.selectedAppeal = appeal;
      console.log(appeal)
      this.isCreateModalOpen = false; // Закрываем создание
    },
    openCreateModal() {
      this.selectedAppeal = null; // Для создания новой заявки
      this.isCreateModalOpen = true;
    },
    closeModal() {
      this.selectedAppeal = null;
      this.isCreateModalOpen = false;
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 24px;
}

.appeals-list-container {
  padding: 20px;
  background: #eeeeee;
}

.appeals-list {
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 3rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

tr {
  height: 58px;
}

th {
  background-color: #ffffff;
  color: #50b053;
  font-size: 14px;
}

button {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #50b053;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #4cae4f;
}
</style>
