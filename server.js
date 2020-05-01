const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
const port = 3001
var async = require('async')
const sha512 = require('js-sha512');
const Pool = require('pg').Pool
app.use(cors())

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

app.get('/api/v1/countuser',(_req,res)=>{ // dashboard card จำนวนผู้ใช้
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
              'code' :200 , "Mssage": "Success","Data": result.rows
            })
          }
      
      })//close query
    }
    })//close connect
})

app.get('/api/v1/countwarranty',(req,res)=>{// dashboard&รายงาน card จำนวนคำร้อง3card header = pid STATUS (1,2,3)
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

app.get('/api/v1/countallwarranty',(req,res)=>{// รายงาน card จำนวนคำร้องทั้งหมด 
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select count(*) from warranty `,(err,result)=>{
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

app.get('/api/v1/manageuser',(req,res)=>{ // จัดการผู้ใช้app table
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

app.get('/api/v1/managewebusers',(req,res)=>{// จัดการผู้ใช้web table
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select uid,fname,lname,email,tel,web.webuser_role.role_name,dis_name from web.webusers 
    inner join web.webuser_role on web.webusers.org_id = web.webuser_role.role_id
    inner join web.disabled on web.disabled.dis_id = web.webusers.disabled;`,(err,result)=>{
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

app.get('/api/v1/eachusers',(req,res)=>{ // จัดการผู้ใช้ app more info header =pid(userID) 
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select fname,lname,email,tel,citizenid,address,moo,soi,road,subdistrict,district,province,postalcode from users where uid  ='${pid}' `,(err,result)=>{
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

app.get('/api/v1/eachwebusers',(req,res)=>{ // จัดการผู้ใช้ web more info header =pid(userID) 
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select uid,fname,lname,email,tel,web.webuser_role.role_name,web.webusers.disabled,web.disabled.dis_name,web.branch.branch_id,web.branch.branch_pro_id,web.branch.branch_name,web.branch.branch_pro_name from web.webusers 
    inner join web.webuser_role on web.webusers.org_id = web.webuser_role.role_id 
    inner join web.branch on web.branch.branch_id = web.webusers.ubranch_id 
    inner join web.disabled on web.disabled.dis_id = web.webusers.disabled
    where uid = '${pid}' `,(err,result)=>{
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

app.get('/api/v1/allwarrantytable',(req,res)=>{ // การยื่นขอความช่วยเเหลือ table(คำร้องทั้งหมด)
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select distinct warranty_id,warranty_fname,warranty_lname,users.tel,users.email
    ,disasters.disaster_nameth,tambon.province_t,status.status_name
    ,fulllist.full_name
    from warranty
    left join disasters on warranty_dmgtype = disaster_id
    left join tambon on warranty_district = amp_id
    left join users on warranty_owner = uid
    left join fulllist on warranty_full = full_id
    left join status on warranty_status = status_id	; `,(err,result)=>{
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

app.get('/api/v1/warrantytable',(req,res)=>{ // การยื่นขอความช่วยเเหลือ table(คำร้อง3แบบ) header =pid(status)(1,2,3)
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select distinct warranty_id,warranty_fname,warranty_lname,users.tel,users.email
    ,disasters.disaster_nameth,tambon.province_t
	,status.status_name
    ,fulllist.full_name
    from warranty
    left join disasters on warranty_dmgtype = disaster_id
    left join tambon on warranty_district = amp_id
    left join users on warranty_owner = uid
    left join fulllist on warranty_full = full_id
    left join status on warranty_status = status_id
    where warranty_status = '${pid}' `,(err,result)=>{
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

app.get('/api/v1/warrantymoreinfo',(req,res)=>{ // การยื่นขอความช่วยเเหลือ moreinfo header =warrantyID
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select warranty_id,warranty_no,warranty_fname,warranty_lname,warranty_citizenid,warranty_address,warranty_moo,warranty_soi,warranty_road
    ,tambon.tambon_t,tambon.amphoe_t,tambon.province_t
    ,warranty_postalcode,warranty_dmgdate,warranty_tgiano,web.webusers.fname,web.webusers.lname,web.webusers.tel
    ,web.branch.branch_pro_name
    ,web.branch.branch_name
    ,disasters.disaster_nameth
    ,warranty_status,status.status_name,warranty_plantdate,warranty_harvestdate,warranty_timestamp
	,tambon_t,amphoe_t
    from warranty 
    left join field on field_id = warranty_fieldid
    left join tambon on warranty_subdistrict = tam_id or field.field_subdistrict = tam_id 
    left join disasters on warranty_dmgtype = disaster_id
    left join status on warranty_status = status_id
    left join web.branch on warranty_branch_pro_id = web.branch.branch_pro_id and warranty_branch_id = web.branch.branch_id
    left join web.webusers on warranty_aproveby = web.webusers.uid
    where warranty_id =  '${pid}' order by warranty_id ;	
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

app.get('/api/v1/map',(_req,res)=>{ // map
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`SELECT field_id,field_no,users.fname,users.lname,field_name,tambon.tambon_t,tambon.amphoe_t,tambon.province_t
    ,ST_AsGeoJSON(ST_Reverse(ST_ForceRHR(ST_MakeValid(polygeom))),6) as geojson ,field_no,
    CASE WHEN warranty_fieldid IS NOT NULL 
           THEN 1
           ELSE 0
    END AS havewarranty
        FROM field
        left join users on field_owner = uid
        left join tambon on field_subdistrict = tam_id
        left join warranty on field_id = warranty_fieldid
    
        order by field_id;`,(err,result)=>{
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

app.get('/api/v1/allprobranch',(_req,res)=>{ // allbranch
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`SELECT distinct web.branch.branch_pro_name,web.branch.branch_pro_id from web.branch;`,(err,result)=>{
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

app.get('/api/v1/branch',(req,res)=>{ // branch header = branch_proID
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`SELECT web.branch.branch_name,web.branch.branch_id from web.branch where web.branch.branch_pro_id = '${pid}';`,(err,result)=>{
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

app.get('/api/v1/reporttable',(_req,res)=>{ // รายงาน table 
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select distinct province_t , provincial , disaster_nameth , count(distinct warranty_id)
    ,count(distinct case when warranty_status = 1 then warranty_id  end) as pass
    ,count(distinct case when warranty_status = 2 then warranty_id  end) as fail   
    ,count(distinct case when warranty_status = 3 then warranty_id  end) as waiting   
    ,count(distinct case when warranty_full = 2 then warranty_id  end) as missingdata   
    from warranty
    left join tambon on amp_id = warranty_district 
    left join disasters on disaster_id = warranty_dmgtype
    group by province_t,provincial,disaster_nameth;`,(err,result)=>{
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

app.get('/api/v1/chartusers',(_req,res)=>{ // users chart in dashboard 
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`SELECT m_fullname,m_name,m_id
    ,COUNT(uid)
    FROM months
    full join users on m_id = date_part('month', DATE_TRUNC('month', reg_date)) 
    and reg_date >= CURRENT_TIMESTAMP - INTERVAL '1 year' 
    and reg_date <= CURRENT_TIMESTAMP
    GROUP BY m_id
    ORDER BY m_id ASC`,(err,result)=>{
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

app.get('/api/v1/chartwarranty',(_req,res)=>{ // warranty chart in dashboard 
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`SELECT m_fullname,m_name,m_id
    ,COUNT(warranty_id)
    FROM months
    full join warranty on m_id = date_part('month', DATE_TRUNC('month', warranty_timestamp)) 
    and warranty_timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 year' 
    and warranty_timestamp <= CURRENT_TIMESTAMP
    GROUP BY m_id
    ORDER BY m_id ASC`,(err,result)=>{
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

app.get('/api/v1/chartprovincial',(_req,res)=>{ // donut provincial warranty chart in รายงาน 
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select distinct provincial, count(distinct warranty_id) 
    from warranty
    full join tambon on amp_id = warranty_district 
    left join disasters on disaster_id = warranty_dmgtype
    group by provincial;`,(err,result)=>{
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

function authentication(email, passwd, res) {
  async.waterfall([function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  //console.log(err);
              } else {
                  let saltsql = `SELECT salt FROM web.webusers WHERE email='${email}';`;
                  console.log(saltsql);
                  client.query(saltsql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log("testrerere",passwd)
                          console.log("testpw",passwd)
                          passwd = (sha512(passwd + result.rows[0].salt)).toUpperCase();
                          wtdone(null, passwd);
                          console.log("passtest",passwd)
                      }
                  });
              }
          });
      },
      function (token, wtdone) {
        let tokenquery = `select uid,fname,lname,coalesce(email,'') as email,tel,coalesce(citizenid,'') as citizenid
        ,token,tokenexpire,coalesce(profileimg,'') as profileimg,isloggedin,passwd
        from web.webusers where token = '${token}';`;
        console.log("testtoken",tokenquery);
        pool.connect((err, client, done) => {
            if (err) {
                //console.log(err);
            } else {
                client.query(tokenquery, (err, result) => {
                  console.log("eiei", result)
                    done();
                    if (err) {
                        //console.log('line 3915');
                        //console.log(err.stack);
                        return res.json({
                            "code": 400,
                            "message": "Invalid username/password"
                        });
                    } else {
                        return res.json({
                          
                            "code": 200,
                            "message": "Success",
                            "data": result.rows[0]
                        });
                    }
                });
            }
        });
    }
])
}

app.post('/api/v1/login', (req, res) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let saltsql = `SELECT uid,org_id,disabled FROM web.webusers WHERE email='${email}' and passwd='${passwd}'`;
                  console.log(saltsql);
                  client.query(saltsql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild email or password"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "Log in pass",
                              "data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
      function (wtdone) {
          authentication(email, passwd, res, 'email');
      }
  ], function (err) {
      if (err) {
          console.log('line 224');
          console.log(err.stack);
          return response.json({
              "code": 400,
              "message": 'Invalid username/password'
          });
      }
  });
});

app.post('/api/v1/editwebuser', (req, res) => { //จัดการผู้ใช้งานweb edit webuser 
  let uid = req.body.uid;
  let org_id = req.body.org_id;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let tel = req.body.tel;
  let email = req.body.email;
  let ubranch_id = req.body.ubranch_id;
  

  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let sql = `update web.webusers set 
                  org_id = '${org_id}',
                  fname = '${fname}',
                  lname = '${lname}',
                  tel = '${tel}',
                  email = '${email}',
                  ubranch_id = '${ubranch_id}'
                  where uid = '${uid}'`;
                  console.log(sql);
                  client.query(sql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild UserID"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "Update Success",
                              //"data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
  ]);
});

app.post('/api/v1/delwebuser', (req, res) => { //จัดการผู้ใช้งานweb delete webuser 
  let uid = req.body.uid;
  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let sql = `DELETE FROM web.webusers WHERE uid = '${uid}'`;
                  console.log(sql);
                  client.query(sql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild UserID"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "Delete Success",
                              //"data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
  ]);
});

app.post('/api/v1/addwebuser', (req, res) => { //จัดการผู้ใช้งานweb add webuser 
  let org_id = req.body.org_id;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let tel = req.body.tel;
  let email = req.body.email;
  let passwd = req.body.passwd;
  let ubranch_id = req.body.ubranch_id;
  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let sql = `INSERT INTO web.webusers (uid,org_id, fname, lname, tel,email,ubranch_id,passwd,isloggedin,disabled)
                  VALUES (nextval('web.webusers_uid_seq'),'${org_id}', '${fname}', '${lname}', '${tel}','${email}','${ubranch_id}','${passwd}',0,1);`;
                  console.log(sql);
                  client.query(sql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild UserID"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "ADD Success",
                              //"data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
  ]);
});

app.post('/api/v1/editwarrantystatus', (req, res) => { //warranty table edit status
  let warranty_id = req.body.warranty_id;
  let warranty_status = req.body.warranty_status;
  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let sql = `update warranty set 
                  warranty_status = '${warranty_status}'
                  where warranty_id = '${warranty_id}'`;
                  console.log(sql);
                  client.query(sql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild WarrantyID"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "Update Success",
                              //"data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
  ]);
});

app.post('/api/v1/editwarrantyfull', (req, res) => { //warranty table edit full(ข้อมูลครบถ้วนหรือไม่)
  let warranty_id = req.body.warranty_id;
  let warranty_full = req.body.warranty_full;
  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let sql = `update warranty set 
                  warranty_full = '${warranty_full}'
                  where warranty_id = '${warranty_id}'`;
                  console.log(sql);
                  client.query(sql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild WarrantyID"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "Update Success",
                              //"data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
  ]);
});

app.post('/api/v1/editwarrantyisinarea', (req, res) => { //warranty more info edit isinarea(ยืนยันว่าอยู่ในเขตประกาศหรือไม่) 1 = ยืนยัน , 2 = ไม่ยืนยัน
  let warranty_id = req.body.warranty_id;
  let warranty_status = req.body.warranty_status;
  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let sql = `update warranty set 
                  warranty_status = '${warranty_status}'
                  where warranty_id = '${warranty_id}'`;
                  console.log(sql);
                  client.query(sql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild WarrantyID"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "Update Success",
                              //"data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
  ]);
});

app.get('/api/v1/allprovincial',(_req,res)=>{ // allprovincial
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`SELECT distinct provincial,provincial_id from tambon;`,(err,result)=>{
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

app.get('/api/v1/province',(req,res)=>{ // province header = provincialID
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`SELECT distinct province_t,prov_id from tambon where provincial_id = '${pid}';`,(err,result)=>{
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

app.post('/api/v1/editwebuser', (req, res) => { //จัดการผู้ใช้งานweb edit webuser 
  let uid = req.body.uid;
  let disabled = req.body.disabled;
  async.waterfall([
      function (wtdone) {
          pool.connect((err, client, done) => {
              if (err) {
                  console.log(err);
              } else {
                  let sql = `update web.webusers set 
                  ubranch_id = '${disabled}'
                  where uid = '${uid}'`;
                  console.log(sql);
                  client.query(sql, (err, result) => {
                      done();
                      if (err) {
                          return res.json({
                              "code": 400,
                              "message": "Cannot connect to database"
                          });
                      } else {
                          console.log()
                          if (result.rowCount == 0) {
                              return res.json({
                                  "code": 407,
                                  "message": "Invaild UserID"
                              });
                          } else {
                            return res.json({
                              "code": 200,
                              "message": "Update Success",
                              //"data": result.rows
                          });
                          }
                      }
                  });
              }
          });
      },
  ]);
});

app.get('/api/v1/eachwebusers',(req,res)=>{// จัดการผู้ใช้web table
  var pid = req.headers.pid
  pool.connect((err,client,done)=>{
  if(err){
    return res.json({
      'code':400 , "Message": "Error1"
    })
  }
  else{
    client.query(`select uid,fname,lname,email,tel,web.webuser_role.role_name,dis_name,web.disabled.dis_id,web.webusers.org_id from web.webusers 
    inner join web.webuser_role on web.webusers.org_id = web.webuser_role.role_id
    inner join web.disabled on web.disabled.dis_id = web.webusers.disabled
	where uid = '${pid}';`,(err,result)=>{
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


app.listen(port, function () {
  console.log('CORS-enabled web server listening on port 3001')
})