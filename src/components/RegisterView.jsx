import { useState } from "react";

const RegisterView = ({ changeView  }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "CC",
    documento: "",
    telefono: "",
    sector: "educativo",
    ubicacion: "upb",
    area: "limpieza",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("Datos de registro:", formData);
    alert("Registro exitoso!");
    if (changeView ) {
      changeView ("login");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>UPB</div>
        <h1 style={styles.headerTitle}>Registro</h1>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={submitForm} style={styles.formContainer}>
          {/* Nombre y Apellido */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nombre completo</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Jessica"
                style={styles.formInput}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Apellido</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                placeholder="Alvarez"
                style={styles.formInput}
                required
              />
            </div>
          </div>

          {/* Documento de identidad */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Documento de identidad</label>
            <div style={styles.inputGroup}>
              <select
                value={formData.tipoDocumento}
                onChange={(e) =>
                  handleInputChange("tipoDocumento", e.target.value)
                }
                style={styles.formSelectSmall}
              >
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="CE">CE</option>
              </select>
              <input
                type="text"
                value={formData.documento}
                onChange={(e) => handleInputChange("documento", e.target.value)}
                placeholder="1011515455"
                style={styles.formInputFlex}
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Phone number</label>
            <div style={styles.inputGroup}>
              <select style={styles.formSelectSmall}>
                <option value="+57">🇨🇴 +57</option>
              </select>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="Phone number"
                style={styles.formInputFlex}
                required
              />
            </div>
          </div>

          {/* Sector */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Sector</label>
            <select
              value={formData.sector}
              onChange={(e) => handleInputChange("sector", e.target.value)}
              style={styles.formSelect}
            >
              <option value="educativo">🎓 Educativo</option>
              <option value="corporativo">🏢 Corporativo</option>
              <option value="salud">🏥 Salud</option>
            </select>
          </div>

          {/* Ubicación */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Ubicación</label>
            <select
              value={formData.ubicacion}
              onChange={(e) => handleInputChange("ubicacion", e.target.value)}
              style={styles.formSelect}
            >
              <option value="upb">📍 Universidad Pontificia Bolivariana</option>
            </select>
          </div>

          {/* Área */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Área</label>
            <select
              value={formData.area}
              onChange={(e) => handleInputChange("area", e.target.value)}
              style={styles.formSelect}
            >
              <option value="limpieza">🧹 Limpieza</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="seguridad">🛡️ Seguridad</option>
            </select>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            style={styles.submitBtn}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                styles.submitBtnHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor =
                styles.submitBtn.backgroundColor)
            }
          >
            Registrar &gt;
          </button>
        </form>

        {/* Link a login */}
        <div style={styles.loginLink}>
          <span>¿Ya tienes cuenta?</span>
          <button
            type="button"
            onClick={() => changeView("login")}
            style={styles.linkButton}
            onMouseEnter={(e) =>
              (e.target.style.color = styles.linkButtonHover.color)
            }
            onMouseLeave={(e) =>
              (e.target.style.color = styles.linkButton.color)
            }
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  header: {
    textAlign: "center",
    padding: "30px 20px 20px",
    borderBottom: "1px solid #e9ecef",
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
  headerTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    margin: "0",
  },
  formContainer: {
    padding: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "6px",
  },
  formInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputGroup: {
    display: "flex",
    gap: "8px",
  },
  formSelectSmall: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    minWidth: "70px",
  },
  formInputFlex: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
  },
  formSelect: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
    backgroundPosition: "right 12px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "16px",
    paddingRight: "40px",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginBottom: "16px",
  },
  submitBtnHover: {
    backgroundColor: "#0056b3",
  },
  loginLink: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
  linkButtonHover: {
    color: "#0056b3",
  },
};

export default RegisterView;
