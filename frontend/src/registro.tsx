import React, {
  useState,
} from "react";
import heroImage from "./assets/sena.registro.png";
import logoSena from "/logo.png";

// Colores SENA
const SENA_GREEN = "#39A900";
const SENA_GREEN_DARK = "#2d8500";
const SENA_GREEN_LIGHT = "#e6f4ea";
const TEXT_DARK = "#333333";
const TEXT_GRAY = "#666666";
const BORDER_COLOR = "#e0e0e0";

interface FormData {
  documento: string;
  nombreCompleto: string;
  telefono: string;
  contactoEmergencia: string;
  correo: string;
  programa: string;
  contrasena: string;
  foto: File | null;
}

const programas = [
  "Tecnología en Gestión de Recursos de Plantas de Producción ",
  "Tecnología en Desarrollo de Colecciones para la Industria de la Moda",
  "Tecnología en Levantamientos Topográficos y Georreferenciación",
  "Tecnología en Coordinación de Sistemas Integrados de Gestión",
  "Tecnología en Desarrollo de Sistemas Electrónicos Industriales",
  "Tecnología en Mantenimiento Electromecánico Industrial",
  "Tecnología en Desarrollo de Videojuegos y Entornos Interactivos",
  "Tecnología en Implementación de Redes y Servicios de Telecomunicaciones",
  "Tecnología en Desarrollo y Modelado de Productos Industriales",
  "Tecnología en Gestión de Redes de Datos",
  "Tecnología en Automatización de Sistemas Mecatrónicos ",
  "Tecnología en Gestión del Mantenimiento de Automotores",
  "Tecnología en Producción de Elementos Mecánicos con Máquinas y Herramientas CNC",
  "Tecnología en Análisis y Desarrollo de Software",
];

export default function Registro() {
  const [formData, setFormData] = useState<FormData>({
    documento: "",
    nombreCompleto: "",
    telefono: "",
    contactoEmergencia: "",
    correo: "",
    programa: "",
    contrasena: "",
    foto: null,
  });
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const file = e.target.files?.[0] || null;
      setFormData({ ...formData, foto: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFotoPreview(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    setExito(false);

    // Validación de campos vacíos (excluyendo la foto de Object.values si se maneja diferente, 
    // pero aquí la incluiremos en la lógica de 'trim' para los strings y chequeo nulo para la foto)
    const { foto, ...rest } = formData;
    const camposVacios = Object.values(rest).some((value) => value.trim() === "") || !foto;
    
    if (camposVacios) {
      setError("Registre todos los datos requeridos");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el usuario. Intente de nuevo.");
      }

      setExito(true);
      // Opcional: limpiar formulario tras éxito
      // setFormData({ documento: "", nombreCompleto: "", ... });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar el usuario. Intente de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          .input-focus:focus {
            border-color: ${SENA_GREEN} !important;
            box-shadow: 0 0 0 2px ${SENA_GREEN_LIGHT};
          }
          .btn-hover:hover {
            background-color: ${SENA_GREEN_DARK} !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(57, 169, 0, 0.2);
          }
          .btn-hover:active {
            transform: translateY(0);
          }
          .input-hover:hover {
            border-color: #bbbbbb;
          }

          /* Responsividad */
          @media (max-width: 992px) {
            .main-layout {
              flex-direction: column !important;
              gap: 0 !important;
            }
            .aside-panel {
              width: 100% !important;
              height: 350px !important;
              position: relative !important;
            }
            .aside-content {
              padding: 30px !important;
              text-align: center;
              align-items: center;
            }
            .aside-heading {
              font-size: 24px !important;
            }
            .aside-body {
              display: none; /* Ocultamos el texto largo en móvil para priorizar el formulario */
            }
            .aside-bottom-curve {
              height: 80px !important;
            }
          }

          @media (max-width: 768px) {
            .row-2, .row-3 {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            .card-container {
              padding: 24px !important;
            }
            .header-inner {
              padding: 0 10px !important;
            }
            .header-title {
              font-size: 16px !important;
            }
          }

          @media (max-width: 480px) {
            .card-header {
              flex-direction: column;
              text-align: center;
              gap: 12px !important;
            }
            .card-title {
              font-size: 20px !important;
            }
            .server-badge {
              flex-direction: column;
              text-align: center;
            }
          }
        `}
      </style>

      {/* ── Barra superior ── */}
      <header style={styles.header}>
        <div style={styles.headerInner} className="header-inner">
          <div style={styles.logoBox}>
            <img src={logoSena} alt="Logo SENA" style={styles.headerLogoImg} />
          </div>
          <div style={styles.headerSeparator} />
          <div>
            <div style={styles.headerTitle} className="header-title">Registro de Usuario</div>
            <div style={styles.headerSubtitle}>Sistema de Conexión Exitosa</div>
          </div>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <div style={styles.mainContainer}>
        <main style={styles.main} className="main-layout">
          {/* Panel izquierdo */}
          <aside style={styles.aside} className="aside-panel">
            <div style={styles.asideImageBackground}>
              <img src={heroImage} alt="SENA Background" style={styles.asideImageFull} />
              <div style={styles.asideOverlay} />
            </div>
            
            <div style={styles.asideContent} className="aside-content">
              <div style={styles.asideLogoContainer}>
                <img src={logoSena} alt="Logo SENA" style={styles.asideLogoImg} />
              </div>
              <h2 style={styles.asideHeading} className="aside-heading">
                Formando talento<br />
                <span style={styles.asideGreen}>para el futuro</span>
              </h2>
              <p style={styles.asideBody} className="aside-body">
                En el SENA conectamos el talento de los colombianos con las
                oportunidades para transformar vidas y construir país.
              </p>
            </div>
            
            <div style={styles.asideBottomCurveContainer} className="aside-bottom-curve">
              <svg 
                viewBox="0 0 500 200" 
                preserveAspectRatio="none" 
                style={styles.asideWaveSvg}
              >
                <path 
                  d="M0,100 C150,200 350,0 500,100 L500,200 L0,200 Z" 
                  fill={SENA_GREEN} 
                />
              </svg>
            </div>
          </aside>

          {/* Tarjeta del formulario */}
          <section style={styles.cardSection}>
            <div style={styles.card} className="card-container">
            <div style={styles.cardHeader} className="card-header">
              <div style={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <h1 style={styles.cardTitle} className="card-title">Registro de Usuario</h1>
                <p style={styles.cardSubtitle}>
                  Complete todos los campos para registrarse en el sistema.
                </p>
              </div>
            </div>

            <div style={styles.dividerLine} />

            {/* Mensaje de error */}
            {error && (
              <div style={styles.errorBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* ── Sección: Foto de Perfil ── */}
            <SectionTitle 
              label="Foto de Perfil" 
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              } 
            />

            <div style={styles.photoSection}>
              <label style={styles.photoUploadLabel} className="btn-hover">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={styles.photoPlaceholder}>
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Vista previa" style={styles.photoPreviewImg} />
                  ) : (
                    <div style={styles.photoPlaceholderContent}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={SENA_GREEN} strokeWidth="1.5">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span>Subir Foto</span>
                    </div>
                  )}
                </div>
              </label>
              <p style={styles.photoHint}>Haga clic para seleccionar o cambiar su foto de perfil</p>
            </div>

            {/* ── Sección: Información personal ── */}
            <SectionTitle 
              label="Información personal" 
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              } 
            />

            <div style={styles.row2} className="row-2">
              <Field label="Documento de Identidad">
                <input
                  className="input-focus input-hover"
                  style={styles.input}
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  placeholder="Ej:12345678901"
                />
              </Field>
              <Field label="Nombre Completo">
                <input
                  className="input-focus input-hover"
                  style={styles.input}
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Nombre Completo"
                />
              </Field>
            </div>

            {/* ── Sección: Contacto ── */}
            <SectionTitle 
              label="Contacto" 
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }
            />

            <div style={styles.row3} className="row-3">
              <Field label="Número de Teléfono">
                <input
                  className="input-focus input-hover"
                  style={styles.input}
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 3561342178"
                />
              </Field>
              <Field label="Contacto de Emergencia">
                <input
                  className="input-focus input-hover"
                  style={styles.input}
                  name="contactoEmergencia"
                  value={formData.contactoEmergencia}
                  onChange={handleChange}
                  placeholder="Ej: 3473558638"
                />
              </Field>
              <Field label="Correo Electrónico">
                <input
                  className="input-focus input-hover"
                  style={styles.input}
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Ejemplo@gmail.com"
                />
              </Field>
            </div>

            {/* ── Sección: Formación ── */}
            <SectionTitle 
              label="Formación" 
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              }
            />

            <Field label="Programa de Formación">
              <select
                className="input-focus input-hover"
                style={{ ...styles.input, ...styles.select }}
                name="programa"
                value={formData.programa}
                onChange={handleChange}
              >
                <option value="">Seleccione un Programa</option>
                {programas.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            {/* ── Sección: Seguridad ── */}
            <SectionTitle 
              label="Seguridad" 
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            <Field label="Contraseña">
              <div style={styles.passwordWrap}>
                <input
                  className="input-focus input-hover"
                  style={{ ...styles.input, paddingRight: 44 }}
                  name="contrasena"
                  type={mostrarContrasena ? "text" : "password"}
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                />
                <button
                  style={styles.eyeBtn}
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  aria-label="Mostrar contraseña"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </Field>

            {/* Botón registrar */}
            <button
              className="btn-hover"
              style={styles.submitBtn}
              onClick={handleSubmit}
              disabled={cargando}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginRight: 8 }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="17" y1="11" x2="23" y2="11" />
              </svg>
              {cargando ? "Registrando..." : "Registrarse"}
            </button>

            {/* Pie de tarjeta - Éxito condicional */}
            {exito && (
              <div style={styles.serverBadge} className="server-badge">
                <div style={styles.serverIconContainer}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SENA_GREEN} strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>
                  Estado: <span style={styles.serverGreen}>Registrado exitosamente</span>
                </span>
                <span style={styles.serverFront}>front-end</span>
              </div>
)}
            </div>
          </section>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        © 2026 SENA - Servicio Nacional de Aprendizaje &nbsp;|&nbsp; Conexión Exitosa
      </footer>
    </div>
  );
}

/* ── Componentes auxiliares ── */

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={styles.sectionTitle}>
      <span style={styles.sectionIcon}>{icon}</span>
      <span style={styles.sectionLabel}>{label}</span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

/* ── Estilos ── */

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  /* Header */
  header: {
    backgroundColor: SENA_GREEN,
    padding: "16px 50px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  logoBox: {
    marginRight: 16,
  },
  headerLogoImg: {
    width: 40,
    height: 40,
    objectFit: "contain",
    filter: "brightness(0) invert(1)", // Hace el logo blanco para el header verde
  },
  headerSeparator: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontWeight: 700,
    fontSize: 18,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
  },

  /* Main container */
  mainContainer: {
    flex: 1,
    width: "100%",
    maxWidth: "100%",
    margin: "0",
    boxSizing: "border-box",
  },

  /* Main layout */
  main: {
    display: "flex",
    gap: 0,
    alignItems: "stretch",
    minHeight: "calc(100vh - 72px)",
  },

  /* Aside */
  aside: {
    width: "45%",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    position: "relative",
    overflow: "hidden",
  },
  asideImageBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  asideImageFull: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center", // Centrar la imagen
  },
  asideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0) 100%)",
  },
  asideContent: {
    padding: "60px 50px",
    position: "relative",
    zIndex: 2,
  },
  asideLogoContainer: {
    marginBottom: 30,
  },
  asideLogoImg: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  asideHeading: {
    fontSize: 36,
    fontWeight: 800,
    color: "#1f2937",
    lineHeight: 1.1,
    marginBottom: 20,
    textShadow: "0 2px 4px rgba(255,255,255,0.5)",
  },
  asideGreen: {
    color: SENA_GREEN,
  },
  asideBody: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 1.5,
    maxWidth: 350,
  },
  asideBottomCurveContainer: {
    height: 100,
    width: "100%",
    position: "relative",
    zIndex: 2,
    marginTop: "auto",
  },
  asideWaveSvg: {
    width: "100%",
    height: "100%",
    display: "block",
  },

  /* Card Container (Form section) */
  cardSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#f9fafb",
  },

  /* Card */
  card: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 700,
    borderRadius: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 10,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    backgroundColor: SENA_GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  cardSubtitle: {
    color: TEXT_GRAY,
    fontSize: 14,
    margin: "4px 0 0"
  },
  dividerLine: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    margin: "8px 0",
  },

  /* Error */
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: 12,
    padding: "14px 20px",
    color: "#991b1b",
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    fontSize: 14,
    fontWeight: 500,
  },

  /* Section title */
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  sectionIcon: {
    color: SENA_GREEN,
    display: "flex",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: TEXT_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* Photo Section */
  photoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  photoUploadLabel: {
    cursor: "pointer",
    transition: "all 0.2s",
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    border: `2px dashed ${SENA_GREEN}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: SENA_GREEN_LIGHT,
  },
  photoPlaceholderContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 12,
    color: SENA_GREEN,
  },
  photoPreviewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  photoHint: {
    fontSize: 13,
    color: TEXT_GRAY,
  },

  /* Rows */
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  row3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 24,
  },

  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: TEXT_DARK,
  },
  input: {
    width: "100%",
    height: 48,
    padding: "0 16px",
    borderRadius: 12,
    border: `1px solid ${BORDER_COLOR}`,
    fontSize: 14,
    transition: "all 0.2s",
    boxSizing: "border-box",
    backgroundColor: "white",
  },
  select: {
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
    cursor: "pointer",
  },

  /* Password */
  passwordWrap: { 
    position: "relative",
    width: "100%",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    color: TEXT_GRAY,
    display: "flex",
    alignItems: "center",
  },

  /* Submit */
  submitBtn: {
    backgroundColor: SENA_GREEN,
    color: "white",
    border: "none",
    borderRadius: 12,
    height: 56,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    transition: "all 0.2s",
    width: "100%",
  },

  /* Server badge */
  serverBadge: {
    marginTop: 24,
    padding: "12px 20px",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    gap: 10,
  },
  serverIconContainer: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  serverGreen: { color: SENA_GREEN, fontWeight: 700 },
  serverFront: { color: TEXT_GRAY },

  /* Footer */
  footer: {
    textAlign: "center",
    padding: "24px",
    fontSize: 13,
    color: TEXT_GRAY,
    borderTop: `1px solid #f3f4f6`,
    backgroundColor: "white",
    marginTop: "auto",
  },
};