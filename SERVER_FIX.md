# Corrección del Servidor - Pantalla en Blanco

## Problema Identificado

El servidor estaba mostrando una pantalla en blanco en `http://localhost:5173/` porque:

1. **Script `dev` incorrecto**: Estaba ejecutando `vite` por separado, lo que hacía que Vite corriera en el puerto 5173 independientemente del servidor Express
2. **Orden de middlewares incorrecto**: Las rutas de la API se registraban antes de configurar Vite
3. **Proxy incorrecto**: El proxy en `vite.config.ts` apuntaba al puerto 3000 en lugar del 5000

## Soluciones Implementadas

### 1. Script `dev` Corregido
```json
// Antes:
"dev": "cross-env NODE_ENV=development tsx server/index.ts & vite"

// Después:
"dev": "cross-env NODE_ENV=development tsx server/index.ts"
```

**Razón**: El servidor Express ya tiene Vite integrado a través de `setupVite()`, por lo que no necesita ejecutarse por separado.

### 2. Orden de Middlewares Corregido
```typescript
// Orden correcto:
1. Crear servidor HTTP
2. Configurar Vite (necesita el servidor para HMR)
3. Registrar rutas de la API
4. Configurar error handler
```

**Razón**: Vite debe estar configurado antes de las rutas para que pueda interceptar las peticiones del frontend correctamente.

### 3. Proxy Corregido
```typescript
// vite.config.ts
proxy: {
  "/api": {
    target: "http://localhost:5000", // Cambiado de 3000 a 5000
    changeOrigin: true,
    secure: false,
  },
}
```

### 4. Middleware de Vite Mejorado
Se agregó una verificación para saltar las rutas de la API:
```typescript
if (url.startsWith("/api")) {
  return next(); // Dejar que Express maneje las rutas de API
}
```

## Cómo Funciona Ahora

1. **Un solo servidor**: El servidor Express corre en el puerto 5000
2. **Vite integrado**: Vite funciona como middleware dentro de Express
3. **HMR funcionando**: Hot Module Replacement funciona correctamente
4. **Rutas separadas**: 
   - `/api/*` → Rutas de la API (Express)
   - `/*` → Frontend (Vite)

## Uso

```bash
# Iniciar el servidor de desarrollo
npm run dev

# El servidor estará disponible en:
# - Frontend: http://localhost:5000
# - API: http://localhost:5000/api
```

## Verificación

Para verificar que todo funciona:

1. Ejecuta `npm run dev`
2. Abre `http://localhost:5000` en tu navegador
3. Deberías ver la aplicación funcionando correctamente
4. Las peticiones a `/api/*` deberían funcionar correctamente

## Notas Importantes

- **NO** ejecutes `vite` por separado
- El servidor Express maneja todo (API + Frontend)
- El puerto por defecto es 5000 (configurable con `PORT` en `.env`)
- En producción, se sirven archivos estáticos en lugar de Vite

