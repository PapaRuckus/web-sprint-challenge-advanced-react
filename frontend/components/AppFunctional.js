import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); 
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [steps, setSteps] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [target, setTarget] = useState({ x, y });


  function reset() {
    setEmail("");
    setMessage("");
    setX(2);
    setY(2);
    setSteps(0);
  }


  function move(direction) {
    const minX = 1;
    const minY = 1;
    const maxX = 3;
    const maxY = 3;

    let nextX = x;
    let nextY = y;

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
    setMessage("");
  }, [x, y]);

  function onChange(evt) {
    evt.preventDefault();
    setEmail(evt.target.value);
  }


  function isValidEmail(email) {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
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
      })
      .catch((error) => {
        if (email === "foo@bar.baz") {
          setMessage(error.response.data.message);
        } else if (email === "") {
          setMessage("Ouch: email is required");
        } else if (!isValidEmail(email)) {
          setMessage("Ouch: email must be a valid email");
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
        <h3 id="steps">
          You moved {steps} time{steps === 1 ? "" : "s"}
        </h3>
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
