const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const connection = require("../database.js");
const {detectLabels, detectImageProperties} = require("../utils/imageRecognition");


//Get labels
router.get("/labels", async (req, res) => {
    const { link } = req.body;
    if (!link) {
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const labels = await detectLabels(link);
    
    const dominantColors = await detectImageProperties(link);


    return res.json({
        labels,
        dominantColors
    });
}
);



//Get the messages
router.get("/", (req, res) => {
    connection.query("SELECT ID, writerName, writerMail, DATE_FORMAT(date_write,'%e-%M-%Y') as date, subject, content FROM diary", (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.json({
            message: results,
        })
    })

});

//Insert a message
router.post("/", (req, res) => {
    console.log(req.body);

    const {
        writerName,
        writerMail,
        date_write,
        subject,
        content
    } = req.body;
    if (!writerName || !writerMail || !date_write || !subject || !content) {
        return res.status(400).json({
            error: "All fields are required!",
        })
    }

    connection.query(`INSERT into diary (writerName, writerMail, date_write, subject, content) values (${mysql.escape(writerName)}, ${mysql.escape(writerMail)}, ${mysql.escape(date_write)}, ${mysql.escape(subject)},${mysql.escape(content)}) `, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.json({
            message: results,
        })
    })

});


//Get the messages by id
router.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parameters.");
    }

    connection.query(`SELECT ID, writerName, writerMail, DATE_FORMAT(date_write,'%e-%M-%Y') as date, subject, content FROM diary WHERE ID= ${mysql.escape(id)}`, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.json({
            message: results,
        })
    })

});

//Delete by id
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = `DELETE FROM diary WHERE ID = ${mysql.escape(id)}`;
    connection.query(queryString, (err, results) => {
        if (err) {
            return res.send(err);
        }
        if (results.length === 0) {
            return res.status(404).send("Message not found.");
        }
        return res.json({
            results,
        });
    }
    );
}
);

//Update by id
router.put("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const {
        writerName,
        writerMail,
        date_write,
        subject,
        content
    } = req.body;
    if (!writerName || !writerMail || !date_write || !subject || !content) {
        return res.status(400).json({
            error: "All fields are required!",
        })
    }


    const queryString = `UPDATE diary SET writerName = ${mysql.escape(writerName)}, writerMail = ${mysql.escape(writerMail)}, date_write = ${mysql.escape(date_write)}, subject = ${mysql.escape(subject)}, content = ${mysql.escape(content)} WHERE ID = ${mysql.escape(id)}`;
    connection.query(queryString, (err, results) => {
        if (err) {
            return res.send(err);
        }
        if (results.length === 0) {
            return res.status(404).send("Message not found.");
        }
        return res.json({
            results,
        });
    }
    );
}
);



module.exports = router;