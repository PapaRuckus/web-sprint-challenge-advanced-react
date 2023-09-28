import React from "react";
import { useEffect } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const initialX = 2;
const initialY = 2;

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  x: initialX,
  y: initialY,
  target: { x: initialX, y: initialY },
};

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props);
    // console.log("constructor called")
    this.state = {
      ...initialState,
    };
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({ ...initialState, x: initialX, y: initialY });
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    evt.preventDefault();
    this.setState({ email: evt.target.value });
  };

  isValidEmail(email) {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  }
  onSubmit = (evt) => {
    evt.preventDefault();
    const payload = {
      x: this.state.x,
      y: this.state.y,
      steps: this.state.steps,
      email: this.state.email,
    };
    axios
      .post("http://localhost:9000/api/result", payload)
      .then((response) => {
        this.setState({ message: response.data.message, email: "" });
      })
      .catch((error) => {
        if (this.state.email === "foo@bar.baz") {
          this.setState({ message: error.response.data.message });
        } else if (this.state.email === "") {
          this.setState({ message: "Ouch: email is required" });
        } else if (!this.isValidEmail(this.state.email)) {
          this.setState({ message: "Ouch: email must be a valid email" });
        } 
      });
  };

  move = (direction) => {
    const minX = 1;
    const minY = 1;
    const maxX = 3;
    const maxY = 3;

    let nextX = this.state.x;
    let nextY = this.state.y;
    let newMessage = "";

    switch (direction) {
      case "left":
        nextX = this.state.x - 1;
        break;
      case "right":
        nextX = this.state.x + 1;
        break;
      case "up":
        nextY = this.state.y - 1;
        break;
      case "down":
        nextY = this.state.y + 1;
        break;
      default:
        break;
    }
    if (nextX < 4 && nextY < 4 && nextX > 0 && nextY > 0) {
      this.setState((prevState) => ({
        x: nextX,
        y: nextY,
        steps: prevState.steps + 1,
      }));
    }
    if (nextX < 1) {
      this.setState({ message: "You can't go left" });
    }
    if (nextX > 3) {
      this.setState({ message: "You can't go right" });
    }
    if (nextY < 1) {
      this.setState({ message: "You can't go up" });
    }
    if (nextY > 3) {
      this.setState({ message: "You can't go down" });
    }
  };

  movingB = (index) => {
    let rowPosition;
    let colPosition;
    const newTarget = this.state.target;

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
      newTarget.x === Object.values(results)[0] &&
      newTarget.y === Object.values(results)[1]
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.x !== prevState.x || this.state.y !== prevState.y) {
      this.setState({
        target: { x: this.state.x, y: this.state.y },
        message: "",
      });
    }
  }

  stepCounter = () => {
    this.setState((prev) => ({
      steps: prev.steps + 1,
    }));
  };

  render() {
    const { className } = this.props;
    const { steps, x, y, email, message } = this.state;
    return (
      <div id="wrapper" className={className}>
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
            <div
              key={idx}
              className={`square${this.movingB(idx) ? " active" : ""}`}
            >
              {this.movingB(idx) ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move("left")}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move("up")}>
            UP
          </button>
          <button id="right" onClick={() => this.move("right")}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move("down")}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
