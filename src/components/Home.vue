<template>
  <section>
    <div class="container py-5">
      <div class="row">
        <div v-if="isError" class="alert alert-danger mt-3">{{ errorMessage }}</div>

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
            <input type="text" id="searchedCurrentIban" class="form-control small-input" v-model="searchedCurrentIban">
          </div>
          
          <div class="form-group">
            <label for="searchedSavingsIban">Searched Savings Iban</label>
            <input type="text" id="searchedSavingsIban" class="form-control small-input" v-model="searchedSavingsIban">
          </div>

          <div class="form-group">
            <button class="btn btn-primary mt-3 mb-3" @click="searchByIban">Search by IBAN</button>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="form-group">
            <label for="searchIban">Search Bank Account by IBAN</label>
            <input type="text" id="searchIban" class="form-control small-input" v-model="searchIban">
          </div>

          <div class="form-group">
            <button class="btn btn-primary mt-3 mb-3" @click="searchByIban">Search by IBAN</button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <button class="btn btn-primary mt-3 mb-3" @click="clearInfo">Clear</button>
        </div>
      </div>

      <div v-if="transactionTable === 'BankAccount'">
        <div class="form-group mt-4">
          <label for="filter">Filter by:</label>
          <select v-model="filter" id="filter" class="form-control small-input">
            <option value="Date">Date</option>
            <option value="Amount">Amount</option>
          </select>
        </div>

        <div v-if="filter === 'Date'">
          <div class="form-group">
            <label for="dateFrom">From:</label>
            <input type="date" id="dateFrom" class="form-control" v-model="searchStartDate">
          </div>
          
          <div class="form-group">
            <label for="dateTo">To:</label>
            <input type="date" id="dateTo" class="form-control" v-model="searchEndDate">
          </div>
        </div>

        <div v-else>
          <div class="form-group">
            <label for="amount">Amount:</label>
            <input type="text" id="amount" class="form-control" v-model="searchAmount">
          </div>

          <div class="form-group">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="amountOption" id="lessThan" value="smaller" v-model="searchComparison">
              <label class="form-check-label" for="lessThan">Less Than</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="radio" name="amountOption" id="equal" value="equal" v-model="searchComparison">
              <label class="form-check-label" for="equal">Equal</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="radio" name="amountOption" id="moreThan" value="greater" v-model="searchComparison">
              <label class="form-check-label" for="moreThan">More Than</label>
            </div>
          </div>
        </div>
      </div>

      <div v-if="transactionTable === 'All'">
        <div class="col-sm-6">
          <h3>All Transactions</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Iban of Sender</th>
                <th>Iban of Receiver</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              <TransactionListItem v-for="transaction in transactions" :key="transaction.id" :transaction='transaction' />
            </tbody>
          </table>
        </div>
      </div>
        
      <div v-else>
        <div class="row mt-4">
          <div class="col-sm-6">
            <h3>Incoming Transactions</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Iban of Sender</th>
                  <th>Iban of Receiver</th>
                  <th>Amount</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
                
              <tbody>
                <TransactionListItem v-for="transaction in transactionsTo" :key="transaction.id" :transaction='transaction' />
              </tbody>
            </table>
          </div>

          <div class="col-sm-6">
            <h3>Outgoing Transactions</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Iban of Sender</th>
                  <th>Iban of Receiver</th>
                  <th>Amount</th>
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                <TransactionListItem v-for="transaction in transactionsFrom" :key="transaction.id" :transaction='transaction' />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
 </section>
</template>

<script>
import axios from '../axios-auth.js';
import TransactionListItem from './items/TransactionListItem.vue';

export default {
  name: "Home",
  components: {
    TransactionListItem,
  },
  data() {
    return {
      filter: 'Date',
      transactionTable: 'All',
      transactions: [],
      transactionsFrom: [],
      transactionsTo: [],
      searchFirstName: '',
      searchLastName: '',
      searchIban: '',
      isError: false,
      errorMessage: '',
      searchedCurrentIban: '',
      searchedSavingsIban: '',
      searchAmount: '',
      searchComparison: '',
      searchStartDate: '',
      searchEndDate: '',
    }
  },
  mounted() {
    this.update();
  },
  watch: {
    searchAmount(newVal, oldVal) {
      if (newVal && this.searchComparison) {
        this.searchByAmount();
      }
    },
    searchComparison(newVal, oldVal) {
      if (newVal && this.searchAmount) {
        this.searchByAmount();
      }
    },
    searchStartDate(newVal, oldVal) {
    if (newVal && this.searchEndDate) {
      this.searchByDate();
    }
    },
    searchEndDate(newVal, oldVal) {
      if (newVal && this.searchStartDate) {
        this.searchByDate();
      }
    },
  },
  methods: {
    update() {
      this.getAllTransactions();
    },
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
            console.error(error);
          });
      } else {
        this.isError = true;
        this.errorMessage = 'Please provide both first and last name';
      }
    },
    getAllTransactions() {
      axios
        .get("transactions")
        .then((result) => {
          console.log(result);
          this.transactions = result.data;
        })
        .catch((error) => console.log(error));
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
    searchByIban() {
      if (!this.searchIban) {
        this.isError = true;
        this.errorMessage = "Please provide an IBAN to search";
      }
      else {
        this.transactionTable = 'BankAccount';
        axios
        .get(`/transactions?from=${this.searchIban}`)
        .then((result) => {
          console.log(result);
          this.transactionsFrom = result.data;
        })
        .catch((error) => console.log(error));
        axios
        .get(`/transactions?to=${this.searchIban}`)
        .then((result) => {
          console.log(result);
          this.transactionsTo = result.data;
        })
        .catch((error) => console.log(error));
      }
      // Implement the searchByIban logic here.
    },
    clearInfo() {
      this.transactionTable = 'All';
      this.searchFirstName = '';
      this.searchLastName = '';
      this.searchedCurrentIban = '';
      this.searchedSavingsIban = '';
      this.searchedIban = '';
      this.searchIban = '';
      this.errorMessage = '';
      this.isError = false;
      this.searchComparison = '';
      this.searchAmount = '';
      this.searchStartDate = '';
      this.searchEndDate = '';
    },
    searchByAmount() {
    if (!this.searchIban) {
      this.isError = true;
      this.errorMessage = "Please provide an IBAN to search";
    } else {
      axios
        .get(`/transactions?from=${this.searchIban}&comparison=${this.searchComparison}&amount=${this.searchAmount}`)
        .then((result) => {
          console.log(result);
          this.transactionsFrom = result.data;
        })
        .catch((error) => {console.log(error)});
        axios
        .get(`/transactions?to=${this.searchIban}&comparison=${this.searchComparison}&amount=${this.searchAmount}`)
        .then((result) => {
          console.log(result);
          this.transactionsTo = result.data;
        })
        .catch((error) => {console.log(error)});
    }
  },
  searchByDate() {
    if (!this.searchIban) {
      this.isError = true;
      this.errorMessage = "Please provide an IBAN to search";
    } else {
      let startDate = this.formatDate(this.searchStartDate) + 'T00:00:00';
      let endDate = this.formatDate(this.searchEndDate) + 'T23:59:59';

      axios
        .get(`transactions?from=${this.searchIban}&startDate=${startDate}&endDate=${endDate}`)
        .then((result) => {
          console.log(result);
          this.transactionsFrom = result.data;
        })
        .catch((error) => {console.log(error)});
        axios
        .get(`transactions?to=${this.searchIban}&startDate=${startDate}&endDate=${endDate}`)
        .then((result) => {
          console.log(result);
          this.transactionsTo = result.data;
        })
        .catch((error) => {console.log(error)});
    }
  },
  formatDate(dateString) {
    let dateParts = dateString.split("-");
    return `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
  },
  }
};
</script>

<style>
.container {
  /* max-width: 800px; */
}

.small-input {
  max-width: 300px;
}
</style>
