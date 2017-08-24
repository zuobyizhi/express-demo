module.exports.list = list;
module.exports.add = add;

function test (req, res, next) {
  // res.json(JSON.stringify({"code": 200, "msg": "111"}));
  console.log(pool)
  res.json({"code": 200, "msg": "123"});
}

function list (req, res, next) {
  let uid = Number(req.query.uid || 0);
  let key = req.query.key || '';
  let type = Number(req.query.type || 0);
  if (uid <= 0 && isNaN(uid)) {
    res.json({"code": 500, "msg": "uid不正确"});
  }
  let sql = 'select * from item where uid = ' + uid;
  if (type > 0) {
    sql += ' and type = ' + type
  }

  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('POOL ==> ' + err)
      conn.release()
      res.json({"code": 500, "msg": err})
      return
    }

    conn.query(sql, function(err, rows) {
      if (err) {
        console.log(err)
        res.json({"code": 500, "msg": err})
        return
      }
      res.json({"code": 200, "msg": rows})
      conn.release()
    })
  })
}

function add (req, res, next) {
  let uid = Number(req.query.uid || 0);
  let content = req.query.content || '';
  let type = Number(req.query.type || 0);
  let sql = "insert into item values (null, '"
  + content + "', '" + type + "', "
  + new Date().getTime() + ", " + uid + ")";

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
