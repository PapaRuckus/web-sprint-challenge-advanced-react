// Write your tests here
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppFunctional from "./AppFunctional"; // Replace with the correct import path
import React from "react";
import "@testing-library/jest-dom/extend-expect";

test("sanity", () => {
  render(<AppFunctional />);
});

test("Check for Coordinates, Step counter, Message Box, Buttons, and Email", () => {
  render(<AppFunctional />);

  const coordinates = screen.getByText(/coordinates/i);
  const stepCounter = screen.getByText(/you moved 0 times/i);
  const messageBox = screen.getByTestId("message");
  const leftButton = screen.getByText(/left/i);
  const upButton = screen.getByText(/up/i);
  const rightButton = screen.getByText(/right/i);
  const downButton = screen.getByText(/down/i);
  const resetButton = screen.getByText(/reset/i);
  const emailInput = screen.getByPlaceholderText("type email");

  expect(coordinates).toBeInTheDocument();
  expect(stepCounter).toBeInTheDocument();
  expect(messageBox).toBeInTheDocument();
  expect(leftButton).toBeInTheDocument();
  expect(upButton).toBeInTheDocument();
  expect(rightButton).toBeInTheDocument();
  expect(downButton).toBeInTheDocument();
  expect(resetButton).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
});

test("Check if typing in the email input changes its value", async () => {
  render(<AppFunctional />);

  const emailInput = screen.getByTestId("email");

  userEvent.type(emailInput, "test@email.com");

  await waitFor(() => {
    expect(emailInput).toHaveValue("test@email.com");
  });
});

test("Check for email is required error", async () => {
  render(<AppFunctional />);
  const submitButton = screen.getByTestId("submit");

  userEvent.click(submitButton);

  await waitFor(() => {
    const errorMessage = screen.getByText(/ouch: email is required/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

test("Check if the reset button clears the email input and message box", async () => {
  render(<AppFunctional />);
  const emailInput = screen.getByTestId("email");
  const messageBox = screen.getByTestId("message");
  const resetButton = screen.getByText(/reset/i);

  userEvent.type(emailInput, "test@email.com");

  userEvent.click(resetButton);

  await waitFor(() => {
    expect(emailInput).toHaveValue("");
  });

  await waitFor(() => {
    expect(messageBox).toHaveTextContent("");
  });
});


// test("Check if the submit button works", async () => {
//   render(<AppFunctional />);

//   const submitButton = screen.getByTestId("submit");
//   const emailInput = screen.getByTestId("email");
//   const messageBox = screen.getByTestId("message");

//   userEvent.type(emailInput, "test@email.com");

//   await waitFor(() => {
//     console.log("Email State:", emailInput.value);
//     // console.log("Message Box Content:", messageBox.textContent);
//     // userEvent.click(submitButton);
//     expect(messageBox).toHaveTextContent("test win #26");
//   });
// });
