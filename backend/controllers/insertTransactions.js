const Transaction = require("../models/transactions")





const insertTransaction = (cusid, amount)=>{
    Transaction.create({cusid, amount})

}

module.exports = insertTransaction;



