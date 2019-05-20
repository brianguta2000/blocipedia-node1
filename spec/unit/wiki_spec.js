const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        name: "Example User",
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Test Wiki",
          body: "This wiki is a test",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
    });
  });

  describe("#create()", () => {
    it("should create a wiki object with a title and body and associated user", (done) => {

      Wiki.create({
        title: "Create() test wiki",
        body: "This wiki will test the create() method.",
        userId: this.user.id
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Create() test wiki");
        expect(wiki.body).toBe("This wiki will test the create() method.");
        done();
      })
      .catch((err) => {
        console.log();
        done();
      });
    });

    it("should not create a wiki with missing title, body or assigned user", (done) => {
      Wiki.create({
        title:"this wiki only has a title"
      })
      .then((wiki) => {
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        expect(err.message).toContain("Wiki.userId cannot be null");
        done();
      });
    });
  });

  describe("#setUser()", () => {

    it("should associate a wiki and a user together", (done) => {

      User.create({
        name: "Ada Example",
        email: "ada@example.com",
        password: "password"
      })
      .then((newUser) => {

        expect(this.wiki.userId).toBe(this.user.id);
        this.wiki.setUser(newUser)
        .then((wiki) => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();

        });
      })
    });
  });

  describe("#getUser()", () => {
    it("should return the associated user", (done) => {

      this.wiki.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("user@example.com");
        done();
      });
    });
  });
});