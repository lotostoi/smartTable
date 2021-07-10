const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

module.exports = async function ({ login, password, nameDataBase }, cb) {
  try {
    const link = `mongodb://127.0.0.1:27017/${nameDataBase}`;
    //const link = `mongodb+srv://${login}:${password}@cluster0.n6oze.mongodb.net/${nameDataBase}?retryWrites=true&w=majority`;
    const db = await mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connection to db is success...");
    cb(db);
  } catch (e) {
    console.error(e);
  }
};
