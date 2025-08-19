import { useState } from "react";

const LoginView = ({ changeView }) => {
  const [formData, setFormData] = useState({
    docType: "CC",
    docNumber: "",
    password: "",
  });

  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí se manejaría la lógica de autenticación real
    // Por ahora, simulamos un inicio de sesión exitoso
    setLoginSuccess(true);

    // Opcional: cambiar la vista después de un tiempo
    setTimeout(() => {
      if (changeView) {
        changeView("menu");
      }
    }, 1500);
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.logo}>UPB</div>
          <h1 style={styles.title}>Inicio de sesión</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Documento de identidad</label>
            <div style={styles.inputGroup}>
              <select
                value={formData.docType}
                onChange={(e) => handleInputChange("docType", e.target.value)}
                style={styles.inputSelect}
              >
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="CE">CE</option>
              </select>
              <input
                type="text"
                value={formData.docNumber}
                onChange={(e) => handleInputChange("docNumber", e.target.value)}
                placeholder="1011515455"
                style={styles.inputField}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="••••••••••••"
              style={{ ...styles.inputField, ...styles.passwordField }}
              required
            />
            {loginSuccess && (
              <div style={styles.successMessage}>
                <span style={styles.successIcon}>✓</span> ¡Bienvenid@!!
              </div>
            )}
          </div>

          <button type="submit" style={styles.submitBtn}>
            Iniciar
            <span style={styles.arrowIcon}>&gt;</span>
          </button>
        </form>

        <div style={{ ...styles.formGroup, ...styles.readonlyField }}>
          <label style={styles.formLabel}>Sector</label>
          <div style={styles.inputReadonly}>
            <span style={styles.icon}>🎓</span>
            <input
              type="text"
              value="Educativo"
              readOnly
              style={{ ...styles.inputField, ...styles.readonlyInputField }}
            />
          </div>
        </div>

        <div style={{ ...styles.formGroup, ...styles.readonlyField }}>
          <label style={styles.formLabel}>Locacion</label>
          <div style={styles.inputReadonly}>
            <span style={styles.icon}>📍</span>
            <input
              type="text"
              value="Universidad Pontificia Bolivariana"
              readOnly
              style={{ ...styles.inputField, ...styles.readonlyInputField }}
            />
          </div>
        </div>

        <div style={{ ...styles.formGroup, ...styles.readonlyField }}>
          <label style={styles.formLabel}>Area</label>
          <div style={styles.inputReadonly}>
            <span style={styles.icon}>🛡️</span>
            <input
              type="text"
              value="Limpieza"
              readOnly
              style={{ ...styles.inputField, ...styles.readonlyInputField }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f7",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  loginCard: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "50px",
    height: "50px",
    background: "#28a745",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
    margin: "0 auto 15px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333333",
    margin: "0",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#555555",
    marginBottom: "8px",
  },
  inputGroup: {
    display: "flex",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  inputSelect: {
    padding: "12px 10px",
    border: "none",
    backgroundColor: "#e9ecef",
    color: "#555555",
    fontWeight: "600",
    borderRight: "1px solid #e0e0e0",
    cursor: "pointer",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    backgroundSize: "16px",
    paddingRight: "25px",
  },
  inputField: {
    flexGrow: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "#f9f9f9",
    fontSize: "16px",
    color: "#333333",
    outline: "none",
  },
  passwordField: {
    width: "100%",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxSizing: "border-box",
  },
  successMessage: {
    color: "#28a745",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
  },
  successIcon: {
    fontSize: "18px",
    marginRight: "5px",
    color: "#28a745",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    marginLeft: "8px",
  },
  readonlyField: {
    marginTop: "25px",
  },
  inputReadonly: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  icon: {
    fontSize: "18px",
    color: "#888888",
    marginRight: "10px",
  },
  readonlyInputField: {
    backgroundColor: "transparent",
    padding: "0",
    border: "none",
    color: "#555555",
    fontSize: "16px",
  },
};

export default LoginView;
