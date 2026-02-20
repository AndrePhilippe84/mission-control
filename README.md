# Andre Philippe AI Team - Dashboards

**Mission Control + Dev Studio Dashboards**

Dashboards profesionales para gestionar tu equipo de 22 agentes de AI.

---

## 🎯 Características

### Mission Control
- ✅ Dashboard estratégico con métricas clave
- ✅ Gestión de proyectos (Sound Money Bank, etc.)
- ✅ Monitoreo de agentes Core (10)
- ✅ Análisis de costos y uso

### Dev Studio
- ✅ Workflows BMAD (12 agentes)
- ✅ Fases de desarrollo (Planning → Execution → Launch)
- ✅ Gestión de historias y tareas
- ✅ Métricas de agentes de desarrollo

### Secrets Vault 🔐
- ✅ Almacenamiento seguro de API keys
- ✅ Cifrado AES-256 local
- ✅ Soporte múltiples proveedores (OpenAI, Anthropic, GLM-5, Kimi)
- ✅ Selector de modelos por proveedor
- ✅ Custom endpoints opcionales

---

## 🚀 Quick Start

### Instalación

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Build para producción
npm run build
```

### Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📁 Estructura del Proyecto

```
andre-ai-dashboards/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Dashboard principal
│   │   └── globals.css         # Estilos globales
│   ├── components/
│   │   ├── secrets/            # Secrets Vault
│   │   │   ├── SecretsVault.tsx
│   │   │   └── index.ts
│   │   └── ui/                 # Componentes UI (shadcn)
│   ├── hooks/
│   │   └── useSecrets.ts       # Hook para gestión de secrets
│   ├── lib/
│   │   ├── crypto.ts           # Utilidades de cifrado
│   │   └── utils.ts            # Utilidades generales
│   └── types/
│       └── secrets.ts          # Tipos TypeScript
├── public/
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔐 Seguridad - Secrets Vault

El Secrets Vault utiliza cifrado AES-256-GCM para proteger tus API keys:

1. **Master Password**: Se usa para derivar la clave de cifrado (PBKDF2)
2. **Cifrado Local**: Todo se cifra en el navegador antes de guardar
3. **Almacenamiento**: localStorage (nunca sale de tu dispositivo)
4. **Sin Backend**: No hay servidor que procese tus keys

### Uso:

1. Crear vault con master password
2. Agregar API keys (OpenAI, Anthropic, GLM-5, etc.)
3. Seleccionar modelo default por proveedor
4. Usar en tus agentes sin exponer las keys

---

## 🌐 Deployment

### Opción 1: Vercel (Recomendado)

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Importar repositorio de GitHub
3. Configurar dominio: `mission-control.andreaj1990.com`
4. Configurar Cloudflare Access para protección

### Opción 2: VPS (Self-hosted)

```bash
# Build
npm run build

# Los archivos estáticos quedan en /dist
# Copiar a tu servidor web (Nginx, Apache, etc.)
```

---

## 📊 Características del Dashboard

### Métricas en Tiempo Real
- Costos por proveedor (OpenAI, Anthropic, GLM-5, Kimi)
- Uso de tokens
- Tareas completadas
- Estado de agentes

### Gestión de Agentes
- 10 Agentes Core (estrategia)
- 12 Agentes BMAD (desarrollo)
- Estado en tiempo real
- Asignación por modelo

### Workflows BMAD
- Phase 1: Planning (6 agentes)
- Phase 2: Readiness Check (1 agente)
- Phase 3: Execution (12 agentes)
- Phase 4: Launch (2 agentes)

---

## 🔧 Configuración

### Variables de Entorno (Opcional)

```env
# No son necesarias - todo se configura en el UI
# Las API keys se guardan en el Secrets Vault
```

### Configuración Multi-Proveedor

| Proveedor | Modelos Disponibles |
|-----------|-------------------|
| **OpenAI** | gpt-4o, o1, o3-mini, gpt-3.5-turbo |
| **Anthropic** | claude-3-7-sonnet, claude-3-opus, claude-3-haiku |
| **Zhipu (GLM)** | glm-5, glm-4, glm-4v, glm-4-flash |
| **Moonshot** | kimi-k2.5, kimi-k2, kimi-k1.5 |

---

## 🛡️ Seguridad

### Recomendaciones:

1. **Master Password Fuerte**: Mínimo 12 caracteres, mezcla de letras, números y símbolos
2. **Backup**: Exporta tus keys importantes a un password manager externo
3. **HTTPS Siempre**: Nunca uses HTTP en producción
4. **Cloudflare Access**: Protege con Google OAuth
5. **Rotación**: Cambia tus API keys periódicamente

---

## 📝 TODO / Roadmap

- [ ] Integración real con APIs de agentes
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Exportar/importar vault (backup/restore)
- [ ] Autenticación de usuario (multi-user)
- [ ] Historial de cambios
- [ ] Notificaciones push
- [ ] App móvil (PWA)

---

## 🤝 Contribuir

Este es un proyecto privado para Andre Philippe AI Team.

---

## 📄 Licencia

Private - Andre Philippe AI Team

---

**Creado:** 2026-02-20  
**Versión:** 1.0.0  
**Autor:** Andre Philippe AI Team
