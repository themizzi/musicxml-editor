Feature: Application smoke coverage

  Scenario: Built page renders for a user
    When I open the app
    Then the page should successfully load
