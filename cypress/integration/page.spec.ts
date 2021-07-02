describe('holidays e2e test', () => {
  it('should do a sanity check', () => {
    cy.visit('');
  });

  it('should do an implicit subject assertion', () => {
    cy.visit('');
    cy.get('h1').should('have.text', 'My Angular App :-)');
  });

  it('should do an explicit subject assertion', () => {
    cy.visit('');
    cy.get('form input[name="from"]').type('Graz');
    cy.get('form input[name="to"]').type('Hamburg');
    cy.get('form .btn').should(($button) => {
      expect($button).to.not.have.attr('disabled', 'disabled');
    });
  });

  it('should do a form submit and count length of flight cards', () => {
    cy.visit('');
    cy.get('form input[name="from"]').type('Graz');
    cy.get('form input[name="to"]').type('Hamburg');
    cy.get('form .btn').click();

    cy.get('flight-card').should('have.length', 11);
  });
});
