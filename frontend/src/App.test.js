import React from "react";
import App from "./App";
import { renderWithProviders } from "./utils/testUtils";

describe('With React Testing Library', () => {
  it("renders without crashing", function () {

    renderWithProviders(<App />)
  })
});