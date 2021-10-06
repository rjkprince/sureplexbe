const express = require("express");
const people = require("./people 2.json");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.post("/getPeopleInRange", (req, res) => {
  const body = req.body;
  const range = body?.range;
  if (range) {
    if (Array.isArray(range) && range.length >= 2) {
      const min = Number(range[0]);
      const max = Number(range[1]);
      if (isNaN(min) || isNaN(max))
        return res
          .status(400)
          .send("Invalid range format. Range should be an array of 2 numbers");
      const filteredPeople = people.filter((p) => {
        const balance = parseFloat(p.balance.replace(",", "").replace("$", ""));
        return balance > min && balance < max;
      });
      return res.status(200).send(filteredPeople);
    } else
      return res
        .status(400)
        .send("Invalid range format. Range should be an array of 2 numbers");
  } else return res.status(400).send("range is not defined");
});

app.post("/getFriends", (req, res) => {
  const body = req.body;
  let { active, balance } = body;
  if (active === undefined || balance === undefined)
    return res.status(400).send("active or balance is not defined");
  active = active === "true" ? true : active === "false" ? false : active;
  balance = Number(balance);

  if (typeof active === "boolean" && !isNaN(balance)) {
    const filteredPeople = people.filter((p) => {
      const pBalance = parseFloat(p.balance.replace(",", "").replace("$", ""));
      return p.isActive === active && pBalance < balance;
    });
    const friends = [];
    filteredPeople.forEach((ppl) => {
      ppl.friends.forEach((frnd) => friends.push(frnd));
    });
    return res.status(200).send(friends);
  } else
    return res
      .status(400)
      .send(
        "Invalid active or balance format. Active should be a boolean and balance should be a number."
      );
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
