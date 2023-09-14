import express from "express";
import fs from "fs/promises";
import cors from "cors";
import connection from "./database.js";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.get("/", (request, response) => {
  response.send("Node.js Users REST API 🎉");
});

// Get users from JSON
// async function getUsersFromJSON() {
//     const data = await fs.readFile("data.json");
//     const users = JSON.parse(data);
//     users.sort((userA, userB) => userA.name.localeCompare(userB.name));
//     return users;
// }

// READ all users with SQL statement
app.get("/users", (request, response) => {
  const query = "SELECT * FROM users;";
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      response.json(results);
    }
  });
});
// console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available

// READ all users
// app.get("/users", async (request, response) => {
//     response.json(await getUsersFromJSON());
// });

// READ one user with SQL statement
app.get("/users/:id", (request, response) => {
  const id = request.params.id;
  const query = "SELECT * FROM users WHERE UserId=?;"; //SQL Query
  const values = [id];
  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      //   få sendt ét objekt tilbage i stedet for et objekt i array
      response.json(results[0]);
    }
  });
});

// Create user with MySQL statement
app.post("/users", (request, response) => {
  const user = request.body;
  const query = "INSERT INTO users(UserId, Name, Mail, Title,Image) values(?, ?,?,?,?)";
//   Normalt skal id ikke gives med, da AUTO INCREMENT sørger for dette i MySQL, hvis dette er implementeret. Sørg for, at det er implementeret. 
    const values = [user.UserId, user.Name, user.Mail, user.Title, user.Image];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

// Update user with MySQL statement
app.put("/users/:id", (request, response) => {
    const id = request.params.id;
    const user = request.body;
    const query = "UPDATE users SET Name=?, Mail=?, Title=?, Image=? WHERE UserId=? "
    const values = [user.Name, user.Mail, user.Title, user.Image, id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.log(error)
        } else {
            response.json(results)
        }
    })
})

// DELETE user with MySQL statement
app.delete("/users/:id", (request, response) => {
  const id = request.params.id;
  const query = "DELETE FROM users WHERE UserId=? ";
  const values = [id];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});


// UPDATE user
// app.put("/users/:id", async (request, response) => {
//   const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
//   const users = await getUsersFromJSON();
//   let userToUpdate = users.find((user) => user.id === id);
//   const body = request.body;
//   userToUpdate.image = body.image;
//   userToUpdate.mail = body.mail;
//   userToUpdate.name = body.name;
//   userToUpdate.title = body.title;

//   fs.writeFile("data.json", JSON.stringify(users));
//   response.json(users);
// });

// READ one user
// app.get("/users/:id", async (request, response) => {
//     const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
//     const users = await getUsersFromJSON();
//     const user = users.find(user => user.id === id);
//     response.json(user);
// });

// CREATE user
// app.post("/users", async (request, response) => {
//     const newUser = request.body;
//     newUser.id = new Date().getTime();
//     console.log(newUser);
//     const users = await getUsersFromJSON();
//     users.push(newUser);
//     fs.writeFile("data.json", JSON.stringify(users));
//     response.json(users);
// });

// UPDATE user
// app.put("/users/:id", async (request, response) => {
//   const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
//   const users = await getUsersFromJSON();
//   let userToUpdate = users.find((user) => user.id === id);
//   const body = request.body;
//   userToUpdate.image = body.image;
//   userToUpdate.mail = body.mail;
//   userToUpdate.name = body.name;
//   userToUpdate.title = body.title;

//   fs.writeFile("data.json", JSON.stringify(users));
//   response.json(users);
// });

// DELETE user
// app.delete("/users/:id", async (request, response) => {
//   const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
//   const users = await getUsersFromJSON();
//   // const newUsers = users.filter(user => user.id !== id);
//   const index = users.findIndex((user) => user.id === id);
//   users.splice(index, 1);
//   fs.writeFile("data.json", JSON.stringify(users));
//   response.json(users);
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`App listening on http://localhost:${port}`);
  console.log(`Users Endpoint http://localhost:${port}/users`);
});
