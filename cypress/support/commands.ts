/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare namespace Cypress {
  interface Chainable {
    signIn(): Chainable<void>;
    signOut(): Chainable<void>;
  }

}

Cypress.Commands.add(`signOut`, () => {
  cy.log(`sign out by clearing all cookies.`);
  cy.clearCookies();
});

Cypress.Commands.add(`signIn`, () => {
  cy.log(`Signing in.`);
  cy.visit(`http://localhost:3000/sign-in`, {failOnStatusCode: false});
 
  cy.window()
    .should((window) => {
      console.log(window);
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect((window as any).Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      cy.clearCookies();
      console.log(Cypress.env(`test_email`), Cypress.env(`test_password`));
      const res = await (window as any).Clerk.client.signIn.create({
        identifier: Cypress.env(`test_email`),
        password: Cypress.env(`test_password`),
      });
 
      await (window as any).Clerk.setActive({
        session: res.createdSessionId,
      });
 
      cy.log(`Finished Signing in.`);
    });
});