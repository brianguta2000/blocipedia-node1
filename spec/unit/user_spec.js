const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

  beforeEach((done) => {
// #1
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("#create()", () => {

    it("should create a User object with a valid name, email and password", (done) => {

      User.create({
        name: "Example User",
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        expect(user.name).toBe("Example User")
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done()
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with invalide email, name or password", (done) => {
      User.create({
        name: null,
        email: "It's-a me, Mario!",
        password: "1234567890"
      })
      .then((user) => {
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        expect(err.message).toContain("name");
        done();
      });
    });

    it("should not create a user with an email already taken", (done) => {

      User.create({
        name: "Example User",
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        User.create({
          name: "Example User",
          email: "user@example.com",
          password: "nananananananananananananananana BATMAN!"
        })
        .then((user) => {
          //validation error will skip this
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
});