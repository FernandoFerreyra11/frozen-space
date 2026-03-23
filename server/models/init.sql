-- =============================================
-- Frozen Space - Database Initialization Script
-- Run this on SQL Server to create the database
-- =============================================

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'FrozenSpaceDB')
BEGIN
    CREATE DATABASE FrozenSpaceDB;
END
GO

USE FrozenSpaceDB;
GO

-- =============================================
-- Users Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) DEFAULT 'user',
        preferred_language NVARCHAR(5) DEFAULT 'es',
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Challenges Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Challenges' AND xtype='U')
BEGIN
    CREATE TABLE Challenges (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title_es NVARCHAR(255) NOT NULL,
        title_en NVARCHAR(255) NOT NULL,
        description_es NVARCHAR(MAX) NOT NULL,
        description_en NVARCHAR(MAX) NOT NULL,
        technology NVARCHAR(50) NOT NULL,
        difficulty NVARCHAR(20) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        estimated_time INT NOT NULL,
        test_cases_count INT DEFAULT 0,
        icon NVARCHAR(50) DEFAULT 'code',
        is_active BIT DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- User Progress Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserProgress' AND xtype='U')
BEGIN
    CREATE TABLE UserProgress (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        status NVARCHAR(20) DEFAULT 'not_started',
        score INT DEFAULT 0,
        started_at DATETIME2 DEFAULT GETDATE(),
        completed_at DATETIME2 NULL,
        CONSTRAINT FK_UserProgress_User FOREIGN KEY (user_id) REFERENCES Users(id),
        CONSTRAINT FK_UserProgress_Challenge FOREIGN KEY (challenge_id) REFERENCES Challenges(id),
        CONSTRAINT UQ_UserChallenge UNIQUE (user_id, challenge_id)
    );
END
GO

-- =============================================
-- Seed Challenges Data
-- =============================================
IF NOT EXISTS (SELECT TOP 1 1 FROM Challenges)
BEGIN
    INSERT INTO Challenges (title_es, title_en, description_es, description_en, technology, difficulty, category, estimated_time, test_cases_count, icon) VALUES
    (
        N'Crear Test Cases en Jira para E-commerce',
        N'Create Test Cases in Jira for E-commerce',
        N'Aprende a crear y organizar test cases en Jira para un proyecto de e-commerce. Incluye casos de prueba para el carrito de compras, checkout, y gestión de productos.',
        N'Learn to create and organize test cases in Jira for an e-commerce project. Includes test cases for shopping cart, checkout, and product management.',
        'jira', 'beginner', 'test_management', 45, 12, 'clipboard-list'
    ),
    (
        N'Automatizar Pruebas de API con Postman',
        N'Automate API Tests with Postman',
        N'Configura colecciones de Postman para automatizar pruebas de una REST API. Incluye validaciones de respuesta, variables de entorno y tests de integración.',
        N'Set up Postman collections to automate REST API tests. Includes response validations, environment variables, and integration tests.',
        'postman', 'intermediate', 'api_testing', 60, 8, 'send'
    ),
    (
        N'Revisar un Pull Request en GitHub',
        N'Review a Pull Request on GitHub',
        N'Practica la revisión de código en GitHub. Identifica bugs, sugiere mejoras y aprende a usar las herramientas de code review efectivamente.',
        N'Practice code review on GitHub. Identify bugs, suggest improvements, and learn to use code review tools effectively.',
        'github', 'beginner', 'code_review', 30, 6, 'git-pull-request'
    ),
    (
        N'Configurar Pipeline CI/CD en Bitbucket',
        N'Configure CI/CD Pipeline in Bitbucket',
        N'Configura un pipeline de integración continua en Bitbucket Pipelines. Incluye ejecución de tests automatizados, linting y deploy.',
        N'Configure a continuous integration pipeline in Bitbucket Pipelines. Includes automated test execution, linting, and deployment.',
        'bitbucket', 'advanced', 'ci_cd', 90, 10, 'git-branch'
    ),
    (
        N'Escribir Tests E2E con Cypress',
        N'Write E2E Tests with Cypress',
        N'Desarrolla tests end-to-end con Cypress para una aplicación web. Cubre navegación, formularios, autenticación y aserciones visuales.',
        N'Develop end-to-end tests with Cypress for a web application. Covers navigation, forms, authentication, and visual assertions.',
        'cypress', 'intermediate', 'e2e_testing', 75, 15, 'monitor'
    ),
    (
        N'Gestionar Bugs en Jira con Workflows',
        N'Manage Bugs in Jira with Workflows',
        N'Aprende a gestionar el ciclo de vida de bugs usando workflows personalizados en Jira. Incluye priorización, asignación y seguimiento.',
        N'Learn to manage the bug lifecycle using custom workflows in Jira. Includes prioritization, assignment, and tracking.',
        'jira', 'intermediate', 'bug_tracking', 50, 8, 'bug'
    ),
    (
        N'Tests Unitarios con Selenium WebDriver',
        N'Unit Tests with Selenium WebDriver',
        N'Escribe tests automatizados con Selenium WebDriver. Aprende selectores, waits, y patrones como Page Object Model.',
        N'Write automated tests with Selenium WebDriver. Learn selectors, waits, and patterns like Page Object Model.',
        'selenium', 'advanced', 'automation', 120, 20, 'globe'
    ),
    (
        N'Crear Reportes de Calidad en Jira',
        N'Create Quality Reports in Jira',
        N'Genera dashboards y reportes de calidad usando Jira. Incluye métricas de bugs, cobertura de tests y velocity del equipo QA.',
        N'Generate quality dashboards and reports using Jira. Includes bug metrics, test coverage, and QA team velocity.',
        'jira', 'beginner', 'reporting', 40, 5, 'bar-chart'
    ),
    (
        N'Integrar GitHub Actions para Testing',
        N'Integrate GitHub Actions for Testing',
        N'Configura GitHub Actions para ejecutar tests automatizados en cada push. Incluye matrix builds, artifacts y notificaciones.',
        N'Configure GitHub Actions to run automated tests on every push. Includes matrix builds, artifacts, and notifications.',
        'github', 'advanced', 'ci_cd', 80, 12, 'play-circle'
    ),
    (
        N'Testing de Performance con Postman',
        N'Performance Testing with Postman',
        N'Ejecuta tests de carga y performance usando Postman y Newman. Analiza tiempos de respuesta y encuentra cuellos de botella.',
        N'Run load and performance tests using Postman and Newman. Analyze response times and find bottlenecks.',
        'postman', 'advanced', 'performance', 70, 10, 'zap'
    );
END
GO
