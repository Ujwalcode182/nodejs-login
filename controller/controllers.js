const bcrypt = require("bcrypt");
const Users = require("../models/user.js");

const isAuthMiddleware = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.render("login", { mess: "Not Authorized" });
    }
};

const getLogin = (req, res, next) => {
    res.render("login", { mess: "" });
};


const postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const validUser = await Users.find({ email: email });

    if (validUser.length < 1) {
        return res.render("login", {
            mess: "Email not found. Please register",
        });
    }
    const matched = await bcrypt.compare(password, validUser[0].password);
    if (matched) {
        req.session.isAuth = true;
        res.redirect("/dashboard");
    } else {
        res.render("login", { mess: "Password not matched" });
    }
};


const getRegister = (req, res, next) => {
    res.render("register", { mess: "" });
};


const postRegister = async (req, res, next) => {
    const { name, surname,email,employeeId,designation, company, password, password2 } = req.body;
    if (
        name.length < 1 ||
        email.length < 1 ||
        password.length < 1 ||
        password != password2
    ) {
        return res.render("register", {
            mess: "Invalid Name or Password did not match",
        });
    }
    const alreadyUser = await Users.find({ email: email });
    if (alreadyUser.length > 0) {
        return res.render("login", { mess: "Already registered user, login" });
    }
    const hashPass = await bcrypt.hash(password, 12);
    const newUser = new Users({
        name: name,
        surname: surname,
        email: email,
        designation :designation,
        employeeId:employeeId,
        company:company,
        password: hashPass,
    });
    newUser
        .save()
        .then(() => {
            res.render("login", { mess: "Registered successfully, login" });
        })
        .catch((err) => console.log(err));
};



const getDashboard = (req, res, next) => {
    res.render("dashboard");
};


const postLogout = (req, res) => {
    req.session.destroy((err) => console.log(err));
    res.redirect("/");
};


module.exports = {
    getLogin,
    getRegister,
    postLogin,
    postRegister,
    getDashboard,
    isAuthMiddleware,
    postLogout,
};