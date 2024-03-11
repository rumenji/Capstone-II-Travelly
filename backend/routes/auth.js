
const Router = require("express").Router;
const router = new Router();
const jsonschema = require("jsonschema");
const { createToken } = require("../helpers/tokens");
const User = require("../models/user");
const { BadRequestError } = require("../expressError");
const userRegisterSchema = require("../schemas/userRegister.json");
const userLoginSchema = require("../schemas/userLogin.json");

/** login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userLoginSchema);
        if(!validator.valid){
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const {username, password} = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        User.updateLoginTimestamp(username);
        return res.json({token});
    } catch (error) {
        return next(error);
    }
  });

  /** register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, email} => {token}.
 */

router.post("/register", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if(!validator.valid){
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        User.updateLoginTimestamp(newUser.username);
        return res.status(201).json({token});
    } catch (error) {
        return next(error);
    }
  });

module.exports = router;
