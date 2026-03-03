// Cobie Caburao
// 200436566
// ENSE 281
// Lab 6
const fs = require( "fs" );

const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 

// host static resources, like js and css
app.use(express.static("public"))

// configure express to access variables in req.body object when submitting forms
app.use(express.urlencoded({ extended: true})); 

// a common localhost test port
const port = 3000;

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    // code you wish to run when the user get's the route must be in here!
    res.sendFile(__dirname + "/public/index.html")
    console.log("A user requested the about page");
});

app.post('/app', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    fs.readFile(__dirname + "/users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.error("Error reading file from disk:", err);
            return;
        }

        try {
            const users = JSON.parse(jsonString);
            const authUser = users.find(
                function(u) {
                    if (u.username === username && u.password === password) {
                        return true;
                    } else {
                        return false;
                    }
                }
            );

            if (authUser) {
                res.sendFile(__dirname + "/public/todo.html")
            } else {
                res.redirect('/');
            }
        } catch (err) {
            console.log("Error parsing JSON:", err);
        }
    });
});

