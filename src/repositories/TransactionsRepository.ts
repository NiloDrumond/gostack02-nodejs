import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((acc, { value, type }) => {
      if (type === 'income') {
        return acc + value;
      }

      return acc;
    }, 0);
    const outcome = this.transactions.reduce((acc, { value, type }) => {
      if (type === 'outcome') {
        return acc + value;
      }

      return acc;
    }, 0);
    const total = income - outcome;
    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });

    if (
      transaction.type === 'outcome' &&
      transaction.value > this.getBalance().total
    ) {
      throw Error('Not enough cash in your balance');
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
