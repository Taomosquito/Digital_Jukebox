import { jsx as _jsx } from "react/jsx-runtime";
import { mount } from "cypress/react";
import SideNavigationBar from "../../Front-end/src/components/SideNavigationBar";
describe("NavigationBar.cy.tsx", () => {
    it("Button Exists", () => {
        mount(_jsx(SideNavigationBar, {}));
        cy.get('[data-testid="nav-button"]').should("exist");
        cy.get('[data-testid="nav-button"]').should("exist").click({ force: true });
    });
});
