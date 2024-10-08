<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-content-header">
        <h2>{{ isEditing ? 'Редактирование заявки' : 'Создание новой заявки' }}</h2>
        <button @click="closeModal">Закрыть</button>
      </div>
      <form @submit.prevent="submitAppeal">
        <div class="form-row">
          <div class="form-field">
            <label for="premise_id">Дом:</label>
            <select v-model="appeal.premise_id" id="premise_id" required>
              <option disabled value="">Выберите дом</option>
              <option v-for="premise in premises" :key="premise.id" :value="premise.id">
                {{ premise.title }} <!-- Заголовок дома -->
              </option>
            </select>
          </div>
          <div class="form-field">
            <label for="apartment_id">Квартира:</label>
            <input v-model="appeal.apartment_id" id="apartment_id" required />
          </div>
          <div class="form-field">
            <label for="due_date">Срок:</label>
            <input type="date" v-model="appeal.due_date" id="due_date" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="surname">Фамилия:</label>
            <input v-model="appeal.applicant.last_name" id="surname" required />
          </div>
          <div class="form-field">
            <label for="name">Имя:</label>
            <input v-model="appeal.applicant.first_name" id="name" required />
          </div>
          <div class="form-field">
            <label for="patronymic">Отчество:</label>
            <input v-model="appeal.applicant.patronymic_name" id="patronymic" />
          </div>
          <div class="form-field">
            <label for="phone">Телефон:</label>
            <input type="tel" v-model="appeal.applicant.username" id="phone" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="description">Описание заявки:</label>
            <textarea v-model="appeal.description" id="description" required></textarea>
          </div>
        </div>
        <button type="submit">{{ isEditing ? 'Сохранить изменения' : 'Создать заявку' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/services/axiosInstance';

export default {
  name: 'EditModal',
  props: {
    appealData: {
      type: Object,
      default: () => ({}),
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      premises: [], // Список домов
      appeal: {
        premise_id: this.appealData.premise?.id || '',
        apartment_id: this.appealData.apartment?.number || '',
        due_date: this.appealData.due_date || '',
        applicant: {
          last_name: this.appealData.applicant?.last_name || '',
          first_name: this.appealData.applicant?.first_name || '',
          patronymic_name: this.appealData.applicant?.patronymic_name || '',
          username: this.appealData.applicant?.username || '',
        },
        description: this.appealData.description || '',
      },
    };
  },
  async mounted() {
    try {
      // Загружаем данные о домах с сервера
      const response = await axios.get('https://dev.moydomonline.ru/api/geo/v2.0/user-premises/');
      // const response2 = await axios.get('https://dev.moydomonline.ru/api/geo/v1.0/apartments/premise_id=060fd1ae-d76e-4f68-a563-a7848e64188c/');
      // console.log(response2)

      this.premises = response.data.results; // Ожидается, что дома находятся в массиве results

    } catch (error) {
      console.error('Ошибка при загрузке данных домов:', error);
    }
  },
  methods: {
    async submitAppeal() {
      try {
        // Преобразуем дату в формат ISO 8601
        const formattedAppeal = {
          ...this.appeal,
          due_date: new Date(this.appeal.due_date).toISOString(), // Преобразование даты
          status: 1
        };

        if (this.isEditing) {
          await axios.put(`/appeals/${this.appealData.id}/`, formattedAppeal);
        } else {
          await axios.post('/appeals/v1.0/appeals/', formattedAppeal);
        }
        this.$emit('submitted');
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении заявки:', error);
      }
    },
    closeModal() {
      this.$emit('close');
    },
  },
  watch: {
    appealData: {
      immediate: true,
      handler(newValue) {
        // Обновляем данные формы при изменении данных о заявке
        this.appeal = {
          premise_id: newValue.premise_id || '',
          apartment_id: newValue.apartment_id || '',
          due_date: newValue.due_date || '',
          applicant: {
            last_name: newValue.applicant?.last_name || '',
            first_name: newValue.applicant?.first_name || '',
            patronymic_name: newValue.applicant?.patronymic_name || '',
            username: newValue.applicant?.username || '',
          },
          description: newValue.description || '',
        };
      },
    },
  },
};
</script>

<style scoped>
/* Стили остались без изменений */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
}

.modal-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.form-field {
  flex: 1;
  margin-right: 10px;
}

.form-field:last-child {
  margin-right: 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 10px;
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
