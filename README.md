# 🛒 Backend - Sistema de Ventas

Este repositorio contiene el Backend del Sistema de Ventas (POS System) desarrollado en .NET 8 con arquitectura por capas, base de datos en PostgreSQL, y administración con DBeaver.

El sistema expone una API RESTful para la gestión de productos, clientes, ventas, usuarios y reportes. Se complementa con un Frontend en Angular 19 que implementa un Dashboard moderno e interactivo.

<br>

## 🚀 Tecnologías Utilizadas

💻 Backend

➡ .NET 8 (C#) – Plataforma principal de desarrollo.
➡ ASP.NET Web API – API web principal para la comunicación con el frontend.
➡ Entity Framework Core – ORM con enfoque Code First y soporte para migraciones.
➡ FluentValidation – Validación de DTOs para garantizar datos consistentes
➡ AutoMapper – Mapeo automático entre entidades y DTOs.
➡ PostgreSQL – Base de datos relacional confiable y escalable.
➡ DBeaver – Herramienta de gestión y administración de la base de datos.

🖥️ Interfaz / Frontend

✨ Angular 19 – Framework principal para desarrollo frontend moderno
✨ Angular Material / Bootstrap – Estilos y componentes UI para una interfaz atractiva
✨ Dashboard personalizado – Visualización de reportes y métricas en tiempo real

<br>

## 📊 Funcionalidades Principales

✅ Gestión de Usuarios (autenticación, roles, permisos)

✅ Administración de Productos y Categorías

✅ Registro y seguimiento de Clientes

✅ Procesamiento de Ventas (detalle y facturación)

✅ Dashboard con métricas y reportes en frontend (Angular 19)

<br>

## 🛠️ Configuración del entorno

### 1. Clonar repositorio

```bash

git clone https://github.com/usuario/pos-system-backend.git
cd pos-system-backend

```

### 2. Crear base de datos en PostgreSQL

Usando **DBeaver** o consola de psql:

```sql

CREATE DATABASE sistema_ventas;

```

### 3. Configurar conexión en `appsettings.json`

```json

"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=sistema_ventas;Username=postgres;Password=tu_password"
}

```

### 4. Aplicar migraciones

```bash

dotnet ef database update

```

### 5. Ejecutar la API

```bash

dotnet run --project Pos.Api

```

<br>

## 🖥️ Frontend (Angular 19)

El **frontend** fue desarrollado en **Angular 19**, con un **dashboard administrativo** que consume esta API.

<br>

## 👨‍💻 Autor

**Mario García**

* 👨‍🏫 Docente universitario
* 💻 Desarrollador de aplicaciones web y escritorio
* 🌱 Apasionado por proyectos educativos y prácticos


