// const dbOperation = {};
// const mysql = require('mysql');
// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'notebase'
// });

// dbOperation.query = function (sql, callback) {
//     if (!sql) {
//         callback();
//         return false;
//     }
//     pool.query(sql, function (err, rows, fields) {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//             return false;
//         } else {
//             callback(null, rows, fields);
//         }
//     })
// }
// module.exports = dbOperation;

const mysql = require('mysql')
const pool = mysql.createPool({
  host     :  'localhost',
  user     :  'root',
  password :  '',
  database :  'notebase'
})

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }