const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../valuekeys.js");
const requireLogin = require("../middleware/requireLogn.js");

router.get("/", (req, res) => {
  res.send(":");
});

router.post("/signup", (req, res) => {
  const { fname, lname, phone, email, password } = req.body;

  if (!fname || !lname || !phone || !email || !password) {
    res.status(422).json({ error: "Need more information" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "This email is already added" });
      }

      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          fname,
          lname,
          phone,
          email,
          password: hashedpassword
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Saved Succesfuly" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });


});
/*export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 */
router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, fname, lname, phone, email } = savedUser
          res.json({ token, user: { _id, fname, lname, phone, email } });
        } else {
          return res.status(422).json({ error: "Invalid Email or Password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
