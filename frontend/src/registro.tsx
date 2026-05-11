import { useState } from "react";

// Tipos para el formulario
interface FormData {
  documento: string;
  nombreCompleto: string;
  telefono: string;
  contactoEmergencia: string;
  correo: string;
  programa: string;
  contrasena: string;
}

const programas = [
  "ADSO",
  "Contabilidad",
  "Diseño Gráfico",
  "Electrónica",
  "Mecatrónica",
  "Redes y Seguridad",
  "Salud Pública",
  "Turismo",
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
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      // Ajusta la URL a la de tu backend
      const response = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el usuario. Intente de nuevo.");
      }

      // Redirigir o mostrar éxito según tu lógica
      alert("¡Usuario registrado exitosamente!");
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
      {/* ── Barra superior ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* Logo SENA en texto (reemplaza con <img> si tienes el asset) */}
          <div style={styles.logoBox}>
            <span style={styles.logoText}>SENA</span>
          </div>
          <div>
            <div style={styles.headerTitle}>Registro de Usuario</div>
            <div style={styles.headerSubtitle}>Sistema de Conexión Exitosa</div>
          </div>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <main style={styles.main}>
        {/* Panel izquierdo */}
        <aside style={styles.aside}>
          <div style={styles.asideLogoWrap}>
            <div style={styles.asideLogo}>
              <span style={styles.asideLogoText}>SENA</span>
            </div>
          </div>
          <h2 style={styles.asideHeading}>
            Formando talento{" "}
            <span style={styles.asideGreen}>para el futuro</span>
          </h2>
          <p style={styles.asideBody}>
            En el SENA conectamos el talento de los colombianos con las
            oportunidades para transformar vidas y construir país.
          </p>
          <div style={styles.asideDivider} />
        </aside>

        {/* Tarjeta del formulario */}
        <section style={styles.card}>
          {/* Encabezado tarjeta */}
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <div>
              <h1 style={styles.cardTitle}>Registro de Usuario</h1>
              <p style={styles.cardSubtitle}>
                Complete todos los campos para registrarse en el sistema.
              </p>
            </div>
          </div>

          <div style={styles.dividerLine} />

          {/* Mensaje de error */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⊘</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Sección: Información personal ── */}
          <SectionTitle icon="" label="Información personal" />

          <div style={styles.row2}>
            <Field label="Documento de Identidad">
              <input
                style={styles.input}
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="Ej: 2284735264"
              />
            </Field>
            <Field label="Nombre Completo">
              <input
                style={styles.input}
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                placeholder="Nombre Completo"
              />
            </Field>
          </div>

          {/* ── Sección: Contacto ── */}
          <SectionTitle icon="" label="Contacto" />

          <div style={styles.row3}>
            <Field label="Número de Teléfono">
              <input
                style={styles.input}
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 3214567890"
              />
            </Field>
            <Field label="Contacto de Emergencia">
              <input
                style={styles.input}
                name="contactoEmergencia"
                value={formData.contactoEmergencia}
                onChange={handleChange}
                placeholder="3213846303"
              />
            </Field>
            <Field label="Correo Electrónico">
              <input
                style={styles.input}
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="correo@gmail.com"
              />
            </Field>
          </div>

          {/* ── Sección: Formación ── */}
          <SectionTitle icon="" label="Formación" />

          <Field label="Programa de Formación">
            <select
              style={{ ...styles.input, ...styles.select }}
              name="programa"
              value={formData.programa}
              onChange={handleChange}
            >
              <option value="">Seleccione un programa</option>
              {programas.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          {/* ── Sección: Seguridad ── */}
          <SectionTitle icon="" label="Seguridad" />

          <Field label="Contraseña">
            <div style={styles.passwordWrap}>
              <input
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
                {mostrarContrasena ? "👁" : "👁"}
              </button>
            </div>
          </Field>

          {/* Botón registrar */}
          <button
            style={styles.submitBtn}
            onClick={handleSubmit}
            disabled={cargando}
          >
            {cargando ? "Registrando..." : "Registrarse"}
          </button>

          {/* Pie de tarjeta */}
          <div style={styles.serverBadge}>
            <span style={styles.serverCheck}>✔</span>
            <span>
              Servidor:{" "}
              <span style={styles.serverGreen}>Conexión Exitosa</span>
            </span>
            <span style={styles.serverFront}>front-end</span>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        © 2024 SENA - Servicio Nacional de Aprendizaje &nbsp;|&nbsp; Conexión
        Exitosa
      </footer>
    </div>
  );
}

/* ── Componentes auxiliares ── */

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={styles.sectionTitle}>
      <span>{icon}</span>
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

const GREEN = "#2e7d32";
const GREEN_LIGHT = "#f1f8e9";
const BORDER = "#e0e0e0";
const TEXT_GRAY = "#555";

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  /* Header */
  header: {
    backgroundColor: GREEN,
    padding: "12px 32px",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "white",
    fontWeight: 700,
    fontSize: 13,
  },
  headerTitle: {
    color: "white",
    fontWeight: 700,
    fontSize: 18,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },

  /* Main layout */
  main: {
    flex: 1,
    display: "flex",
    gap: 0,
    padding: "40px 32px",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },

  /* Aside */
  aside: {
    width: 300,
    minWidth: 260,
    paddingRight: 40,
    flexShrink: 0,
  },
  asideLogoWrap: { marginBottom: 20 },
  asideLogo: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  asideLogoText: { color: "white", fontWeight: 800, fontSize: 18 },
  asideHeading: {
    fontSize: 26,
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.3,
    marginBottom: 12,
  },
  asideGreen: { color: GREEN },
  asideBody: { color: TEXT_GRAY, fontSize: 14, lineHeight: 1.6 },
  asideDivider: {
    marginTop: 20,
    width: 40,
    height: 3,
    backgroundColor: GREEN,
    borderRadius: 4,
  },

  /* Card */
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: "32px 36px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    backgroundColor: GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: 0,
  },
  cardSubtitle: { color: TEXT_GRAY, fontSize: 14, margin: "4px 0 0" },
  dividerLine: {
    height: 1,
    backgroundColor: BORDER,
    margin: "16px 0",
  },

  /* Error */
  errorBox: {
    backgroundColor: "#fde8e8",
    border: "1px solid #f5c6c6",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#c0392b",
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  errorIcon: { fontSize: 18 },

  /* Section title */
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: GREEN,
    fontWeight: 600,
    fontSize: 15,
    margin: "24px 0 12px",
  },
  sectionLabel: { color: GREEN },

  /* Rows */
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  row3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
  },

  /* Field */
  fieldWrap: { marginBottom: 0 },
  label: {
    display: "block",
    fontSize: 13,
    color: TEXT_GRAY,
    marginBottom: 6,
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    fontSize: 14,
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    backgroundColor: "white",
  },
  select: {
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23555' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
    cursor: "pointer",
  },

  /* Password */
  passwordWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
    padding: 0,
    color: TEXT_GRAY,
  },

  /* Submit */
  submitBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: GREEN,
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 28,
    transition: "background 0.2s",
  },

  /* Server badge */
  serverBadge: {
    marginTop: 16,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 8,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: TEXT_GRAY,
  },
  serverCheck: { color: GREEN, fontSize: 16 },
  serverGreen: { color: GREEN, fontWeight: 600 },
  serverFront: { color: TEXT_GRAY },

  /* Footer */
  footer: {
    textAlign: "center",
    padding: "16px",
    fontSize: 13,
    color: "#888",
    borderTop: `1px solid ${BORDER}`,
    backgroundColor: "white",
  },
};