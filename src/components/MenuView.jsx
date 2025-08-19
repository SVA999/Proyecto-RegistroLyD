import { useState } from "react";

const MenuView = ({ changeView  }) => {
  const handleNavigation = (view) => {
    if (changeView ) {
      changeView (view);
    }
  };

  return (
    <div style={styles.menuContainer}>
      <div style={styles.menuCard}>
        <div style={styles.logoContainer}>
          <img
            src="/ays_logo.png"
            alt="A&S Logo"
            style={styles.logoAs}
          />
          <img
            src="/Logo-UPB1.png  "
            alt="UPB Logo"
            style={styles.logoUpb}
          />
        </div>
        <h1 style={styles.menuTitle}>Menu</h1>

        <div style={styles.menuButtons}>
          <button 
            style={styles.menuBtn} 
            onClick={() => handleNavigation('form')}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.menuBtnHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.menuBtn.backgroundColor}
          >
            <div style={styles.buttonContent}>
              <span style={styles.icon}>✔️</span>
              Registrar limpieza
            </div>
            <span style={styles.arrow}>&gt;</span>
          </button>

          <button
            style={styles.menuBtn}
            onClick={() => handleNavigation('historial')}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.menuBtnHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.menuBtn.backgroundColor}
          >
            📄 Ver historial
          </button>

          <button
            style={styles.menuBtn}
            onClick={() => handleNavigation('login')}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.menuBtnHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.menuBtn.backgroundColor}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f7',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  menuCard: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    boxSizing: 'border-box',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  logoAs: {
    width: '70px',
    height: 'auto',
  },
  logoUpb: {
    width: '70px',
    height: 'auto',
  },
  menuTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '30px',
    margin: '0 0 30px 0',
    textAlign: 'left',
  },
  menuButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  menuBtn: {
    width: '100%',
    padding: '16px 24px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBtnHover: {
    backgroundColor: '#0056b3',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '18px',
    marginRight: '12px',
  },
  arrow: {
    fontWeight: 'bold',
  },
};

export default MenuView;