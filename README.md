# Frozen Space

**Frozen Space** es un proyecto web diseñado y desarrollado específicamente con el propósito de servir como plataforma para practicar **testing manual y automatizado**.

Este proyecto proporciona un entorno seguro y controlado, con funcionalidades reales (como autenticación, un blog, conexión a base de datos, entre otros) que simulan una aplicación web de la vida real. Es el entorno ideal para poner a prueba estrategias de QA (Aseguramiento de Calidad), identificar bugs, reportar incidencias y automatizar flujos de trabajo.

## 🔗 Proyecto Complementario: "Testing Frozen Space"

Este repositorio contiene **únicamente el código fuente de la aplicación** (Frontend y Backend).

Para las pruebas automatizadas, existe un proyecto complementario y estrictamente vinculado llamado **"Testing Frozen Space"**. 
* **Testing Frozen Space** es el repositorio hermano diseñado específicamente para albergar todo el framework de automatización, los scripts de prueba (ej. Selenium, Cypress, Behave), los archivos funcionales (Gherkin) y los reportes de ejecución que actúan sobre esta misma aplicación.

---

## 🚀 Tecnologías Utilizadas

- **Frontend**: Vite, Vanilla JavaScript, HTML/CSS
- **Backend**: Node.js, Express
- **Base de Datos**: Microsoft SQL Server (MSSQL) utilizando Autenticación de Windows

## 🛠️ Instalación y Configuración Local

Para ejecutar el proyecto localmente y tener tu entorno de pruebas listo, sigue estos pasos:

### 1. Requisitos Previos
- Node.js (v18 o superior recomendado).
- Microsoft SQL Server DataBases corriendo localmente (y preferiblemente configurado para utilizar Windows Authentication).

### 2. Clonar e Instalar Dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd frozen-space
npm install
```

### 3. Configurar Variables de Entorno
Asegúrate de configurar el archivo `.env` en la raíz del proyecto con las credenciales necesarias (como la configuración del puerto y conexión a base de datos) basándote en la estructura de tu entorno local.

### 4. Inicializar la Base de Datos
El proyecto incluye utilidades para crear la estructura de la base de datos automáticamente. Con tu servidor SQL activo, ejecuta:

```bash
# Inicializa la base de datos principal y tablas base
npm run db:init

# Crea las tablas necesarias para la funcionalidad completa del Blog
npm run db:blog
```

### 5. Ejecutar la Aplicación
Para levantar tanto el servidor Backend como el servidor de desarrollo del Frontend simultáneamente de forma sencilla:

```bash
npm run dev
```

La aplicación y su API estarán corriendo y disponibles en tu local para que puedas comenzar a planificar y ejecutar tus casos de prueba manuales o correr los scripts de **"Testing Frozen Space"**.
