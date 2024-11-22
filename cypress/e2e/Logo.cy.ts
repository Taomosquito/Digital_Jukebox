describe("Logo Button", () => {
  it("Logo Button Toggles Navigation Bar", () => {
    cy.visit("localhost:5173");
    cy.get('[data-testid="user-button"]').should("not.be.visible");
    cy.get('[data-testid="nav-button"]').click();
    cy.get('[data-testid="user-button"]').should("be.visible");
  });
});
