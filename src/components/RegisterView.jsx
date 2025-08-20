import { useState } from "react";
import "../App.css";

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



export default RegisterView;
