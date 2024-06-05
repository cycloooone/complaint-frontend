<template>
    <div>
        <v-btn
        class="text-subtitle-1 mr-2 mt-2"
        :color="'все' === selectedItem?'blue':'white'"
        @click="handleClick('все')">
            Все
        </v-btn>
      <v-btn
        class="text-subtitle-1 mr-5 mt-2"
        v-for="item in category_products"
        :key="item"
        :color="item === selectedItem?'blue':'white'"
        @click="handleClick(item)"
      >
        {{ item }}
      </v-btn>
    </div>
  </template>
  
  <script>
  export default {
    props: ['categoryType'],
    name: 'ProductsComp',
    data() {
      return {
        products: {
          food: ['Донер', 'Доппер', 'Комбо Донер', 'Комбо Доппер'],
          service: ['Повар', 'Бариста', 'Кассир', 'Сборщик'],
          drinks: [
            'Коппучино', 'Какао', 'Американо', 'Фрапучино', 'Эспрессо',
            'Мокко', 'Латте', 'Айс Латте', 'Раф'
          ]
        },
        selectedItem: null // Track the selected item
      };
    },
    computed: {
      category_products() {
        if (this.categoryType === 'all') {
          return [
            ...this.products.food,
            ...this.products.service,
            ...this.products.drinks
          ];
        } else {
          return this.products[this.categoryType];
        }
      }
    },
    methods: {
      handleClick(item) {
        this.selectedItem = item;
        this.$emit('item-selected', item); // Emit the item to the parent component
      }
    }
  };
  </script>
  
  <style>
  .blue-button {
    background-color: blue !important;
    color: white !important;
  }
  </style>
  