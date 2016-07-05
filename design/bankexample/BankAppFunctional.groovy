package bankexample

class BankAppFunctional {
    AccountStore accounts
    TransactionStore transactions

    void deposit(accountId, amount) {
        transactions.add( new Transaction(accountId, "deposit", amount))
    }

    void withdraw(accountId, amount) {
        transactions.add( new Transaction(accountId, "withdraw", amount))
    }

    class Account {
        def id
        TransactionStore transactions

        def getBalance() {
            transactionTotal("deposit") - transactionTotal("withdraw")
        }

        private transactionTotal(type) {
            transactions.getForAccount(id).findAll { it.type == type }*.amount.sum()
        }
    }

    class Transaction {
        def accountId
        def type
        def amount
    }

    class AccountStore {
        Account get(id) { /*...*/}
    }

    class TransactionStore {
        void add(transaction) { /*...*/ }
        List<Transaction> getForAccount(accountId) { /*...*/}
    }
}




