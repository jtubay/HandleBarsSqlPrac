const exphbs = require("express-handlebars");
const express = require("express");
const mysql = require("mysql");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.set(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "quotes_db"
});
connection.connect(err => {
    if(err){
        console.error(`error connecting: ${err.stack}`);
        return;
    }
    console.log(`connected as id ${connection.threadId}`)
});
app.get("/:id", (req, res) => {
    connection.query("SELECT * FROM quotes where id = ?", [req.params.id], (err, data) => {
        if(err){
            return res.status(500).end();
        }
        console.log(data);
        res.render("single-quote", data[0])
    })
});
app.get("/api/quotes", (req, res) => {
    connection.query("INSERT INTO quotes (author, quotes) VALUES (?,?)", [req.body.author, req.body.quote], (err, result) => {
        if(err){
            return res.status(500).end();
        }
        //return id of new quote
        res.json({ id: result.insertId });
    })
});
app.delete("/api/quotes/:id", (req, res) => {
    connection.query("DELETE FROM quotes WHERE id = ?", [req.params.id], (err, result) => {
        if(err) {
            return res.status(500).end();
        }
        else if(result.affectedRows === 0){
            //if id not found affects rows equals 0
            return res.status(404).end()
        }
        res.status(200).end()
    })
});
app.put("/api/quotes/:id", (req, res) => {
    connection.query("UPDATE quotes SET author = ?, quote = ? WHERE id = ?", 
    [req.body.author, req.body.quote, req.params.id],
    (err, result) => {
        if(err){
            return res.status(500).end()
        }
        else if (result.changedRows === 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
          }
          res.status(200).end();
    
    })
})
app.listen(PORT, () => console.log(`Server listening on: http://localhost:${PORT}`));