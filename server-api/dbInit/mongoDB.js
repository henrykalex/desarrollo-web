db.createUser(
    {
      user: "root",
      pwd: "example",
      roles: [
         { role: "dbOwner", db: "home-productsDevelopment" }
      ]
    },
    {
        w: "majority",
        wtimeout: 5000
    }
);
db.createCollection("users");
