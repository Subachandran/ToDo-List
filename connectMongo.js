const mongoose = require('mongoose');

async function connectDb() {
  // connect mongodb
  let uri = "mongodb://localhost:27017/todo-list"
  await mongoose.connect(
    uri,
    () => console.log("Connected succesfully"),
    e => console.error(e)
  )
  try {
    // Schema
    const itemsSchema = new mongoose.Schema({
      Date: String,
      Done: Array,
      notDone: Array
    })
    // model
    const todo_list = await mongoose.model("task", itemsSchema)
    // test insert
    const insertData = await todo_list.insertMany([
      {
        Date:"Nov 22, 2022",
        Done: ["task1", "task2"],
        notDone:["task3", "task4"]
      }
    ])
  } catch (err) {
    console.error(err.message)
  } 
}



module.exports.connectDb = connectDb