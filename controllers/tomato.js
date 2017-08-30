module.exports.list = list;
module.exports.add = add;
module.exports.deleteOne = deleteOne;
module.exports.update = update;
module.exports.getOne = getOne;

function getOne (req, res, next) {
  let id = Number(req.query.id || 0);
  if (id <= 0 && isNaN(id)) {
    res.json({"code": 500, "msg": "uid不正确"});
  }
  let sql = 'select * from item where id = ' + id + ' limit 1; ';

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

function list (req, res, next) {
  // let uid = Number(req.query.uid || 0);
  let uid = Number(req.query.uid || req.cookies.uid || 0);
  let key = req.query.key || '';
  let type = Number(req.query.type || 0);
  let start = Number(req.query.start || 0);
  let count = Number(req.query.count || 10);
  let startTime = Number(req.query.starttime || 0);
  let endTime = Number(req.query.endtime || 0);
  if (uid <= 0 && isNaN(uid)) {
    res.json({"code": 500, "msg": "uid不正确"});
  }
  if (start < 0 && isNaN(start)) {
    res.json({"code": 500, "msg": "start不正确"});
  }
  if (count <= 0 && isNaN(count)) {
    res.json({"code": 500, "msg": "count不正确"});
  }
  if (startTime < 0 && isNaN(startTime)) {
    res.json({"code": 500, "msg": "startTime不正确"});
  }
  if (endTime < 0 && isNaN(endTime)) {
    res.json({"code": 500, "msg": "endTime不正确"});
  }
  let sql = 'select * from item where uid = ' + uid;
  let sqlCount = 'select count(*) as count from item where uid = ' + uid;
  if (type > 0) {
    sql += ' and type = ' + type
    sqlCount += ' and type = ' + type
  }
  if (key !== '') {
    sql += ' and content like "%' + key + '%" '
    sqlCount += ' and content like "%' + key + '%" '
  }
  if (startTime > 0 && endTime > 0 && startTime < endTime) {
    sql += ' and createtime > ' + startTime + ' and createtime < ' + endTime + ' '
    sqlCount += ' and createtime > ' + startTime + ' and createtime < ' + endTime + ' '
  }
  sql += ' order by id desc limit ' + start + ', ' + count;

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
      conn.query(sqlCount, function(err, result) {
        if (err) {
          console.log(err);
          res.json({"code": 500, "msg": err});
          return
        }
        res.json({"code": 200, "msg": rows, "total": result[0].count})
        conn.release()
      })
    })
  })
}

function add (req, res, next) {
  // let uid = Number(req.query.uid || 0);
  let uid = Number(req.query.uid || req.cookies.uid || 0);
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

function update (req, res, next) {
  let id = Number(req.query.id || 0);
  let content = req.query.content || '';
  let type = Number(req.query.type || 0);
  let sql = "update item set content = '"
  + content + "', type = '" + type + "' where id = " + id;

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

function deleteOne (req, res, next) {
  let id = Number(req.query.id || 0);
  let sql = 'delete from item where id = ' + id

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
      console.log(rows)
      res.json({"code": 200, "msg": ''})
      conn.release()
    })
  })
}
