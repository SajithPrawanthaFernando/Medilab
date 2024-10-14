// tests/test-utils.js
import React from "react";
import { render } from "@testing-library/react";
import Modal from "react-modal";

// Set the app element for react-modal
Modal.setAppElement("#root");

// Custom render function
const customRender = (ui, options) => {
  // Create root element for testing
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.appendChild(root);

  // Render the provided UI
  const rendered = render(ui, { container: root, ...options });

  // Cleanup after each test
  afterEach(() => {
    document.body.removeChild(root);
  });

  return rendered;
};

export * from "@testing-library/react";
export { customRender as render };
