// Create express app
var express = require('express')
var app = express()
var db = require('./database.js')
var md5 = require('md5')
var https = require('https')
var fs = require('fs')
var sha512 = require('sha512')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Server port
const PUERTO = 443
// Start server
https
  .createServer(
    {
      cert: fs.readFileSync('cert.pem'),
      key: fs.readFileSync('key.pem'),
    },
    app
  )
  .listen(PUERTO, function () {
    console.log('Servidor https correindo en el puerto 443')
  })
// Root endpoint
app.get('/', (req, res, next) => {
  res.json({ message: 'Ok' })
})

// Insert here other API endpoints
app.get('/api/users', (req, res, next) => {
  var sql = 'select * from user'
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: rows,
    })
  })
})
app.get('/api/user/:id', (req, res, next) => {
  var sql = 'select * from user where id = ?'
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: row,
    })
  })
})
app.post('/api/autenticar', (req, res, next) => {
  var sql = 'SELECT * FROM user WHERE email = ? AND password = ?'
  var params = [req.body.email, sha512(req.body.password)]
  db.get(sql, params, (err, user) => {
    if (err) {
      res.status(400).json({ error: err.message })
    } else {
      if (user) {
        res.json({
          message: 'success',
          data: user,
        })
      } else {
        res.json({
          message: 'Contraseña incorrecta!',
          params,
        })
      }
    }
  })
})

app.post('/api/user/', (req, res, next) => {
  var errors = []
  if (!req.body.password) {
    errors.push('No password specified')
  }
  if (!req.body.email) {
    errors.push('No email specified')
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') })
    return
  }
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: sha512(req.body.password),
  }
  var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params = [data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID,
    })
  })
})
app.patch('/api/user/:id', (req, res, next) => {
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null,
  }
  db.run(
    `UPDATE user set 
         name = COALESCE(?,name), 
         email = COALESCE(?,email), 
         password = COALESCE(?,password) 
         WHERE id = ?`,
    [data.name, data.email, data.password, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message })
        return
      }
      res.json({
        message: 'success',
        data: data,
        changes: this.changes,
      })
    }
  )
})
app.delete('/api/user/:id', (req, res, next) => {
  db.run(
    'DELETE FROM user WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message })
        return
      }
      res.json({ message: 'deleted', changes: this.changes })
    }
  )
})

// Default response for any other request
app.use(function (req, res) {
  res.status(404)
})
