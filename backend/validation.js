const express = require('express');
const bcrypt  = require('bcrypt');
const fs      = require('fs'); //KA
const app     = express();
app.use(express.json());
const usersFile = './backend/users.json';

// Hilfsfunktionen
function readUsers(){
  return JSON.parse(fs.readFileSync(usersFile,'utf8')||'[]');
}
function writeUsers(u){ fs.writeFileSync(usersFile, JSON.stringify(u,0,2)); }

// POST /api/register
app.post('/api/register', (req,res)=>{
  const {email,pw,first,last} = req.body;
  const users = readUsers();
  if(users.find(u=>u.email===email))
    return res.status(400).json({error:'E-Mail already registered'});
  const hash = bcrypt.hashSync(pw,10);
  users.push({email,hash,first,last});
  writeUsers(users);
  res.status(201).json({ok:true});
});

// POST /api/login
app.post('/api/login', (req,res)=>{
  const {email,pw} = req.body;
  const users = readUsers();
  const u = users.find(u=>u.email===email);
  if(!u || !bcrypt.compareSync(pw,u.hash))
    return res.status(401).json({error:'Invalid credentials'});
  // im echten Setup hier JWT generieren
  res.json({token:'dummy-token'});
});

// Static files
app.use('/', express.static('frontend'));
app.listen(3000,()=>console.log('Listening on :3000'));
