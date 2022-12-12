const Transaction = require("../models/transactions.js");

const getUserbalance = async (cusid) => {
  const allTransactions = await Transaction.findAll({
    where: {
      cusid: cusid,
    },
  });

  if (!allTransactions.length) {
    return 0;
  }

  console.clear();

let balance = 0;

for (const i of allTransactions) {
   balance += i.amount;
}
  return balance;
};

module.exports = getUserbalance;
