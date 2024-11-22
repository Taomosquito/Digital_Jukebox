import React from "react";
import { mount } from "cypress/react";
import SideNavigationBar from "../../Front-end/src/components/SideNavigationBar";

describe("NavigationBar.cy.tsx", () => {
  it("Button Exists", () => {
    mount(<SideNavigationBar />);
    cy.get('[data-testid="nav-button"]').should("exist");
    cy.get('[data-testid="nav-button"]').should("exist").click({ force: true });
  });
});
