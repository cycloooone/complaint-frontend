<template>
    <nav class="inline-navbar">
      <div class="navbar-brand">
        <router-link to="/">Your Brand Name</router-link>
      </div>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/home">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about">About Us</router-link>
        </li>
        </ul>
      <div v-if="showDropdown" class="dropdown">
        <button @click="showDropdown = !showDropdown">More</button>
        <ul class="dropdown-menu">
          <li><router-link to="/contact">Contact</router-link></li>
          </ul>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'InlineNavbar',
    data() {
      return {
        showDropdown: false,
      };
    },
    methods: {
      // Handle dropdown visibility if needed (consider CSS-based solutions for simplicity)
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
    },
  };
  </script>
  
  <style scoped>
  .inline-navbar {
    display: flex;
    align-items: center; /* Center navbar items vertically */
    justify-content: space-between; /* Spread items horizontally */
    padding: 1rem; /* Adjust padding as needed */
    background-color: #f5f5f5; /* Optional background color */
  }
  
  .navbar-brand {
    font-weight: bold;
    font-size: 1.2rem; /* Adjust font size as needed */
  }
  
  .navbar-nav {
    display: flex;
    list-style: none;
    margin: 0; /* Remove default margin */
    padding: 0; /* Remove default padding */
  }
  
  .nav-item {
    margin-right: 1rem; /* Add some spacing between links */
  }
  
  .nav-link {
    text-decoration: none;
    color: #333; /* Adjust link color as needed */
  }
  
  .nav-link:hover {
    color: #007bff; /* Add hover effect (optional) */
  }
  
  /* Optional dropdown styles (customize as needed) */
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-menu {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  
  .dropdown-menu a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  
  .dropdown:hover .dropdown-menu {
    display: block;
  }
  </style>
  