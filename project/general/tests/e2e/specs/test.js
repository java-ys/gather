// https://docs.cypress.io/api/introduction/api.html

describe("Test login and redirect to home", () => {
  it("should pass and redirect and home page should contain name", () => {
    const username = "sysadmin";
    const password = "T3sysadmin";

    // visit login
    cy.visit("http://localhost:8088/#/login");

    // type in username
    cy.get("input[type=text]").type(username);

    // type in password and {enter} to submit
    cy.get("#app > div > div.login-con > div > div > div.form-con > form > div:nth-child(2) > div > div > input").type(`${password}{enter}`);

    // should be redirected to /home
    cy.url().should("include", "/home");

    // our auth cookie should be present
    cy.getCookie("new_operation_token").should("exist");

    // UI should reflect this user being logged in
    cy.get("div.ivu-select-dropdown > ul > div > li").should("contain", "姓名");
  });
});
