export const testdata = {

  email: "testing@mailinator.com",
  password: "Test@123",

  invalidEmailFormat: "notanemail",
  wrongEmail: "doesnotexist@mailinator.com",
  wrongPassword: "WrongPass@999",

  // Dashboard test data
  newProjectName: "AutoTest_Project_001",
  newWorkspaceName: "AutoTest_Workspace_001",

  // Inbox test data
  inboxSearchKeyword: "ticket",
  inboxInvalidSearch: "zzz_invalid_gibberish_xyz_999",
  inboxReplyText: "This is an automated test reply.",
  inboxLongString: "a".repeat(200),
  inboxSQLInjection: "' OR '1'='1",
  inboxXSSPayload: "<script>alert(1)</script>",
  inboxUnicodeSearch: "テスト検索",
  inboxSpecialChars: "!@#$%^&*()",

  // Boards test data
  boardName: "Bug",
  secondBoardName: "FeatureRequests",
  boardsTicketIdPrefix: "TESAFD_",

  // Contacts test data
  contactSearchKeyword: "Aaura",
  contactInvalidSearch: "zzz_invalid_contact_xyz_999",

};