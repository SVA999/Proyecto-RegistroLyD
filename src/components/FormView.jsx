import { useState, useMemo } from "react";

const FormView = ({ changeView  }) => {
  const [formData, setFormData] = useState({
    tipoLimpieza: 'general',
    reposicion: { papel: true, toalla: false, jabon: true },
    bloque: '',
    tipoLugar: '',
    lugar: '',
    observaciones: '',
  });

  const ubicaciones = {
    A: {
      nombre: 'Bloque A',
      tiposLugar: {
        aulas: { nombre: 'Aulas', lugares: ['101', '102', '103'] },
        banos: { nombre: 'Baños', lugares: ['Baño 1', 'Baño 2'] },
      },
    },
    B: {
      nombre: 'Bloque B',
      tiposLugar: {
        oficinas: { nombre: 'Oficinas', lugares: ['Admin', 'Coordinación'] },
      },
    },
  };

  const isFormValid = useMemo(() => {
    return formData.tipoLimpieza;
  }, [formData.tipoLimpieza]);

  const formattedDate = new Date().toLocaleDateString('es-ES');
  const formattedTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReposicionChange = (item) => {
    setFormData(prev => ({
      ...prev,
      reposicion: {
        ...prev.reposicion,
        [item]: !prev.reposicion[item]
      }
    }));
  };

  const handleBloqueChange = (value) => {
    setFormData(prev => ({
      ...prev,
      bloque: value,
      tipoLugar: '',
      lugar: ''
    }));
  };

  const handleTipoLugarChange = (value) => {
    setFormData(prev => ({
      ...prev,
      tipoLugar: value,
      lugar: ''
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    alert('Formulario enviado con éxito');
    if (changeView ) {
      changeView ('menu');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>UPB</div>
        <div style={styles.headerText}>
          <h1 style={styles.headerTitle}>Registrar limpieza</h1>
          <p style={styles.headerSubtitle}>{formattedDate} - {formattedTime}</p>
        </div>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={submitForm}>
          {/* Tipo de aseo */}
          <div style={styles.formGroup}>
            <div style={styles.sectionTitle}>
              <span>⚫</span> Tipo de aseo
            </div>
            <div style={styles.radioGroup}>
              {['general', 'profundo', 'desinfeccion'].map(tipo => (
                <div key={tipo} style={styles.radioOption}>
                  <input
                    type="radio"
                    id={tipo}
                    name="tipoLimpieza"
                    value={tipo}
                    checked={formData.tipoLimpieza === tipo}
                    onChange={(e) => handleInputChange('tipoLimpieza', e.target.value)}
                    style={styles.radioInput}
                  />
                  <label htmlFor={tipo} style={styles.radioLabel}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reposición de elementos */}
          <div style={styles.formGroup}>
            <div style={styles.sectionTitle}>Reposición de elementos</div>
            <div style={styles.checkboxGroup}>
              {['papel', 'toalla', 'jabon'].map(item => (
                <div key={item} style={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    id={item}
                    checked={formData.reposicion[item]}
                    onChange={() => handleReposicionChange(item)}
                    style={styles.checkboxInput}
                  />
                  <label htmlFor={item} style={styles.checkboxLabel}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Bloque</label>
            <div style={styles.selectContainer}>
              <select
                value={formData.bloque}
                onChange={(e) => handleBloqueChange(e.target.value)}
                style={styles.formSelect}
              >
                <option value="">Bloque 9 - Edificio de Posgrados UPB</option>
                {Object.entries(ubicaciones).map(([key, bloque]) => (
                  <option key={key} value={key}>
                    {bloque.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tipo lugar */}
          {formData.bloque && (
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tipo lugar</label>
              <div style={styles.selectContainer}>
                <select
                  value={formData.tipoLugar}
                  onChange={(e) => handleTipoLugarChange(e.target.value)}
                  style={styles.formSelect}
                >
                  <option value="">Baño</option>
                  {Object.entries(ubicaciones[formData.bloque].tiposLugar).map(([key, tipo]) => (
                    <option key={key} value={key}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Lugar */}
          {formData.bloque && formData.tipoLugar && (
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Lugar</label>
              <div style={styles.selectContainer}>
                <select
                  value={formData.lugar}
                  onChange={(e) => handleInputChange('lugar', e.target.value)}
                  style={styles.formSelect}
                >
                  <option value="">Piso 2 - Caballeros</option>
                  {ubicaciones[formData.bloque].tiposLugar[formData.tipoLugar].lugares.map((lugar, index) => (
                    <option key={index} value={lugar}>
                      {lugar}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>⚫ Observaciones</label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              style={styles.formTextarea}
              placeholder="Por aquí tus observaciones en esta limpieza..."
            />
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              ...styles.submitBtn,
              ...(isFormValid ? {} : styles.submitBtnDisabled)
            }}
          >
            ✓ Registrar limpieza &gt;
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid #e9ecef',
  },
  logo: {
    width: '40px',
    height: '40px',
    background: '#28a745',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '2px',
    margin: '0 0 2px 0',
  },
  headerSubtitle: {
    fontSize: '12px',
    color: '#666',
    margin: '0',
  },
  formContainer: {
    padding: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px',
  },
  radioGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  radioInput: {
    margin: '0',
  },
  radioLabel: {
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  checkboxGroup: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  checkboxOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkboxInput: {
    margin: '0',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  selectContainer: {
    position: 'relative',
    marginBottom: '12px',
  },
  formSelect: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    appearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px',
  },
  formTextarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  submitBtnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};

export default FormView;