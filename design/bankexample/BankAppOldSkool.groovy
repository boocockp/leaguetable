package bankexample

class BankAppOldSkool {
    AccountStore accounts
    TransactionStore transactions

    void deposit(accountId, amount) {
        transactions.add( new Transaction(accountId, "deposit", amount))
        accounts.get(accountId).deposit(amount)
    }

    void withdraw(accountId, amount) {
        transactions.add( new Transaction(accountId, "withdraw", amount))
        accounts.get(accountId).deposit(amount)
    }

    class Account {
        def id
        def balance

        void deposit(amount) { balance += amount}
        void withdraw(amount) { balance -= amount}
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
    }}

