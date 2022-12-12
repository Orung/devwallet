const sequelize = require("../config/connections.js");
const { Customer } = require("../models/customer.js");
const bcrypt = require("bcryptjs");
const saltRounds = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { deposit } = require("../models/savings.js");
const { withdrawal } = require("../models/withdrawal.js");
const { verifyAuth } = require("../middleware/auth.js");
const getUserbalance = require("./getUsersBalance.js");
const insertTransaction = require("./insertTransactions.js");
const { request } = require("express");




const secret = "secret";

const register = async (req, res) => {
  const cus = {
    cusName: req.body.CustomerName,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };

  Customer.findAll({
    where: {
      username: req.body.username,
    },
  })
    .then((rs) => {
      if (rs.length >= 1) {
        res.status(200).json([{ message: "username taken" }]);
      } else {
        Customer.create(cus)
          .then((rs) => {
            console.log(rs);
            res.status(200).json([{ message: "data created" }]);
          })
          .catch((err) => {
            console.log(err);
            res.status(403).json([{ message: "err" }]);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // res.status(200).json([{message:password}])
  Customer.findOne({
    where: {
      username: username,
    },
  })
    .then((rs) => {
      if (rs) {
        const validity = bcrypt.compareSync(password, rs.dataValues.password);
        if (validity == true) {
          const token = jwt.sign(rs.dataValues, secret);
          res.status(200).json([{ message: token }]);
        } else {
          res.status(200).json([{ message: "invalid password" }]);
        }
      } else {
        res.status(200).json([{ message: "invalid username" }]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};




const dashboard = async (req, res) => {
  let total = 0;
  let totalwith = 0;
  const customerID = req.decoded.cusid;


  const result = await deposit.findAll({
    where: {
      cusid: customerID,
    
      
    },
  });
  result.map((r) => {
    total = total + r.dataValues.Amountdep;
  });
  withdrawal
    .findAll({
      where: {
        cusid: customerID,
        
        
      },
    })
    .then (async  (rsw) => {
      // const result = withdrawal.create({
      //   Amountwithdraw: request.body.Amountwithdraw
      // })
      rsw.map((rw) => {
        return totalwith = totalwith + Amountwithdraw;
      }); 
      const balance = await getUserbalance(customerID);
      //const withdraw = await insertTransaction(customerID, Amountwithdraw)
      res
        .status(200)
        .json([
          {
            customer: customerID,
            fullname: req.decoded.cusName,
            savings: total,
            withdraw: totalwith,
            balance,
          },
        ]);
    })
    .catch((err) => {
      console.log(err);
    });
};

const withdraw = async (req, res) => {
  try {
      const amount = req.body.amount;
      const userID = req.body.userID;
    //  const password = req.body.password;
      const narration = 'Withdrawal';

    const user =  Customer.findAll({
        where: {
          cusid: userID
        }
      });

     // const passwordIsCorrect = bcrypt.compareSync(user.password, password);

     // if (passwordIsCorrect) {
          const balance = getUserbalance(user.id);

          if (balance >= amount) {

              await insertTransaction(userID, narration, 0 - amount);

              return res.status(200).json({
                  status: 200,
                  success: true,
                  message: 'Successful'
              });
          } else {
              throw new Error('Insufficient balance');
          }
  //  //   } else {
  //         throw new Error('Incorrect password');
  //     }
  } catch (error) {
      console.error(error);

      return res.status(500).json({
          status: 500,
          success: false,
          message: error.message
      });
  }
}

module.exports = { register, login, dashboard, withdraw};
