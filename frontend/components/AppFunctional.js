import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(""); // Initialize message state
  const [email, setEmail] = useState(""); // Initialize email state
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [steps, setSteps] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [target, setTarget] = useState({ x, y });

  function getXY() {}

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setEmail("");
    setMessage("");
    setX(2);
    setY(2);
    setSteps(0);
  }

  function getNextIndex(direction) {
    const minX = 1;
    const minY = 1;
    const maxX = 3;
    const maxY = 3;

    let nextX = x;
    // console.log("this is x", nextX)
    let nextY = y;
    // console.log("this is y" , nextY)

    switch (direction) {
      case "left":
        nextX = Math.max(minX, x - 1);
        break;
      case "right":
        nextX = Math.min(maxX, x + 1);
        break;
      case "up":
        nextY = Math.max(minY, y - 1);
        break;
      case "down":
        nextY = Math.min(maxY, y + 1);
        break;
      default:
        break;
    }

    return { nextX, nextY };
  }

  function move(direction) {
    const { nextX, nextY } = getNextIndex(direction);

    setX(nextX);
    setY(nextY);
    // setTarget({ x, y })

    setSteps(steps + 1);
  }

  useEffect(() => {
    setTarget({ x, y });
  }, [x, y]);

  // console.log(getItWorking(0))

  function onChange(evt) {
    evt.preventDefault();
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const payload = {
      x: x,
      y: y,
      steps: steps,
      email: email,
    };
    axios
      .post("http://localhost:9000/api/result", payload)
      .then((response) => {
        setEmail("");
        setMessage(response.data.message);
        // console.log(response)
      })
      .catch((error) => {
        if (email === "foo@bar.baz") {
          setMessage(error.response.data.message);
          // console.log(error)
        } else {
          setMessage("Ouch: email is required");
        }
      });
  }

  function stepCounter() {
    setSteps(steps + 1);
  }

  function getItWorking(index) {
    //Get the css attribute grid-template-columns from the css of class grid
    //split on whitespace and get the length, this will give you how many columns
    const colCount = 3;

    const rowPosition = Math.floor(index / colCount) + 1;
    const colPosition = (index % colCount) + 1;

    const results = { x: rowPosition, y: colPosition };
    return (
      Object.values(target)[0] === Object.values(results)[0] &&
      Object.values(target)[1] === Object.values(results)[1]
    );
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Coordinates ({x}, {y})
        </h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>

      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${getItWorking(idx) ? " active" : ""}`}
          >
            {idx === 4 ? "B" : null}
          </div>
        ))}
      </div>

      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move("left")}>
          LEFT
        </button>
        <button id="up" onClick={() => move("up")}>
          UP
        </button>
        <button id="right" onClick={() => move("right")}>
          RIGHT
        </button>
        <button id="down" onClick={() => move("down")}>
          DOWN
        </button>

        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          onChange={onChange}
          value={email}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
