// Write your tests here
import AppFunctional from "./AppFunctional"
import { render } from "@testing-library/react"
import React from "react"
test('sanity', () => {
  render(<AppFunctional />)
})
