const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a new user with hashed password
app.post('/users/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
  
    try {
      // Hash the password
      const saltRounds = 10; // Number of salt rounds
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create new user with hashed password
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      res.json(newUser);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Error creating user' });
    }
});

// Login a user
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare provided password with stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Login successful
      res.json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Error logging in' });
    }
});


app.post('/refers', async (req, res) => {
    const { referrer_name, referrer_email, referee_name, referee_email } = req.body;
    
    try {
        // Fetch the referrer user based on email
        const referrer = await prisma.user.findUnique({
            where: { email: referrer_email }
        });

        if (!referrer) {
            return res.status(404).json({ error: 'Referrer not found' });
        }

        // Create the refer record
        const referRecord = await prisma.refer.create({
            data: {
                referrer_id: referrer.userid, // Reference to the referrer
                referrer_name: referrer_name, // Optional: You can store referrer details if needed
                referee_name: referee_name,   // Optional: If referee is not a user, store their details
                referee_email: referee_email  // Optional: If referee is not a user, store their email
            }
        });

        res.status(201).json({ message: 'Refer record created successfully', referRecord });
    } catch (error) {
        console.error('Error creating refer record:', error);
        res.status(500).json({ error: 'Error creating refer record' });
    }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


