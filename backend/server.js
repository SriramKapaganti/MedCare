const express = require("express")
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')



const SECRET_KEY = 'nirog_super_secret_key'
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'https://med-care-9j7was196-srirams-projects-4f261a65.vercel.app',
  credentials: true
}))

// connect database 
const db = new sqlite3.Database("./docpat.db")

// create table if not exists

db.serialize(() => {
    //doc Table
    db.run(`
        CREATE TABLE IF NOT EXISTS doctors(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        specialization TEXT,
        status TEXT,
        profile_image TEXT
        )
        `)
    // Patients Table
    db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `)
    // Appointment Table
    db.run(`
        
        CREATE TABLE IF NOT EXISTS appointments(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER,
        patient_id INTEGER,
        appointment_date TEXT,
        appointment_time TEXT,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id),
        FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
        `)  
        
    db.run(`
    INSERT OR IGNORE INTO doctors (id, name, specialization, status, profile_image)
    VALUES 
      (1, 'Dr. Meera', 'Pediatrician', 'Available', '/images/meera.png'),
      (2, 'Dr. Ravi', 'Orthopedic', 'On Leave', '/images/ravi.png'),
      (3, 'Dr. Anjali', 'Dermatologist', 'Fully Booked', '/images/anjali.png')
  `)    
})


const authenticateToken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}


//Get All Doctors

app.get("/doctors", (req, res)=>{
    db.all(
        'SELECT * FROM doctors', [] , (err, rows) => {
            if(err) res.status(500).send(err)
                res.json(rows)
        }
        )
})

//Get Specific Doctor 
app.get("/doctors/:id", authenticateToken, (req, res) => {
    db.get('SELECT * FROM doctors WHERE id = ?', [req.params.id], (err, row) => {
        if(err) res.status(500).send(err)
        res.send(row)
    })
})

// Book appoinment 
app.post('/appointments', authenticateToken, (req, res) => {
  const { name, email, doctorId, date, time } = req.body

  if (!name || !email || !doctorId || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  console.log('📨 Booking request:', { name, email, doctorId, date, time })

  // Insert or ignore patient
  db.run(
    `INSERT OR IGNORE INTO patients (name, email) VALUES (?, ?)`,
    [name, email],
    function (err) {
      if (err) {
        console.error('Error inserting patient:', err)
        return res.status(500).json({ error: 'Failed to insert patient' })
      }

      // Get patient ID
      db.get(
        `SELECT id FROM patients WHERE email = ?`,
        [email],
        (err, patientRow) => {
          if (err || !patientRow) {
            console.error('Error getting patient:', err)
            return res.status(500).json({ error: 'Failed to get patient' })
          }

          const patientId = patientRow.id

          // Insert appointment
          db.run(
            `INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)`,
            [doctorId, patientId, date, time],
            function (err) {
              if (err) {
                console.error('Error inserting appointment:', err)
                return res.status(500).json({ error: 'Failed to book appointment' })
              }

              console.log('Appointment booked successfully')
              res.status(201).json({ message: 'Appointment booked!' })
            }
          )
        }
      )
    }
  )
})


//reshecdule appoinment

app.put("/appointment/:id", authenticateToken, (req, res)=>{
    const {date, time} = req.body
    db.run(`UPDATE appointments  SET appointment_date = ? , appointment_time = ? WHERE id = ?`, [date, time, req.params.id], err =>{
        if(err) return res.status(500).send(err)
        res.send({ message: 'Appointment rescheduled!' })
    })
})


// SignUpForm
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body
  console.log(req.body)
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Check if user already exists
  db.get(`SELECT * FROM patients WHERE email = ?`, [email], (err, existingUser) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: "Database error" })
    }

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Insert new user
    db.run(
      `INSERT INTO patients(name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword],
      function (err) {
        if (err) {
          console.error(err)
          return res.status(500).json({ error: "Failed to register user" })
        }

        res.status(201).json({ message: "Signup successful" })
      }
    )
  })
})


//LoginForm

app.post("/login", (req, res) => {
  const { email, password } = req.body
  console.log(req.body)

  db.get(`SELECT * FROM patients WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) {
      console.error('DB Error or User not found:', err)
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    try {
      const matched = await bcrypt.compare(password, user.password)

      if (!matched) {
        return res.status(401).json({ error: 'Invalid password' })
      }

      const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1h' })

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',  
        secure: true,      
        path: '/',
        maxAge: 3600000
      })

      res.json({ message: 'Login successful', name: user.name })
    } catch (error) {
      console.error('Error comparing password:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
})

//Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token', {
  httpOnly: true,
  sameSite: 'None',
  secure: true,
  path: '/'
})
  res.json({ message: 'Logged out' })
})

app.listen(5000, () => console.log('SQLite backend running on http://localhost:5000'))

//token verification
app.get('/verify-token', (req, res) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    res.json({ valid: true, user: decoded })
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
})