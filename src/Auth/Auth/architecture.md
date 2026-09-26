# System Architecture & Design

This document details the architectural design, layer structure, security mechanisms, data flows, and component interactions for the **Authentication API Service**.

---

## 🏗 High-Level Architecture Overview

The application follows a **Modular Layered Architecture** built on FastAPI, SQLAlchemy ORM, and PostgreSQL. It decouples HTTP routing, request validation, business logic, security processing, and database persistence into distinct modules.

```mermaid
flowchart TD
    Client["Client / Frontend / Mobile App"]

    subgraph FastAPI Application Layer
        Gateway["FastAPI Router Gateway (main.py)"]
        Limiter["SlowAPI Rate Limiter (plimiter.py)"]
        AuthMiddleware["JWT Auth Dependency (authenticate.py)"]

        subgraph Feature Routers
            RegRouter["Registration & OTP Routers"]
            AuthRouter["Login, Refresh & Logout Routers"]
            PassRouter["Password Recovery & Reset Routers"]
        end
    end

    subgraph Service & Utility Layer
        OTPService["OTP & Verification Services"]
        JWTUtil["JWT Token Generator (jwt_utils.py)"]
        HashUtil["Password Hasher (password_utils.py)"]
        EmailUtil["Email Dispatcher (email_utils.py)"]
        TwoFactorService["2Factor / Voice OTP Service (p2factor.py)"]
    end

    subgraph Data & Storage Layer
        DBEngine["SQLAlchemy Engine (database.py)"]
        Postgres[(PostgreSQL Database)]
    end

    Client -->|HTTP Requests| Gateway
    Gateway --> Limiter
    Limiter --> AuthMiddleware
    AuthMiddleware --> RegRouter & AuthRouter & PassRouter

    RegRouter --> OTPService & EmailUtil & TwoFactorService
    AuthRouter --> JWTUtil & HashUtil
    PassRouter --> OTPService & EmailUtil & HashUtil

    OTPService & JWTUtil & HashUtil --> DBEngine
    DBEngine --> Postgres
```

---

## 🧩 Layer Breakdown

### 1. **API & Routing Layer** (`main.py`, `*.py` routers)
* **Responsibility**: Exposes HTTP REST endpoints, validates incoming JSON request payloads against Pydantic schemas, handles route dispatching, and formats API responses.
* **Key Components**:
  * `main.py`: Central application entry point, mounts all feature routers and sets up global exception handlers.
  * Routers (`register.py`, `login.py`, `logout.py`, `refresh.py`, `otp_verify.py`, `email_verify.py`, `password_recovery.py`, `change_password.py`).

### 2. **Security & Middleware Layer**
* **Responsibility**: Enforces request rate limits, validates JWT bearer tokens, and handles password hashing & hashing verification.
* **Key Components**:
  * `plimiter.py`: SlowAPI rate limiter instance guarding routes against brute-force attacks.
  * `authenticate.py`: FastAPI dependency (`get_current_user`) extracting and verifying access tokens from HTTP `Authorization` headers.
  * `jwt_utils.py`: Encodes and decodes JWT access tokens and refresh tokens using standard secret key algorithms.
  * `password_utils.py` & `otp_hash_utils.py`: Hashes user passwords and OTP/verification codes securely.

### 3. **Service & Business Logic Layer**
* **Responsibility**: Executes domain logic, coordinates verification token generation, manages token expiration, and invokes third-party integration services.
* **Key Components**:
  * `otp_service.py` & `email_verification_service.py`: Handles OTP generation, code expiration logic, and state validation.
  * `p2factor.py` & `pvoice_otp.py`: External API wrapper for sending SMS and voice-based OTPs via 2Factor provider.
  * `email_utils.py`: SMTP mail sender for delivering account verification and password recovery codes.

### 4. **Persistence & Storage Layer** (`database.py`, `models.py`, `tables.py`)
* **Responsibility**: Manages PostgreSQL connections, database sessions, ORM entity mappings, and database schema definitions.
* **Key Components**:
  * `database.py`: Instantiates SQLAlchemy engine (`create_engine`) and `SessionLocal` factory.
  * `models.py` & `tables.py`: Defines database entities for users, sessions, tokens, and verification codes.

---

## 🔄 Core Data & Execution Flows

### 1. User Registration & OTP Verification Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Router as Registration Router (register.py)
    participant Service as OTP Service (otp_service.py)
    participant ExtAPI as 2Factor / Email Utility
    participant DB as PostgreSQL Database

    User->>Router: POST /register (User details)
    Router->>DB: Check if user exists
    alt User exists
        Router-->>User: HTTP 400 Bad Request
    else User is new
        Router->>Service: Generate OTP / Verification Code
        Service->>DB: Store hashed code & expiration time
        Router->>ExtAPI: Dispatch SMS / Voice OTP / Email Code
        ExtAPI-->>User: Deliver OTP Code
        Router-->>User: HTTP 201 Created (Pending Verification)
    end

    User->>Router: POST /verify-otp (Email/Phone + OTP Code)
    Router->>Service: Validate OTP Code & Expiration
    alt Valid OTP
        Service->>DB: Update user status to Verified / Active
        Router-->>User: HTTP 200 Success (Account Verified)
    else Invalid / Expired OTP
        Router-->>User: HTTP 400 Invalid or Expired Code
    end
```

---

### 2. Login & Token Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Auth as Login Router (login.py)
    participant Hasher as Password Utils (password_utils.py)
    participant JWT as JWT Utils (jwt_utils.py)
    participant DB as PostgreSQL Database

    User->>Auth: POST /login (Credentials)
    Auth->>DB: Fetch User Record by Username/Email
    Auth->>Hasher: Verify Plaintext Password vs Hash
    alt Credentials Invalid
        Auth-->>User: HTTP 401 Unauthorized
    else Credentials Valid
        Auth->>JWT: Generate Access Token (Short-lived)
        Auth->>JWT: Generate Refresh Token (Long-lived)
        Auth->>DB: Persist Refresh Token
        Auth-->>User: Return Tokens (Access & Refresh)
    end

    Note over User, Auth: Requesting Protected Resource
    User->>Auth: GET /auth/profile (Header: Bearer <AccessToken>)
    Auth->>JWT: Validate Access Token
    JWT-->>Auth: Token Valid (User ID)
    Auth-->>User: HTTP 200 (User Profile Data)
```

---

## 🔒 Security Architecture

1. **Password Hashing**: Passwords are never stored in plaintext. They are hashed using **Argon2** / **Bcrypt** algorithm variants.
2. **Token Security**:
   * **Access Tokens**: Short-lived JWTs containing user identity claims.
   * **Refresh Tokens**: Stored in the database to enable secure session revocation and rotation.
3. **Rate Limiting**: Critical endpoints (`/login`, `/register`, `/verify-otp`, `/password-recovery`) are rate-limited via SlowAPI to mitigate brute-force and credential stuffing attacks.
4. **Environment Isolation**: Database connection strings, SMTP passwords, 2FA API keys, and JWT secrets are injected runtime through `.env` files.

---

## 💾 Database ER Model (Conceptual)

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string username UK
        string hashed_password
        boolean is_active
        boolean is_verified
        datetime created_at
    }

    REFRESH_TOKENS {
        int id PK
        int user_id FK
        string token UK
        datetime expires_at
        boolean is_revoked
    }

    OTP_VERIFICATIONS {
        int id PK
        int user_id FK
        string otp_hash
        string purpose
        datetime expires_at
    }

    USERS ||--o{ REFRESH_TOKENS : "has sessions"
    USERS ||--o{ OTP_VERIFICATIONS : "generates verification codes"
```
