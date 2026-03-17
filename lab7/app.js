const express = require ( "express" );
const fs = require("fs");
const path = require("path");

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// host static resources
app.use(express.static("public"));
// body-parser is now built into express!
app.use(express.urlencoded({ extended: true})); 

app.set("view engine", "ejs");

// a common localhost test port
const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res)=>{
    res.render("Login");
});

// let fruits = ["apples", "orange", "peach", "mango"];

// app.post("/", (req, res) => {
//     res.render("greeting", {username: req.body["my-name"], 
//                             fruitList: fruits});
// });

let User = [
    {
        "username": "pikachu",
        "password": "abc123"
    },

    {
        "username": "eevee",
        "password": "123abc"
    }
];

let Post = [
    {
        "_id": "0",
        "text": "pi",
        "creator": "pikachu",
        "upvotes": [],
        "downvotes": []
    },

    {
        "_id": "1",
        "text": "ka",
        "creator": "pikachu",
        "upvotes": ["eevee"],
        "downvotes": []
    },

    {
        "_id": "2",
        "text": "chu!",
        "creator": "pikachu",
        "upvotes": [],
        "downvotes": ["eevee"]
    },

    {
        "_id": "3",
        "text": "ee",
        "creator": "eevee",
        "upvotes": [],
        "downvotes": []
    },

    {
        "_id": "4",
        "text": "v",
        "creator": "eevee",
        "upvotes": ["pikachu"],
        "downvotes": []
    },

    {
        "_id": "5",
        "text": "ee!",
        "creator": "eevee",
        "upvotes": [],
        "downvotes": ["pikachu"]
    }
];

// function saveUsers() {
//     fs.writeFileSync("user.json", JSON.stringify(User, null, 2));
// }

// function savePosts() {
//     fs.writeFileSync("post.json", JSON.stringify(Post, null, 2));
// }

// function loadUsers() {
//     if (fs.existsSync(user.json)) {
//         const data = fs.readFileSync("user.json", "utf-8");
//         User = JSON.parse(data);
//     } else {
//         User = [];
//     }
// }

// function loadPosts() {
//     if (fs.existsSync(post.json)) {
//         const data = fs.readFileSync("post.json", "utf-8");
//         Post = JSON.parse(data);
//     } else {
//         Post = [];
//     }
// }

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const authUser = User.find(
        function(u) {
            if (u.username === username && u.password === password) {
                return true;
            } else {
                return false;
            }
        }
    )

    if (authUser) {
        res.redirect(307, '/note-vote')
    } else {
        res.redirect('/');
    }
});

app.post('/register', (req, res) => {
    const inviteCode = req.body.invite;
    const username = req.body.username;
    const password = req.body.password;

    if (inviteCode === "Note Vote 2026") {
        const existingUser = User.find(
            function(u) {
                if (u.username === username) {
                    return true;
                } else {
                    return false;
                }
            }
        )

        if (!existingUser) {
            User.push({username, password});
            res.redirect(307, '/note-vote')
        } else {
        res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

app.post('/note-vote', (req, res) => {
    const username = req.body.username;

    res.render('NoteVote', {username: username, notes: Post});

});