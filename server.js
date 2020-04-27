const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
var async = require('async')
const Pool = require('pg').Pool

const pool = new Pool({

  user: 'wchk',
  host: '34.87.24.79',
  database: 'farmwarranty',
  password: 'wchk2@20',
  port: 5432,

})


app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// app.get('/', (request, response) => {
//     response.json({ info: 'Node.js, Express, and Postgres API' })
// })

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})


app.get('/api/v1/countuser',(_req,res)=>{
    pool.connect((err,client,done)=>{
    if(err){
      return res.json({
        'code':400 , "Message": "Error1"
      })
    }
    else{
      client.query(`SELECT count(*) FROM users `,(err,result)=>{
        done();
        if(err){
          return res.json({
            'code':400 , "Message": "Error2"
          })
        }else{

            return res.json({
              'code' :200 , "Message": "Success","Data": result.rows
            })
          }
      
      })//close query
    }
    })//close connect
})

app.get('/api/v1/countwarranty',(req,res)=>{
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select count(*) from warranty where warranty_status ='${pid}' `,(err,result)=>{
      done();
      if(err){
        return res.json({
          'code':400 , "Message": "Error2"
        })
      }else{

        if (result.rowCount==0){
          return res.json({
            'code':404 , "Message": "ID not match"
          })
        }
        else{
          return res.json({
            'code' :200 , "Message": "Success","Data": result.rows
          })
        }

        
      }
    })//close query
  }
  })//close connect
})
app.get('/api/v1/manageuser',(req,res)=>{
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select uid,fname,lname,email,tel , count(DISTINCT warranty.warranty_id) AS warrantycount , count(DISTINCT field.field_id) AS fieldcount from users  full outer JOIN warranty ON warranty.warranty_owner = users.uid full outer JOIN field ON field.field_owner = users.uid GROUP BY users.uid ORDER BY uid;
    `,(err,result)=>{
      done();
      if(err){
        return res.json({
          'code':400 , "Message": "Error2"
        })
      }else{

        if (result.rowCount==0){
          return res.json({
            'code':404 , "Message": "ID not match"
          })
        }
        else{
          return res.json({
            'code' :200 , "Message": "Success","Data": result.rows
          })
        }

        
      }
    })//close query
  }
  })//close connect
})

app.get('/api/v1/managewebusers',(req,res)=>{
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select uid,fname,lname,email,tel,web.webuser_role.role_name,disabled from web.webusers inner join web.webuser_role on web.webusers.org_id = web.webuser_role.role_id;`,(err,result)=>{
      done();
      if(err){
        return res.json({
          'code':400 , "Message": "Error2"
        })
      }else{

        if (result.rowCount==0){
          return res.json({
            'code':404 , "Message": "ID not match"
          })
        }
        else{
          return res.json({
            'code' :200 , "Message": "Success","Data": result.rows
          })
        }

        
      }
    })//close query
  }
  })//close connect
})


