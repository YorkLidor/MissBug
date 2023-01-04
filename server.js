const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug-service.js')
const userService = require('./services/user.service.js')

const app = express()
const PORT = 3030

// Cookies lifespan is 7 sec's
const COOKIE_AGE = 1000 * 15
const IS_PREMIUM = false

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


//Bugs API:

// List bugs
app.get('/api/bug', (req, res) => {
    const filterBy = req.query
    bugService.query(filterBy).then(bugs => {
        res.send(bugs)
    })
})

// PDF
app.get('/api/bug/save_pdf', (req, res) => {
    bugService.createPDF()
    res.send()
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const bug = req.body
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
})

// Create
app.post('/api/bug', (req, res) => {
    const bug = req.body
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
})

// Read - getById + Cookie mechanism
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitCountIds = req.cookies.visitCountIds || []
    let logedUser =userService.validateToken(req.cookies.loginToken)
    if (!visitCountIds.includes(bugId)) {
        if (visitCountIds.length >= 3 && !logedUser.isAdmin) {
            return res.status(401).send('Wait for a bit')
        }
        visitCountIds.push(bugId)
    }

    bugService.get(bugId).then(bug => {
        res.cookie('visitCountIds', visitCountIds, { maxAge: COOKIE_AGE })
        res.send(bug)
    })
})

// Remove 
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId).then(bug => {
        res.send(bug)
    })
})

//User API://

// List
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query(filterBy)
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

//Get user by id
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})

//Login
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

//Signup
app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

//Logout
app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})


//Listen to port
app.listen(PORT, () => console.log(`Server listening on port ${PORT}: http://localhost:${PORT}/`))