# 📘 API Requirements - FieldOps Backend

**Versión:** 1.0  
**Frontend Developer:** [Tu nombre]  
**Para:** Backend Developer  
**Fecha:** Enero 2025

---

## 🎯 Propósito de este Documento

Este documento especifica **todos los endpoints** que el frontend necesita para funcionar correctamente. Cada endpoint incluye:

- ✅ Método HTTP
- ✅ Ruta completa
- ✅ Headers necesarios
- ✅ Body de request (ejemplos)
- ✅ Response esperada (ejemplos)
- ✅ Códigos de estado

---

## 🔗 Base URL
```
http://localhost:8000/api
```

**Formato:** JSON  
**Autenticación:** JWT Bearer Token

---

## 📚 Índice de Endpoints

### Autenticación
1. [Login](#1-login)
2. [Refresh Token](#2-refresh-token)

### Empresas (Superadmin)
3. [Listar Empresas](#3-listar-empresas)
4. [Crear Empresa](#4-crear-empresa)
5. [Actualizar Empresa](#5-actualizar-empresa)
6. [Activar/Desactivar Empresa](#6-activardesactivar-empresa)
7. [⭐ Verificar Estado de Cuenta](#7-verificar-estado-de-cuenta-crítico)

### Usuarios
8. [Listar Supervisores](#8-listar-supervisores)
9. [Crear Supervisor](#9-crear-supervisor)
10. [Listar Encargados](#10-listar-encargados)
11. [Crear Encargado](#11-crear-encargado)

### Planes
12. [Listar Planes](#12-listar-planes)

### Territorial
13. [Listar Distritos](#13-listar-distritos)
14. [Listar Zonas](#14-listar-zonas)
15. [Listar Sectores](#15-listar-sectores)

### Reportes
16. [Listar Reportes](#16-listar-reportes)

---

## 🔐 AUTENTICACIÓN

### **1. Login**

Permite a los usuarios iniciar sesión con DNI y contraseña.
```http
POST /api/login/
```

**Request Body:**
```json
{
  "dni": "12345678",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3MDY3MzYwMDB9.abc123",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3MDY4MjI0MDB9.def456",
  "user": {
    "id": 2,
    "dni": "12345678",
    "nombres": "Rosa Elena",
    "apellidos": "López Clemente",
    "email": "rosa.lopez@telecorp.com",
    "rol": "admin",
    "empresa_id": 1,
    "empresa_nombre": "TeleCorp S.A."
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Credenciales incorrectas"
}
```

**Response (400 Bad Request):**
```json
{
  "detail": "DNI y contraseña son requeridos"
}
```

---

### **2. Refresh Token**

Obtiene un nuevo access token usando el refresh token.
```http
POST /api/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🏢 EMPRESAS (SUPERADMIN)

### **3. Listar Empresas**

Obtiene todas las empresas registradas en el sistema.
```http
GET /api/empresas/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "TeleCorp S.A.",
    "ruc": "20123456789",
    "direccion": "Av. Principal 123, Lima",
    "telefono": "987654321",
    "email": "contacto@telecorp.com",
    "admin_local": "Rosa Elena López",
    "admin_email": "rosa.lopez@telecorp.com",
    "usuarios": 28,
    "reportes": 1450,
    "estado": "activa",
    "fecha_creacion": "2024-01-15",
    
    "plan_id": 1,
    "plan_nombre": "Plan Básico",
    "storage_plan_gb": 10.0,
    "storage_usado_gb": 7.2,
    "precio_mensual": 150.00,
    "precio_gb_extra": 15.00,
    "fecha_inicio": "2025-01-01",
    "fecha_fin": "2025-12-15",
    "pago_confirmado": true
  }
]
```

---

### **4. Crear Empresa**
```http
POST /api/empresas/
```

**Request Body:**
```json
{
  "nombre": "NuevaEmpresa S.A.C.",
  "ruc": "20111222333",
  "direccion": "Av. Test 456",
  "telefono": "999888777",
  "email": "info@nuevaempresa.com",
  "admin_local": "Juan Pérez",
  "admin_email": "juan.perez@nuevaempresa.com",
  "plan_id": 1,
  "fecha_inicio": "2025-02-01",
  "meses_contrato": 12
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "nombre": "NuevaEmpresa S.A.C.",
  // ... todos los campos de empresa
}
```

---

### **5. Actualizar Empresa**
```http
PATCH /api/empresas/{id}/
```

**Request Body (ejemplo):**
```json
{
  "telefono": "999999999",
  "email": "nuevo@email.com"
}
```

---

### **6. Activar/Desactivar Empresa**
```http
PATCH /api/empresas/{id}/toggle-estado/
```

**Response:**
```json
{
  "id": 1,
  "estado": "inactiva"
}
```

---

### **7. ⭐ Verificar Estado de Cuenta (CRÍTICO)**

**Este es el endpoint MÁS IMPORTANTE** para el sistema de planes.
```http
GET /api/empresas/{empresa_id}/verificar-estado/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

#### **Caso 1: Cuenta Activa (sin alertas)**

**Response (200 OK):**
```json
{
  "bloqueado": false,
  "alertas": [],
  "datos": {
    "dias_restantes": 319,
    "storage_usado": 7.2,
    "storage_plan": 10.0,
    "storage_extra": 0.0
  }
}
```

#### **Caso 2: Cuenta Activa (con alertas)**

**Response (200 OK):**
```json
{
  "bloqueado": false,
  "alertas": [
    {
      "tipo": "PROXIMO_VENCER",
      "nivel": "warning",
      "mensaje": "⏰ Tu plan vence en 5 días. Renueva pronto para evitar interrupciones."
    },
    {
      "tipo": "STORAGE_EXTRA",
      "nivel": "info",
      "mensaje": "💾 Has usado 0.8GB extra. Costo adicional en próxima factura: S/. 9.60"
    }
  ],
  "datos": {
    "dias_restantes": 5,
    "storage_usado": 13.8,
    "storage_plan": 15.0,
    "storage_extra": 0.8
  }
}
```

#### **Caso 3: Cuenta BLOQUEADA (Plan Vencido)**

**Response (200 OK):**
```json
{
  "bloqueado": true,
  "tipo": "VENCIDO",
  "mensaje": "Tu plan venció hace 50 días. Contacta con FieldOps para renovar.",
  "datos": {
    "dias_vencido": 50,
    "fecha_vencimiento": "2024-12-10"
  }
}
```

#### **Caso 4: Cuenta BLOQUEADA (Storage Excedido)**

**Response (200 OK):**
```json
{
  "bloqueado": true,
  "tipo": "STORAGE_EXCEDIDO",
  "mensaje": "Has excedido tu almacenamiento en 2.8GB sin confirmar pago. Costo pendiente: S/. 42.00",
  "datos": {
    "storage_extra": 2.8,
    "costo_extra": 42.00
  }
}
```

---

### **LÓGICA DE VALIDACIÓN (Pseudocódigo)**
```python
from datetime import date

def verificar_estado_empresa(empresa_id):
    empresa = Empresa.objects.get(id=empresa_id)
    hoy = date.today()
    
    # 1. Calcular días restantes
    dias_restantes = (empresa.fecha_fin - hoy).days
    
    # 2. BLOQUEO POR VENCIMIENTO
    if dias_restantes < 0:
        return {
            "bloqueado": True,
            "tipo": "VENCIDO",
            "mensaje": f"Tu plan venció hace {abs(dias_restantes)} días. Contacta con FieldOps para renovar.",
            "datos": {
                "dias_vencido": abs(dias_restantes),
                "fecha_vencimiento": str(empresa.fecha_fin)
            }
        }
    
    # 3. BLOQUEO POR STORAGE EXCEDIDO SIN PAGO
    storage_extra = empresa.storage_usado_gb - empresa.storage_plan_gb
    
    if storage_extra > 2 and not empresa.pago_confirmado:
        costo_extra = storage_extra * float(empresa.precio_gb_extra)
        return {
            "bloqueado": True,
            "tipo": "STORAGE_EXCEDIDO",
            "mensaje": f"Has excedido tu almacenamiento en {storage_extra:.1f}GB sin confirmar pago. Costo pendiente: S/. {costo_extra:.2f}",
            "datos": {
                "storage_extra": storage_extra,
                "costo_extra": costo_extra
            }
        }
    
    # 4. ADVERTENCIAS (NO BLOQUEAN)
    alertas = []
    
    if dias_restantes <= 7:
        alertas.append({
            "tipo": "PROXIMO_VENCER",
            "nivel": "warning",
            "mensaje": f"⏰ Tu plan vence en {dias_restantes} día{'s' if dias_restantes != 1 else ''}. Renueva pronto para evitar interrupciones."
        })
    
    if storage_extra > 0:
        costo_extra = storage_extra * float(empresa.precio_gb_extra)
        alertas.append({
            "tipo": "STORAGE_EXTRA",
            "nivel": "info",
            "mensaje": f"💾 Has usado {storage_extra:.1f}GB extra. Costo adicional en próxima factura: S/. {costo_extra:.2f}"
        })
    
    # 5. CUENTA ACTIVA
    return {
        "bloqueado": False,
        "alertas": alertas,
        "datos": {
            "dias_restantes": dias_restantes,
            "storage_usado": float(empresa.storage_usado_gb),
            "storage_plan": float(empresa.storage_plan_gb),
            "storage_extra": max(0, storage_extra)
        }
    }
```

---

## 👥 USUARIOS

### **8. Listar Supervisores**
```http
GET /api/supervisores/
```

**Query Params (opcionales):**
```
?empresa_id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "dni": "11111111",
    "nombres": "Supervisor",
    "apellidos": "Test",
    "email": "supervisor@empresa.com",
    "celular": "999888777",
    "empresa_id": 1,
    "estado": "activo",
    "fecha_creacion": "2025-01-15"
  }
]
```

---

### **9. Crear Supervisor**
```http
POST /api/supervisores/
```

**Request Body:**
```json
{
  "dni": "22222222",
  "nombres": "Nuevo",
  "apellidos": "Supervisor",
  "email": "nuevo.supervisor@empresa.com",
  "celular": "987654321",
  "empresa_id": 1,
  "password": "temporal123"
}
```

---

### **10. Listar Encargados**
```http
GET /api/encargados/
```

*(Igual que supervisores)*

---

### **11. Crear Encargado**
```http
POST /api/encargados/
```

*(Igual que supervisores)*

---

## 📦 PLANES

### **12. Listar Planes**
```http
GET /api/planes/
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Plan Básico",
    "storage_gb": 10,
    "precio_mensual": 150.00,
    "precio_gb_extra": 15.00,
    "descripcion": "Ideal para empresas pequeñas",
    "activo": true
  },
  {
    "id": 2,
    "nombre": "Plan Profesional",
    "storage_gb": 15,
    "precio_mensual": 200.00,
    "precio_gb_extra": 12.00,
    "descripcion": "Para empresas en crecimiento",
    "activo": true
  },
  {
    "id": 3,
    "nombre": "Plan Empresarial",
    "storage_gb": 20,
    "precio_mensual": 250.00,
    "precio_gb_extra": 10.00,
    "descripcion": "Para grandes operaciones",
    "activo": true
  }
]
```

---

## 🗺️ TERRITORIAL

### **13. Listar Distritos**
```http
GET /api/distritos/
```

**Query Params:**
```
?empresa_id=1
```

---

### **14. Listar Zonas**
```http
GET /api/zonas/
```

---

### **15. Listar Sectores**
```http
GET /api/sectores/
```

---

## 📊 REPORTES

### **16. Listar Reportes**
```http
GET /api/reportes/
```

**Query Params:**
```
?empresa_id=1
&tipo=poste
&fecha_inicio=2025-01-01
&fecha_fin=2025-01-31
&estado=pendiente
```

---

## 🗄️ MODELOS DE DATOS

### **Modelo Empresa**
```python
class Empresa(models.Model):
    # Campos básicos
    nombre = models.CharField(max_length=200)
    ruc = models.CharField(max_length=11, unique=True)
    direccion = models.TextField()
    telefono = models.CharField(max_length=15)
    email = models.EmailField()
    admin_local = models.CharField(max_length=200)
    admin_email = models.EmailField()
    usuarios = models.IntegerField(default=0)
    reportes = models.IntegerField(default=0)
    estado = models.CharField(
        max_length=20,
        choices=[('activa', 'Activa'), ('inactiva', 'Inactiva')],
        default='activa'
    )
    fecha_creacion = models.DateField(auto_now_add=True)
    
    # ⭐ CAMPOS DE PLAN (OBLIGATORIOS)
    plan_id = models.IntegerField()
    plan_nombre = models.CharField(max_length=100)
    storage_plan_gb = models.FloatField(default=10.0)
    storage_usado_gb = models.FloatField(default=0.0)
    precio_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    precio_gb_extra = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    pago_confirmado = models.BooleanField(default=True)
```

---

### **Modelo Usuario**
```python
from django.contrib.auth.models.AbstractUser import AbstractUser

class Usuario(AbstractUser):
    dni = models.CharField(max_length=8, unique=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    celular = models.CharField(max_length=15, blank=True)
    rol = models.CharField(
        max_length=20,
        choices=[
            ('superadmin', 'Superadmin'),
            ('admin', 'Admin Local'),
            ('supervisor', 'Supervisor'),
            ('encargado', 'Encargado')
        ]
    )
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
```

---

## 🧪 CASOS DE PRUEBA

| Escenario | fecha_fin | storage_usado_gb | storage_plan_gb | pago_confirmado | Resultado |
|-----------|-----------|------------------|-----------------|-----------------|-----------|
| Activo sin alertas | 2025-12-15 | 7.2 | 10 | true | `bloqueado: false`, `alertas: []` |
| Próximo a vencer | 2025-02-04 | 13.8 | 15 | true | `bloqueado: false`, 2 alertas |
| Vencido | 2024-12-10 | 12.8 | 10 | false | `bloqueado: true`, tipo: VENCIDO |
| Storage excedido | 2025-12-15 | 13.5 | 10 | false | `bloqueado: true`, tipo: STORAGE_EXCEDIDO |

---

## ⚠️ CÓDIGOS DE ESTADO HTTP

| Código | Descripción | Cuándo usarlo |
|--------|-------------|---------------|
| **200** | OK | Request exitoso (GET, PATCH exitoso) |
| **201** | Created | Recurso creado exitosamente (POST) |
| **204** | No Content | Recurso eliminado exitosamente (DELETE) |
| **400** | Bad Request | Datos inválidos o faltantes |
| **401** | Unauthorized | Token inválido o expirado |
| **403** | Forbidden | Usuario sin permisos para esta acción |
| **404** | Not Found | Recurso no encontrado |
| **500** | Internal Server Error | Error del servidor |

---

## 🔒 AUTENTICACIÓN Y PERMISOS

### **Headers Requeridos**

Todos los endpoints (excepto `/login/` y `/token/refresh/`) requieren:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Matriz de Permisos**

| Endpoint | Superadmin | Admin | Supervisor | Encargado |
|----------|------------|-------|------------|-----------|
| `/empresas/` | ✅ R/W | ❌ | ❌ | ❌ |
| `/empresas/{id}/verificar-estado/` | ✅ | ✅ (solo su empresa) | ❌ | ❌ |
| `/supervisores/` | ✅ | ✅ (solo su empresa) | ❌ | ❌ |
| `/encargados/` | ✅ | ✅ (solo su empresa) | ❌ | ❌ |
| `/reportes/` | ✅ | ✅ | ✅ (solo su zona) | ✅ (solo propios) |

---

## 📝 NOTAS IMPORTANTES PARA BACKEND

### **1. Validación de DNI**

- DNI debe ser único en el sistema
- Debe tener exactamente 8 dígitos numéricos
- Validar que no exista antes de crear usuario

### **2. Contraseñas**

- Hashear con bcrypt o similar
- Nunca retornar contraseñas en los responses
- Al crear usuario, generar contraseña temporal o permitir que admin la defina

### **3. Fechas**

- Todas las fechas en formato ISO: `YYYY-MM-DD`
- `fecha_fin` debe calcularse automáticamente: `fecha_inicio + meses_contrato`
- Al crear empresa, validar que `fecha_inicio` no sea pasada

### **4. Storage**

- `storage_usado_gb` debe actualizarse cuando se suben fotos/archivos
- Cada foto pesa aprox. 2-5 MB
- Calcular storage_extra: `max(0, storage_usado_gb - storage_plan_gb)`

### **5. Cálculo de días restantes**
```python
from datetime import date

dias_restantes = (empresa.fecha_fin - date.today()).days
```

### **6. CORS**

Configurar CORS para permitir requests desde:
- `http://localhost:5173` (desarrollo)
- `https://tu-dominio.com` (producción)
```python
# Django
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://fieldops.vercel.app",
]
```

### **7. Rate Limiting**

Implementar rate limiting en `/login/`:
- Máximo 5 intentos por minuto
- Bloquear IP después de 10 intentos fallidos

---

## 🧪 DATOS DE PRUEBA (Seed)

Para facilitar el testing, crear estos datos iniciales:

### **Planes**
```python
planes = [
    {"id": 1, "nombre": "Plan Básico", "storage_gb": 10, "precio_mensual": 150, "precio_gb_extra": 15},
    {"id": 2, "nombre": "Plan Profesional", "storage_gb": 15, "precio_mensual": 200, "precio_gb_extra": 12},
    {"id": 3, "nombre": "Plan Empresarial", "storage_gb": 20, "precio_mensual": 250, "precio_gb_extra": 10},
]
```

### **Usuarios**
```python
usuarios = [
    {
        "dni": "99999991",
        "password": "admin123",
        "nombres": "Super",
        "apellidos": "Admin",
        "email": "admin@fieldops.com",
        "rol": "superadmin"
    },
    {
        "dni": "12345678",
        "password": "admin123",
        "nombres": "Rosa Elena",
        "apellidos": "López Clemente",
        "email": "rosa.lopez@telecorp.com",
        "rol": "admin",
        "empresa_id": 1
    },
    {
        "dni": "87654321",
        "password": "admin123",
        "nombres": "María",
        "apellidos": "García Rodríguez",
        "email": "maria.garcia@conectaperu.com",
        "rol": "admin",
        "empresa_id": 2
    },
    {
        "dni": "11223344",
        "password": "admin123",
        "nombres": "Carlos",
        "apellidos": "López Sánchez",
        "email": "carlos.lopez@fibranet.pe",
        "rol": "admin",
        "empresa_id": 3
    }
]
```

### **Empresas**
```python
from datetime import date, timedelta

empresas = [
    {
        "id": 1,
        "nombre": "TeleCorp S.A.",
        "ruc": "20123456789",
        "plan_id": 1,
        "storage_plan_gb": 10,
        "storage_usado_gb": 7.2,
        "fecha_inicio": date(2025, 1, 1),
        "fecha_fin": date(2025, 12, 15),  # Plan activo
        "pago_confirmado": True
    },
    {
        "id": 2,
        "nombre": "ConectaPeru EIRL",
        "ruc": "20987654321",
        "plan_id": 2,
        "storage_plan_gb": 15,
        "storage_usado_gb": 13.8,
        "fecha_inicio": date(2025, 1, 1),
        "fecha_fin": date.today() + timedelta(days=5),  # Vence en 5 días
        "pago_confirmado": True
    },
    {
        "id": 3,
        "nombre": "FibraNet S.A.C.",
        "ruc": "20555666777",
        "plan_id": 1,
        "storage_plan_gb": 10,
        "storage_usado_gb": 12.8,
        "fecha_inicio": date(2024, 8, 1),
        "fecha_fin": date(2024, 12, 10),  # Ya venció
        "pago_confirmado": False
    }
]
```

---

## 📊 EJEMPLOS DE REQUESTS CON CURL

### **Login**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "password": "admin123"
  }'
```

### **Listar Empresas**
```bash
curl -X GET http://localhost:8000/api/empresas/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Verificar Estado de Cuenta**
```bash
curl -X GET http://localhost:8000/api/empresas/1/verificar-estado/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Crear Empresa**
```bash
curl -X POST http://localhost:8000/api/empresas/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nueva Empresa",
    "ruc": "20111222333",
    "plan_id": 1,
    "fecha_inicio": "2025-02-01",
    "meses_contrato": 12
  }'
```

---

## 🔄 FLUJO DE AUTENTICACIÓN COMPLETO
```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    F->>B: POST /api/login/ {dni, password}
    B->>DB: Verificar credenciales
    DB-->>B: Usuario encontrado
    B->>B: Generar tokens JWT
    B-->>F: {access, refresh, user}
    F->>F: Guardar en localStorage
    
    Note over F: Usuario navega...
    
    F->>B: GET /api/empresas/1/verificar-estado/
    B->>B: Verificar token JWT
    B->>DB: Obtener empresa
    B->>B: Calcular días restantes
    B->>B: Verificar storage
    B-->>F: {bloqueado: false, alertas: [...]}
    
    alt Token Expirado
        F->>B: POST /api/token/refresh/ {refresh}
        B-->>F: {access: nuevo_token}
        F->>F: Actualizar localStorage
    end
```

---

## 🚨 MANEJO DE ERRORES

### **Formato de Error Estándar**

Todos los errores deben retornar:
```json
{
  "detail": "Descripción del error",
  "code": "ERROR_CODE_OPCIONAL"
}
```

### **Ejemplos de Errores**

**400 - Datos Inválidos:**
```json
{
  "detail": "El RUC debe tener 11 dígitos",
  "code": "INVALID_RUC"
}
```

**401 - No Autenticado:**
```json
{
  "detail": "Token inválido o expirado",
  "code": "INVALID_TOKEN"
}
```

**403 - Sin Permisos:**
```json
{
  "detail": "No tienes permisos para acceder a esta empresa",
  "code": "FORBIDDEN"
}
```

**404 - No Encontrado:**
```json
{
  "detail": "Empresa no encontrada",
  "code": "NOT_FOUND"
}
```

---

## 📦 LIBRERÍAS RECOMENDADAS

### **Django**
```bash
pip install django djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install psycopg2-binary  # Para PostgreSQL
```

### **FastAPI**
```bash
pip install fastapi uvicorn
pip install python-jose[cryptography]
pip install passlib[bcrypt]
pip install python-multipart
```

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### **Fase 1 (Crítico) - 1 semana**
1. ✅ Login + JWT
2. ✅ Modelo Empresa con campos de plan
3. ✅ Endpoint de verificar estado de cuenta
4. ✅ CORS configurado

### **Fase 2 (Alta) - 1 semana**
5. ✅ CRUD Empresas
6. ✅ CRUD Usuarios (Supervisores/Encargados)
7. ✅ Listar Planes

### **Fase 3 (Media) - 2 semanas**
8. ✅ Gestión Territorial (Distritos, Zonas, Sectores)
9. ✅ CRUD Reportes
10. ✅ Subida de fotos

---

## ✅ CHECKLIST DE DESARROLLO
```
□ Crear modelos de BD (Empresa, Usuario, Plan)
□ Configurar JWT
□ Implementar /api/login/
□ Implementar /api/token/refresh/
□ Implementar /api/empresas/ (GET, POST)
□ Implementar /api/empresas/{id}/verificar-estado/ ⭐
□ Implementar /api/supervisores/ (GET, POST)
□ Implementar /api/encargados/ (GET, POST)
□ Implementar /api/planes/ (GET)
□ Configurar CORS
□ Crear datos de prueba (seed)
□ Probar todos los endpoints con Postman
□ Documentar en Swagger/ReDoc
```

---

## 📞 CONTACTO Y SOPORTE

**Frontend Developer:**  
- Nombre: [Tu nombre]  
- Email: [tu-email]  
- Slack/Discord: [tu-usuario]

**Disponibilidad:**  
Lunes a Viernes, 9:00 AM - 6:00 PM

**Respuesta esperada:**  
- Dudas urgentes: < 2 horas  
- Consultas generales: < 24 horas

---

## 🔗 RECURSOS ADICIONALES

- [Django REST Framework](https://www.django-rest-framework.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [JWT.io](https://jwt.io/)
- [Postman Collection](./postman_collection.json) *(crear después)*

---

## 📅 ACTUALIZACIONES

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-01-30 | 1.0 | Versión inicial |

---

**¿Tienes dudas sobre algún endpoint? Contáctame y lo revisamos juntos.** 🚀

---

**Última actualización:** Enero 30, 2025