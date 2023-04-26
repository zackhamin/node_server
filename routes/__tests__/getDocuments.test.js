const request = require("supertest");
const app = require("../../app");

describe("GET /documents", () => {
  it("should return a list of document titles", async () => {
    const response = await request(app).get("/document");
    expect(response.status).toBe(200);
    console.log(response.body);
  });
});
