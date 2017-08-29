let crypto = require('crypto')

module.exports.login = login;
module.exports.register = register;
module.exports.logout = logout;
module.exports.chkLogin = chkLogin;

function md5(tx) {
  const obj = crypto.createHash('md5');
  obj.update(tx);
  return obj.digest('hex')
}

function login (req, res, next) {
  let acct = req.query.acct || ''
  let password = md5(req.query.password || '')
  let sql = 'select * from user where acct = "'
  + acct + '" and password = "' + password + '"'

  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('POOL ==> ' + err)
      res.json({"code": 500, "msg": ''})
      conn.release()
      return
    }

    conn.query(sql, function(err, rows) {
      if (err) {
        console.log(err)
        res.json({"code": 500, "msg": ''})
        conn.release()
        return
      }
      if (rows.length === 0) {
        console.log(err)
        res.json({"code": 500, "msg": '无用户'})
        conn.release()
        return
      }
      res.cookie('uid', rows[0].uid, {expires: new Date(Date.now() + 7*24*60*60*1000), httpOnly: false})
      res.json({"code": 200, "msg": rows})
      conn.release()
    })
  })
}

function logout (req, res, next) {
  res.cookie('uid', '', {expires: new Date(Date.now()), httpOnly: false});
  res.json({"code": 200, "msg": ""});
}

function chkLogin (req, res, next) {
  let uid = Number(req.cookies.uid || 0);
  if (uid > 0) {
    res.json({"code": 200, "msg": ""});
  } else {
    res.json({"code": 500, "msg": ""});
  }
}

function register (req, res, next) {
  let acct = req.query.acct || ''
  let password = md5(req.query.password || '')
  let sql = "insert into user values (null, '"
  + acct + "', '" + password + "')"

  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('POOL ==> ' + err)
      conn.release()
      res.json({"code": 500, "msg": ''})
      return
    }

    conn.query(sql, function(err, rows) {
      if (err) {
        console.log(err)
        conn.release()
        res.json({"code": 500, "msg": ''})
        return
      }
      // res.cookie('acct', name, {expires: new Date(Date.now() + 7*24*60*1000), httpOnly: false})
      console.log(rows)
      res.json({"code": 200, "msg": ''})
      conn.release()
    })
  })
}
