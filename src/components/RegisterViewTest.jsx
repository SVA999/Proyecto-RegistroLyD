import { useState, useEffect } from "react";
// No se necesita importar App.css aquí, ya se usa en la aplicación principal.

// Componente para el mensaje emergente, adaptado para usar CSS estándar
const MessageBox = ({ message, type, show, onClose }) => {
  const bgColorClass = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className={`message-box-overlay ${show ? 'message-box-show' : ''}`}>
      <div className={`message-box ${bgColorClass}`}>
        <span className="message-box-icon">{icon}</span>
        <p className="message-box-text">{message}</p>
        <button onClick={onClose} className="message-box-close-btn">
          &times;
        </button>
      </div>
    </div>
  );
};

const RegisterView = ({ changeView }) => {
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Hook para manejar la transición automática
  useEffect(() => {
    let timer;
    if (showSuccessMessage) {
      // Establece un temporizador para cambiar de vista después de 3 segundos
      timer = setTimeout(() => {
        if (changeView) {
          changeView("login");
        }
      }, 3000); // Duración en milisegundos
    }
    // Limpieza: si el componente se desmonta o el mensaje se oculta, cancela el temporizador
    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessMessage, changeView]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("Datos de registro:", formData);
    setShowSuccessMessage(true);
  };

  const handleCloseMessage = () => {
    // Al cerrar manualmente, también se activa el cambio de vista
    setShowSuccessMessage(false);
  };

  return (
    <div className="main-container">
      <div className="card">
        <div className="header-container">
          <div className="header-logo">UPB</div>
          <h1 className="header-title">Registro</h1>
        </div>

        <form onSubmit={submitForm}>
          {/* Nombre y Apellido */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                className="form-input-field"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Jessica"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                className="form-input-field"
                type="text"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                placeholder="Alvarez"
                required
              />
            </div>
          </div>

          {/* Documento de identidad */}
          <div className="form-group">
            <label className="form-label">Documento de identidad</label>
            <div className="input-group">
              <select
                className="form-select-small"
                value={formData.tipoDocumento}
                onChange={(e) =>
                  handleInputChange("tipoDocumento", e.target.value)
                }
              >
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="CE">CE</option>
              </select>
              <input
                className="form-input-field"
                type="text"
                value={formData.documento}
                onChange={(e) => handleInputChange("documento", e.target.value)}
                placeholder="1011515455"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <div className="input-group">
              <select className="form-select-small">
                <option value="+57">🇨🇴 +57</option>
              </select>
              <input
                className="form-input-field"
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="Número de teléfono"
                required
              />
            </div>
          </div>

          {/* Sector */}
          <div className="form-group">
            <label className="form-label">Sector</label>
            <select
              className="form-select"
              value={formData.sector}
              onChange={(e) => handleInputChange("sector", e.target.value)}
            >
              <option value="educativo">🎓 Educativo</option>
              <option value="corporativo">🏢 Corporativo</option>
              <option value="salud">🏥 Salud</option>
              <option value="publico">🏛️ Público</option>
              <option value="privado">💼 Privado</option>
              <option value="otro">❓ Otro</option>
            </select>
          </div>

          {/* Ubicación */}
          <div className="form-group">
            <label className="form-label">Ubicación</label>
            <select
              className="form-select"
              value={formData.ubicacion}
              onChange={(e) => handleInputChange("ubicacion", e.target.value)}
            >
              <option value="upb">📍 Universidad Pontificia Bolivariana</option>
              <option value="otra">🗺️ Otra</option>
            </select>
          </div>

          {/* Área */}
          <div className="form-group">
            <label className="form-label">Área</label>
            <select
              className="form-select"
              value={formData.area}
              onChange={(e) => handleInputChange("area", e.target.value)}
            >
              <option value="limpieza">🧹 Limpieza</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="seguridad">🛡️ Seguridad</option>
              <option value="administrativa">📊 Administrativa</option>
              <option value="tecnologica">💻 Tecnológica</option>
              <option value="otra">❓ Otra</option>
            </select>
          </div>

          {/* Botón submit */}
          <button type="submit" className="btn">
            Registrar &gt;
          </button>
        </form>

        {/* Link a login */}
        <div className="login-link">
          <span>¿Ya tienes cuenta?</span>
          <button
            type="button"
            onClick={() => changeView("login")}
            className="link-button"
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      <MessageBox
        message="¡Registro exitoso!"
        type="success"
        show={showSuccessMessage}
        onClose={handleCloseMessage}
      />
    </div>
  );
};

export default RegisterView;
