
const Router = require("express").Router;
const router = new Router();
const jsonschema = require("jsonschema");
const { createToken } = require("../helpers/tokens");
const User = require("../models/user");
const { BadRequestError } = require("../expressError");
const userRegisterSchema = require("../schemas/userRegister.json");
const userLoginSchema = require("../schemas/userLogin.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const changePasswordSchema = require("../schemas/changePassword.json");
const { ensureCorrectUserUpdate } = require("../middleware/auth");

/** login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userLoginSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        User.updateLoginTimestamp(username);
        return res.json({ token });
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
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        User.updateLoginTimestamp(newUser.username);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
});

/** edit user: 
*
* {username, password, current_password, first_name, last_name, email} => {token}.
*/

router.put("/update", ensureCorrectUserUpdate, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const match = await User.authenticate(req.body.username, req.body.current_password)
        if (!match) res.status(401).json({ message: "Incorrect current password" })
        const updateUser = await User.update(req.body);

        return res.status(201).json({ updateUser });
    } catch (error) {
        return next(error);
    }
});

/** change password - checks is provided current password matches */
router.put("/update-password", ensureCorrectUserUpdate, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, changePasswordSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const match = await User.authenticate(req.body.username, req.body.current_password)
        if (!match) res.status(401).json({ message: "Incorrect current password" })
        const updatePassword = await User.updatePassword(req.body);
        return res.status(201).json({ message: "success" });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
