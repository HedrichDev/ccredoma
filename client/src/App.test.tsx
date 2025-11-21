import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders without crashing", () => {
  render(<App />);
  // You can add more specific assertions here if needed
  // For example, checking for a specific text or element
});
