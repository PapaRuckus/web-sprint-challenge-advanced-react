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

  // function getNextIndex(direction) {
  //   const minX = 1;
  //   const minY = 1;
  //   const maxX = 3;
  //   const maxY = 3;

  //   let nextX = x
  //   // console.log("this is x", nextX)
  //   let nextY = y
  //   // console.log("this is y" , nextY)

  //   switch (direction) {
  //     case "left":
  //       nextX = (Math.max(minX, x - 1));
  //       console.log(nextX);
  //       break;
  //     case "right":
  //       nextX = Math.min(maxX, x + 1);
  //       console.log(nextX);
  //       break;
  //     case "up":
  //       nextY = Math.max(minY, y - 1);
  //       console.log(nextY);
  //       break;
  //     case "down":
  //       nextY = Math.min(maxY, y + 1);
  //       console.log(nextY);
  //       break;
  //     default:
  //       break;
  //   }

  //   return { nextX, nextY };
  // }

  function move(direction) {
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
        nextX = x - 1;
        break;
      case "right":
        nextX = x + 1;
        break;
      case "up":
        nextY = y - 1;
        break;
      case "down":
        nextY = y + 1;
        break;
      default:
        break;
    }
    if (nextX < 4 && nextY < 4 && nextX > 0 && nextY > 0) {
      setSteps(steps + 1);
    }
    if (nextX < 1) {
      nextX = 1;
      setMessage("You can't go left");
    }
    if (nextX > 3) {
      nextX = 3;
      setMessage("You can't go right");
    }
    if (nextY < 1) {
      nextY = 1;
      setMessage("You can't go up");
    }
    if (nextY > 3) {
      nextY = 3;
      setMessage("You can't go down");
    }

    setX(nextX);
    setY(nextY);
  }

  function movingB(index) {
    let rowPosition;
    let colPosition;
    switch (index) {
      case 0:
      case 3:
      case 6:
        colPosition = 1;
        break;
      case 1:
      case 4:
      case 7:
        colPosition = 2;
        break;
      case 2:
      case 5:
      case 8:
        colPosition = 3;
        break;
      default:
        break;
    }

    switch (index) {
      case 0:
      case 1:
      case 2:
        rowPosition = 1;
        break;
      case 3:
      case 4:
      case 5:
        rowPosition = 2;
        break;
      case 6:
      case 7:
      case 8:
        rowPosition = 3;
        break;
      default:
        break;
    }

    const results = { colPosition, rowPosition };
    return (
      Object.values(target)[0] === Object.values(results)[0] &&
      Object.values(target)[1] === Object.values(results)[1]
    );
  }

  useEffect(() => {
    setTarget({ x, y });
    setMessage("")
  }, [x, y]);

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
          <div key={idx} className={`square${movingB(idx) ? " active" : ""}`}>
            {movingB(idx) ? "B" : null}
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
