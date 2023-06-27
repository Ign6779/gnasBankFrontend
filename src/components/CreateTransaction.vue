<template>
    <section>
      <div class="container py-5">
        <div class="row">
          <div v-if="isError" class="alert alert-danger mt-3">{{ errorMessage }}</div>
          <div v-if="transactionSuccess" class="alert alert-success mt-3">{{ successMessage }}</div>
            
          <div class="col-sm-6">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" class="form-control small-input" v-model="searchFirstName">
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" class="form-control small-input" v-model="searchLastName">
            </div>
            <div class="form-group">
              <button class="btn btn-primary mt-3 mb-3" @click="getUserInfo">Get user info</button>
            </div>
  
            <div class="form-group">
              <label for="searchedCurrentIban">Searched Current Iban</label>
              <input type="text" id="searchedCurrentIban" class="form-control small-input" v-model="searchedCurrentIban" readonly>
            </div>
  
            <div class="form-group">
              <label for="searchedSavingsIban">Searched Savings Iban</label>
              <input type="text" id="searchedSavingsIban" class="form-control small-input" v-model="searchedSavingsIban" readonly>
            </div>
          </div>
  
          <div class="col-sm-6">
            <div class="form-group">
              <label for="accountFrom">Account From</label>
              <input type="text" id="accountFrom" class="form-control small-input" v-model="accountFrom">
            </div>
  
            <div class="form-group">
              <label for="accountTo">Account To</label>
              <input type="text" id="accountTo" class="form-control small-input" v-model="accountTo">
            </div>
  
            <div class="form-group">
              <label for="amount">Amount</label>
              <input type="number" id="amount" class="form-control small-input" v-model="amount">
            </div>
  
            <div class="form-group">
              <button class="btn btn-primary mt-3 mb-3" @click="createTransaction">Perform Transaction</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from '../axios-auth.js';
  
  export default {
      name: "CreateTransaction",
      data() {
          return {
              searchFirstName: '',
              searchLastName: '',
              isError: false,
              transactionSuccess: false,
              errorMessage: '',
              successMessage: '',
              searchedCurrentIban: '',
              searchedSavingsIban: '',
              accountFrom: '',
              accountTo: '',
              amount: '',
          }
      },
      methods: {
          getUserInfo() {
              if (!this.searchFirstName || !this.searchLastName) {
                  this.isError = true;
                  this.errorMessage = 'Please input first and last name';
                  return;
              }
  
              this.isError = false;
              if (this.searchFirstName && this.searchLastName) {
                  axios
                  .get(`/users/search?firstName=${this.searchFirstName}&lastName=${this.searchLastName}`)
                  .then(response => {
                      console.log(response);
                      this.processUserInfo(response.data);
                  })
                  .catch(error => {
                      this.isError = true;
                      this.errorMessage = error.response.data.message;
                  });
              }
          },
          processUserInfo(data) {
              data.bankAccounts.forEach(account => {
                if (account.type === "CURRENT") {
                this.searchedCurrentIban = account.iban;
                } else if (account.type === "SAVINGS") {
                this.searchedSavingsIban = account.iban;
                }
            });
          },
          createTransaction() {
              if (!this.accountFrom || !this.accountTo || !this.amount) {
                  this.isError = true;
                  this.errorMessage = 'Please fill all the fields';
                  return;
              }
  
              this.isError = false;
              axios
              .post("transactions", {
                  ibanAccountFrom: this.accountFrom,
                  ibanAccountTo: this.accountTo,
                  amount: parseFloat(this.amount)
                })
              .then(() => {
                this.transactionSuccess = true;
                this.successMessage = "Transaction performed correctly";
                //   this.$router.replace("/");
              })
              .catch((error) => {
                  console.log(error);
                  this.isError = true;
                  this.errorMessage = "There was an error while attempting to create the transaction: " + error.response.data.message;
              });
          }
      }
  }
  </script>
  
  <style scoped>
    .small-input {
      max-width: 300px;
    }
  </style>
  