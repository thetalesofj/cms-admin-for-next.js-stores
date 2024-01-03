describe("Signed in and creating store", () => {

  let storeId: string;
  
  beforeEach(() => {
    cy.session('signed-in', () => {
      cy.signIn();
    });
  });
 
  it("should navigate to the store modal to create new store", () => {
    const newStoreName = 'Store(2)';
    const updatedStoreName = 'Store(3)';

    // create a new store
    cy.visit("http://localhost:3000", {failOnStatusCode: false});
    cy.get('[data-cy="store-button"]').click();
    cy.get('[data-cy="create-store-button"]').click();
    cy.get('[data-cy="store-name-input"]').type(newStoreName);
    cy.get('[data-cy="continue-store-button"]').click();
    cy.url().should('include', '/')

    // extract store ID from url
    cy.url().should('include', '/').then(($url) => {
      const urlParts = $url.split('/');
      storeId = urlParts[urlParts.length - 1];
    })

    // Navigate to settings and change store name
    cy.get('a[href*="settings"]').click()
    cy.url().should('include', '/settings')
    cy.get('[data-cy="change-store-name-input"]').clear().type(updatedStoreName);
    cy.get('[data-cy="save-store-name"]').click();
    cy.url().should('include', '/')
    
    
  });

  it("should verify the store ID in the URL", () => {
    // Validate that storeId is not undefined
    expect(storeId).to.exist;
    
    // Visit the URL with the extracted store ID
    cy.session('signed-in', () => {
      cy.visit(`http://localhost:3000/${storeId}`);
    });

    // Validate that the store ID in the URL is correct
    cy.url().should('include', `/${storeId}`);
  });

 // it("should delete store", () => {
   // cy.get('a[href*="settings"]').click();
 //   cy.url().should('include', '/settings');
 //   cy.get('[data-cy="delete-store-button"]').click();
   // cy.get('[data-cy="continue-delete-store-button"]').click();
 // });

});