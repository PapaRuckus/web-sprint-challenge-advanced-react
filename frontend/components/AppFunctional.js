import React from "react";
import { useState } from "react";
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

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return { x, y };
  }

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
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    evt.preventDefault();
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
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
          setMessage("foo@bar.baz failure");
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
          Coordinates {x}, {y}
        </h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === 4 ? " active" : ""}`}>
            {idx === 4 ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={stepCounter}>
          LEFT
        </button>
        <button id="up" onClick={stepCounter}>
          UP
        </button>
        <button id="right" onClick={stepCounter}>
          RIGHT
        </button>
        <button id="down" onClick={stepCounter}>
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
