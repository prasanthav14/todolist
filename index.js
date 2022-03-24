const express = require('express')
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { redirect } = require('statuses');
const app = express();
const _ = require('lodash');

const dayormonth = require(__dirname + "/module.js")
const mongoose = require('mongoose');
const { Router } = require('express');

//---> starting the server

mongoose.connect("mongodb+srv://prasanthav14:thegreenmile03@cluster0.nae2o.mongodb.net/todolist")
//--------> creating schema

const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: "content required for pushing-todo"
    }
})
const todoObject = mongoose.model("todo", todoSchema);
let todo = new todoObject;
let def1 = new todoObject;
let def2 = new todoObject;
def1 = {
    content: "Woke up..."
}
def2 = {
    content: "I'm planning to...  "
}

const listSchema = new mongoose.Schema({
    listname: { type: String },
    listcontent: [todoSchema]
})

const listObject = mongoose.model("listObject", listSchema);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
app.engine('.html', require('ejs').__express);
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    todoObject.find({}, (err, data) => {
        if (err) {
            console.log("error reading")
            console.log(err);
        }
        else {
            console.log(data);

            if (data.length === 0) {
                todoObject.insertMany([def1], (err) => {
                    if (err) {
                        console.log("error default")
                        console.log(err)
                    }
                    else {
                        console.log("default saved")
                    }
                })
                res.redirect("/")
                return;
            }
        }
        res.render('view', { disp: "How's your " + dayormonth.day() + "...😃", displist: data, flag: "todo" });
    })
})

app.post("/", (req, res) => {
    var buttonName = req.body.button1;
    if (buttonName === "todo") {
        if (req.body.listname != "") {
            todo = { content: req.body.listname }
            todoObject.insertMany([todo], (err) => {
                if (err) {
                    console.log("error saving")
                    console.log(err)
                }
                else console.log(" saved")
            })
        }
        res.redirect("/")
    }
    else {
        listObject.findOne({ listname: buttonName }, (err, data) => {
            if (err) console.log("error matching listname")
            else {
                console.log("matching listname success")
                if (req.body.listname != "") {
                    data.listcontent.push({ content: req.body.listname })
                    data.save((err, dta) => {
                        if (!err) console.log("data saved: ", dta)
                    })
                }
            }
            res.redirect("/" + data.listname)
            console.log("redirection : " + "/---" + buttonName)
        })
    }

})

app.post("/custom", (req, res) => {
    if (req.body.button3 === "customlist") {
        let dir = _.capitalize(req.body.customlist)
        console.log(dir)

        if (dir == "About") {
            res.redirect("/about")
            console.log("about page")
        }
        else if (dir == "/" || dir == "" || dir == "Home") {
            res.redirect("/")
            console.log("home page")
        }
        else {
            res.redirect("/" + req.body.customlist)
            console.log("page -" + dir)
        }
    }
})

app.post("/clear", (req, res) => {
    console.log(req.body.button2)
    if (req.body.button2 === "todo") {
        todoObject.deleteMany({}, (err) => {
            if (err) console.log("delete error")
            else {
                console.log("delete success")
                res.redirect("/")
            }
        })
    }
    else {
        let flag = req.body.button2
        listObject.deleteMany({ listname: flag }, (err) => {
            if (err) console.log("list delete error")
            else {
                console.log("list delete success")
                res.redirect("/" + flag)
            }
        })
    }
})

app.get("/about", (req, res) => {
    res.render("about",)
})

app.post("/check", (req, res) => {
    const id = req.body.checkbox;
    const listname = req.body.listname;
    console.log(id, listname)
    if (listname === "todo") {
        todoObject.findByIdAndRemove(id, (err) => {
            if (err) console.log("todo item delete error")
            else console.log("todo item delete success")
            res.redirect("/")
        })
    }
    else {
        listObject.findOneAndUpdate({ listname: listname }, { "$pull": { listcontent: { _id: id } } }, { safe: true, multi: true }, (err, find) => {
            if (!err) {
                console.log("success: " + find);
                res.redirect("/" + listname)
            }
        })
    }
})

app.get('/:route', (req, res) => {
    const route = _.capitalize(req.params.route);
    listObject.findOne({ listname: route }, (err, data) => {
        if (err) console.log("route findone exe error")
        else {
            console.log(" route findone exe")
            if (!data) {
                console.log("new route")
                var list = new listObject;
                list = {
                    listname: route,
                    listcontent: [def2]
                }
                listObject.insertMany([list], (err) => {
                    if (err) console.log("default insert error ")
                    else console.log("default insert success")
                })
                res.redirect("/" + route)
            }
            else {
                // console.log("existing route and  data: " + data.listname + "  content:  " + data.listcontent[0].content)
                res.render('temp', { listname: data.listname, listcontent: data.listcontent });
            }
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, () => {
    console.log("server started at 3000")
})


