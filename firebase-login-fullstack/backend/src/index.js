const admin = require("firebase-admin");
const path = require("path");
const express = require("express");
const cors = require("cors");

// 1. Inicialización de Firebase
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("¡Firebase inicializado correctamente!");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Servidor de Firebase funcionando correctamente!");
});

// RUTA PARA REGISTRAR USUARIOS
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      uid: userRecord.uid
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(400).json({ 
      mensaje: "No se pudo crear el usuario", 
      error: error.message 
    });
  }
});

// RUTA PARA LISTAR USUARIOS
app.get("/api/usuarios", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const usuarios = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email
    }));
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: error.message });
  }
});


// 4. Encender servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor de Firebase corriendo en http://localhost:${PORT}`);
});
