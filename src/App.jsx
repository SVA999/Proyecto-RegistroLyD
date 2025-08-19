// App.jsx
import { useState } from "react";
import RegisterView from "./components/RegisterView";
import LoginView from "./components/LoginView";
import MenuView from "./components/MenuView";
import FormView from "./components/FormView";
import HistorialView from "./components/HistorialView";
import "./App.css";

export default function App() {
  const [currentView, setCurrentView] = useState("register");
  const [user, setUser] = useState(null);
  const [historialLimpiezas, setHistorialLimpiezas] = useState([]);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().split(" ")[0].slice(0, 5),
    tipoLimpieza: "",
    reposicion: {
      papel: false,
      toalla: false,
      jabon: false,
    },
    bloque: "",
    tipoLugar: "",
    lugar: "",
    observaciones: "",
  });

  const ubicaciones = {
    "bloque-9": {
      nombre: "Bloque 9 - Edificio de Postgrado UPB",
      tiposLugar: {
        bano: {
          nombre: "Baño",
          lugares: [
            "Piso 1 - Damas",
            "Piso 1 - Caballeros",
            "Piso 2 - Damas",
            "Piso 2 - Caballeros",
            "Piso 3 - Damas",
            "Piso 3 - Caballeros",
          ],
        },
        aula: {
          nombre: "Aula",
          lugares: [
            "Aula 101",
            "Aula 102",
            "Aula 201",
            "Aula 202",
            "Aula 301",
            "Laboratorio de Cómputo",
          ],
        },
        oficina: {
          nombre: "Oficina",
          lugares: [
            "Secretaría",
            "Decanatura",
            "Coordinación",
            "Sala de Profesores",
          ],
        },
      },
    },
    "bloque-8": {
      nombre: "Bloque 8 - Biblioteca",
      tiposLugar: {
        sala: {
          nombre: "Sala",
          lugares: [
            "Sala de Lectura Piso 1",
            "Sala de Lectura Piso 2",
            "Sala de Estudio Grupal",
            "Sala de Computadores",
          ],
        },
        bano: {
          nombre: "Baño",
          lugares: [
            "Piso 1 - Damas",
            "Piso 1 - Caballeros",
            "Piso 2 - Damas",
            "Piso 2 - Caballeros",
          ],
        },
      },
    },
  };

  // Funciones
  function loginUser(usuario) {
    setUser(usuario);
    setCurrentView("menu");
  }

  function logoutUser() {
    setUser(null);
    setCurrentView("login");
  }

  function submitForm() {
    setHistorialLimpiezas((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...JSON.parse(JSON.stringify(formData)),
        usuario: user?.name,
      },
    ]);

    setFormData({
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toTimeString().split(" ")[0].slice(0, 5),
      tipoLimpieza: "",
      reposicion: { papel: false, toalla: false, jabon: false },
      bloque: "",
      tipoLugar: "",
      lugar: "",
      observaciones: "",
    });

    setCurrentView("menu");
  }

  function updateFormData(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div>
      {currentView === "register" && (
        <RegisterView changeView={setCurrentView} />
      )}

      {currentView === "login" && (
        <LoginView changeView={setCurrentView} />
      )}

      {currentView === "menu" && (
        <MenuView user={user} logout={logoutUser} changeView={setCurrentView} />
      )}

      {currentView === "form" && (
        <FormView
          ubicaciones={ubicaciones}
          formData={formData}
          submitForm={submitForm}
          updateFormData={updateFormData}
          changeView={setCurrentView}
        />
      )}

      {currentView === "historial" && (
        <HistorialView
          historial={historialLimpiezas}
          changeView={setCurrentView}
        />
      )}
    </div>
  );
}
