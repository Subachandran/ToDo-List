// To do list server

// importing required modules
const express = require("express");
const moment = require("moment");
const mongoose = require("mongoose");
const 

// call express
const app = express();
// use bodyParser
app.use(express.urlencoded({ extended: true }));
// creating public folder
app.use(express.static("public"));
// set ejs
app.set("view engine", "ejs");

// Date Format
let dateOptions = { day: "numeric", month: "long", year: "numeric" };
function dateFormat(cDate) {
  let date_format = {
    day: cDate.getDate(),
    month: moment.months()[cDate.getMonth()],
    year: cDate.getFullYear(),
  };
  let dateString = cDate.toLocaleDateString("en-US", dateOptions);
  let suggestions = { fullDays: [], fullMonths: [], fullYears: [] };
  let dIM = new Date(cDate.getFullYear(), cDate.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= dIM; i++) suggestions.fullDays.push(i);
  suggestions.fullMonths = moment.months();
  for (let i = 0; i <= 10; i++) {
    suggestions.fullYears.push(new Date().getFullYear() - i);
  }

  return {
    date_format: date_format,
    suggestions: suggestions,
    dateString: dateString,
  };
}

// Mongo DB
// connect mongodb
let uri = process.env.MONGODB_CONNECTION_URI;
mongoose.connect(
  uri,
  () => console.log("Connected DB succesfully"),
  (e) => console.error(e)
);

// Schema
const itemsSchema = new mongoose.Schema({
  Date: { type: String, index: true },
  Done: Array,
  notDone: Array,
});
// model
const todoData = mongoose.model("task", itemsSchema);

async function showCollections(filter = {}) {
  let docs = await todoData.findOne(filter, { _id: 0, __v: 0 }).exec();
  return docs;
}

async function createDocument(date) {
  await todoData.insertMany([
    {
      Date: dateFormat(date).dateString,
      Done: [],
      notDone: [],
    },
  ]);
  tList = await showCollections({ Date: dateFormat(date).dateString });
  return tList;
}

// port number
let port = process.env.PORT || 3000 

// Initiate server
app.listen(port, function () {
  console.log(`Server initiated at port number ${port}...`);
});

// Declare home page (root)
app.get("/", async function (req, res) {
  CurrentDate = new Date();
  CurrentDateString = CurrentDate.toLocaleDateString("en-US", dateOptions);
  try {
    let tasksList = await showCollections({ Date: CurrentDateString });
    tasksList = !tasksList ? await createDocument(CurrentDate) : tasksList;
    res.render("index", {
      cDate: dateFormat(CurrentDate),
      tasks: { Done: tasksList.Done, notDone: tasksList.notDone },
    });
  } catch (error) {
    console.error(error);
  }
});

// Post request
app.post("/", async function (req, res) {
  let input = req.body;
  // adding new task
  if (input.newTask !== undefined) {
    await todoData.updateOne(
      { Date: CurrentDateString },
      { $push: { notDone: input.newTask } }
    );

    // Changing date
  } else if (input.newDate !== undefined) {
    let newDate = new Date(input.newDate);
    CurrentDateString = dateFormat(newDate).dateString;
    let docOnNewDate = await showCollections({ Date: CurrentDateString });
    docOnNewDate = !docOnNewDate ? await createDocument(newDate) : docOnNewDate;

    // Updating finished and unfinished tasks
  } else if (input.checked !== undefined || input.notChecked !== undefined) {
    await todoData.updateOne(
      { Date: CurrentDateString },
      {
        $set: {
          Done: input.checked !== undefined ? input.checked : [],
          notDone: input.notChecked !== undefined ? input.notChecked : [],
        },
      }
    );

    // Delete task from task
  } else if (input.delTaskName !== undefined) {
    await todoData.updateOne(
      { Date: CurrentDateString },
      { $pull: { [input.category]: input.delTaskName } }
    );
  }
  tasksList = await showCollections({ Date: CurrentDateString });
  res.send({ Done: tasksList.Done, notDone: tasksList.notDone });
});
