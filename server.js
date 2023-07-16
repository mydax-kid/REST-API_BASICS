const { readDb, writeDb } = require('./dbFunctions')
const express = require('express')
const app = express()
const port = 8000

//Middleware
app.use(express.json())
app.use(require('cors')())


//GET REQUEST
app.get('/', (req, res) => {
    res.status(200).send({ friends: readDb().friends })
})

app.get('/aloha/james', (req, res) => {
    res.send('aloha')
})

app.get('/:friend', (req, res) => {
    const { friend } = req.params
    const { limit } = req.query
    const newMessage = readDb().friends.filter(each => {
        return each.includes(friend)
    }).splice(0, limit)

    res.status(200).send({ message: newMessage })
})

//POST REQUEST
app.post('/', (req, res) => {
    const { newFriend } = req.body
    if (!newFriend) {
        return res.status(400).send({ 
            message: "Please include friend name" 
        })
    }
    try {
        const currFriends = readDb().friends
        writeDb({ friends: [...currFriends, newFriend] })
    } catch (err) {
        writeDb({ friends: [newFriend] })
    }

    res.status(200).send({ message: `added your friend: ${newFriend}` })
})

//UPDATE REQUEST
app.put('/:exfriend', (req, res) => {
    const { exfriend } = req.params;
    const { newfriend } = req.body;

    if (!newfriend) {
        return res.status(400).send({ message: "Please include friend name" })
    }

    const updatedFriends = readDb().friends.map((each) => {
        return each === exfriend ? newfriend : each;
    });

    try {
        writeDb({ friends: updatedFriends });
    } catch (err) {
        console.log(err);
    }

    res.status(200).send({ 
        message: `Replaced ${exfriend} with your new friend: ${newfriend}` 
    });
});

//DELETE REQUEST
app.delete('/', (req, res) => {
    const { enemy } = req.body
    try {
        const currFriends = readDb().friends
        writeDb({
            friends: currFriends.filter(friend => {
                return !friend.includes(enemy)
            })
        })
        res.status(200).send({ friendsList: readDb().friends })
    } catch (err) {
        res.status(400).send({ message: 'you have no friends' })
    }
})


app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})