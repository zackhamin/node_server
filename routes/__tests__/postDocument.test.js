const request = require("supertest");
const app = require("../../app");

// These tests create files in the route, they should be mocking
describe("POST /document/:title", () => {
  it("should create a new document file", async () => {
    const res = await request(app)
      .post("/document/test")
      .send({ content: "This is a test document." });

    expect(res.status).toBe(200);
    expect(res.text).toContain("Document saved");
  });
});

describe("POST /document/:title", () => {
  it("should error if no document content has been provided", async () => {
    const res = await request(app).post("/document/test").send({});

    expect(res.status).toBe(400);
    expect(res.text).toContain("Content is required");
  });
});
