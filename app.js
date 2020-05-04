const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
const sql = require("mssql");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: "library",
  password: "psL1brary",
  server: "pslibrary-server.database.windows.net", // You can use 'localhost\\instance' to connect to named instance
  database: "PSLibrary",

  options: {
    encrypt: true,
  },
};

sql.connect(config).catch((err) => debug(err));

app.use(morgan("tiny")); // combined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "library" }));

require("./src/config/passport.js")(app);

app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(
  "/scss",
  express.static(path.join(__dirname, "/node_modules/bootstrap/scss"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js"))
);
app.use(
  "/jquery",
  express.static(path.join(__dirname, "/node_modules/jquery/dist"))
);
app.set("views", "./src/views");
app.set("view engine", "ejs");

const nav = [
  { link: "/books", title: "Book" },
  { link: "/authors", title: "Author" },
];

let bookRouter = require("./src/routes/bookRoutes")(nav);
let adminRouter = require("./src/routes/adminRoutes")(nav);
let authRouter = require("./src/routes/authRoutes")(nav);

app.use("/books", bookRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.render("index", {
    nav: nav,
    title: "Library",
  });
});

app.listen(port, () => {
  debug(`listenning on port ${chalk.green(port)}`);
});
