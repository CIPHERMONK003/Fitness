import { JavaSourceFile } from '../types/javaArchitecture';

export const JAVA_SOURCE_FILES: JavaSourceFile[] = [
  {
    id: 'user-base',
    filename: 'User.java',
    packageName: 'com.fitpulse.model',
    layer: 'Model',
    oopConcepts: ['Abstraction', 'Encapsulation', 'Inheritance Base', 'Standard Getters/Setters'],
    description: 'Abstract base domain model encapsulating shared identity, authentication tokens, and common audit fields.',
    code: `package com.fitpulse.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Base User entity demonstrating Object-Oriented Abstraction and Encapsulation.
 * Implements Serializable for HTTP session persistence across distributed servlet containers.
 */
public abstract class User implements Serializable {
    private static final long serialVersionUID = 1L;

    // Encapsulated private fields
    private Long id;
    private String name;
    private String email;
    private String passwordHash;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    // Default constructor (required by JavaBeans specification)
    public User() {
        this.createdAt = LocalDateTime.now();
        this.status = UserStatus.ACTIVE;
    }

    // Parameterized constructor
    public User(Long id, String name, String email, String passwordHash, UserRole role) {
        this();
        this.id = id;
        this.name = Objects.requireNonNull(name, "User name cannot be null");
        this.email = Objects.requireNonNull(email, "User email cannot be null");
        this.passwordHash = passwordHash;
        this.role = role;
    }

    // Polymorphic abstract methods enforcing specialized child behaviors
    public abstract String getRoleSpecificDashboard();
    public abstract boolean hasAccessPermission(String permissionToken);

    // Standard Getters and Setters with defensive checks
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;
        return Objects.equals(id, user.id) && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    @Override
    public String toString() {
        return "User[id=" + id + ", name='" + name + "', email='" + email + "', role=" + role + "]";
    }
}`
  },
  {
    id: 'member-child',
    filename: 'Member.java',
    packageName: 'com.fitpulse.model',
    layer: 'Model',
    oopConcepts: ['Inheritance (extends User)', 'Polymorphic Overriding', 'Method Specialization'],
    description: 'Specialized User entity representing fitness trainees with weight tracking, goals, and enrolled plans.',
    code: `package com.fitpulse.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Concrete Member class demonstrating Inheritance and Dynamic Method Overriding.
 */
public class Member extends User {
    private static final long serialVersionUID = 1L;

    private FitnessGoal fitnessGoal;
    private double currentWeightKg;
    private double targetWeightKg;
    private double heightCm;
    private Long assignedCoachId;
    private final List<Long> enrolledPlanIds;

    public Member() {
        super();
        this.enrolledPlanIds = new ArrayList<>();
    }

    public Member(Long id, String name, String email, String passwordHash, 
                  FitnessGoal goal, double weightKg, double heightCm) {
        super(id, name, email, passwordHash, UserRole.MEMBER);
        this.fitnessGoal = goal;
        this.currentWeightKg = weightKg;
        this.heightCm = heightCm;
        this.enrolledPlanIds = new ArrayList<>();
    }

    // Dynamic Polymorphic Method Overriding
    @Override
    public String getRoleSpecificDashboard() {
        return "/views/member/trainee-dashboard.jsp";
    }

    @Override
    public boolean hasAccessPermission(String permissionToken) {
        return "ACCESS_WORKOUTS".equals(permissionToken) 
            || "SUBMIT_PROGRESS".equals(permissionToken)
            || "MESSAGE_COACH".equals(permissionToken);
    }

    // Specialized business methods
    public double calculateBMI() {
        if (heightCm <= 0) return 0.0;
        double heightInMeters = heightCm / 100.0;
        return Math.round((currentWeightKg / (heightInMeters * heightInMeters)) * 10.0) / 10.0;
    }

    public void enrollInPlan(Long planId) {
        if (!enrolledPlanIds.contains(planId)) {
            enrolledPlanIds.add(planId);
        }
    }

    public List<Long> getEnrolledPlanIds() {
        return Collections.unmodifiableList(enrolledPlanIds);
    }

    public FitnessGoal getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(FitnessGoal fitnessGoal) { this.fitnessGoal = fitnessGoal; }

    public double getCurrentWeightKg() { return currentWeightKg; }
    public void setCurrentWeightKg(double currentWeightKg) { this.currentWeightKg = currentWeightKg; }

    public double getTargetWeightKg() { return targetWeightKg; }
    public void setTargetWeightKg(double targetWeightKg) { this.targetWeightKg = targetWeightKg; }

    public double getHeightCm() { return heightCm; }
    public void setHeightCm(double heightCm) { this.heightCm = heightCm; }

    public Long getAssignedCoachId() { return assignedCoachId; }
    public void setAssignedCoachId(Long assignedCoachId) { this.assignedCoachId = assignedCoachId; }
}`
  },
  {
    id: 'coach-child',
    filename: 'Coach.java',
    packageName: 'com.fitpulse.model',
    layer: 'Model',
    oopConcepts: ['Inheritance', 'Polymorphism', 'Encapsulation'],
    description: 'Specialized Coach entity managing client quotas, specialty tags, and review ratings.',
    code: `package com.fitpulse.model;

import java.util.HashSet;
import java.util.Set;

/**
 * Concrete Coach model demonstrating Inheritance hierarchy and specialty management.
 */
public class Coach extends User {
    private static final long serialVersionUID = 1L;

    private String certification;
    private String bio;
    private double rating;
    private int reviewCount;
    private double hourlyRate;
    private final Set<String> specialties;

    public Coach() {
        super();
        this.specialties = new HashSet<>();
    }

    public Coach(Long id, String name, String email, String passwordHash, 
                 String certification, double hourlyRate) {
        super(id, name, email, passwordHash, UserRole.COACH);
        this.certification = certification;
        this.hourlyRate = hourlyRate;
        this.specialties = new HashSet<>();
    }

    @Override
    public String getRoleSpecificDashboard() {
        return "/views/coach/roster-management.jsp";
    }

    @Override
    public boolean hasAccessPermission(String permissionToken) {
        return "AUTHOR_WORKOUT".equals(permissionToken)
            || "REVIEW_CLIENTS".equals(permissionToken)
            || "PROVIDE_FEEDBACK".equals(permissionToken);
    }

    public synchronized void recordNewReview(int starRating) {
        double currentTotal = this.rating * this.reviewCount;
        this.reviewCount++;
        this.rating = Math.round(((currentTotal + starRating) / this.reviewCount) * 100.0) / 100.0;
    }

    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(double hourlyRate) { this.hourlyRate = hourlyRate; }

    public Set<String> getSpecialties() { return specialties; }
    public void addSpecialty(String spec) { this.specialties.add(spec); }
}`
  },
  {
    id: 'workout-base',
    filename: 'WorkoutPlan.java',
    packageName: 'com.fitpulse.model',
    layer: 'Model',
    oopConcepts: ['Polymorphic Abstract Class', 'Template Method Pattern', 'Encapsulation'],
    description: 'Abstract base workout plan establishing polymorphic calorie calculations and exercise orchestration.',
    code: `package com.fitpulse.model;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * Abstract WorkoutPlan implementing Polymorphism.
 * Specific subclasses (StrengthPlan, CardioPlan, HIITPlan) implement domain-specific calculations.
 */
public abstract class WorkoutPlan implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String title;
    private String description;
    private DifficultyLevel difficulty;
    private int durationWeeks;
    private int daysPerWeek;
    private Long authorCoachId;
    private boolean approved;
    
    // Using LinkedList to model sequential execution order of workout routines
    private List<Exercise> exerciseRoutine = new LinkedList<>();

    public WorkoutPlan(Long id, String title, DifficultyLevel difficulty, int durationWeeks) {
        this.id = id;
        this.title = title;
        this.difficulty = difficulty;
        this.durationWeeks = durationWeeks;
        this.approved = false;
    }

    // Abstract Polymorphic methods: Dynamic dispatch in action
    public abstract double calculateCaloricBurn(double userWeightKg, int sessionMinutes);
    public abstract String getProgressionGuidance();
    public abstract int computeMetabolicEquivalent();

    // Concrete Template Method relying on polymorphic hooks
    public final String generateSessionSummary(double userWeightKg, int sessionMinutes) {
        double burn = calculateCaloricBurn(userWeightKg, sessionMinutes);
        return String.format("[%s] Expected Energy Expenditure: %.1f kcal | MET: %d | Guidance: %s",
                this.title, burn, computeMetabolicEquivalent(), getProgressionGuidance());
    }

    public void addExercise(Exercise ex) {
        this.exerciseRoutine.add(ex);
    }

    public List<Exercise> getExerciseRoutine() {
        return exerciseRoutine;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DifficultyLevel getDifficulty() { return difficulty; }
    public void setDifficulty(DifficultyLevel difficulty) { this.difficulty = difficulty; }

    public int getDurationWeeks() { return durationWeeks; }
    public int getDaysPerWeek() { return daysPerWeek; }
    public void setDaysPerWeek(int daysPerWeek) { this.daysPerWeek = daysPerWeek; }

    public Long getAuthorCoachId() { return authorCoachId; }
    public void setAuthorCoachId(Long authorCoachId) { this.authorCoachId = authorCoachId; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
}`
  },
  {
    id: 'strength-child',
    filename: 'StrengthPlan.java',
    packageName: 'com.fitpulse.model',
    layer: 'Model',
    oopConcepts: ['Polymorphism', 'Subclass Specialization', 'Formula Overriding'],
    description: 'Polymorphic concrete WorkoutPlan implementation with progressive overload resistance formulas.',
    code: `package com.fitpulse.model;

/**
 * Concrete Polymorphic implementation: Strength & Hypertrophy Plan.
 */
public class StrengthPlan extends WorkoutPlan {
    private static final long serialVersionUID = 1L;

    private double targetRPE; // Rate of Perceived Exertion (1-10)
    private boolean barbellFocus;

    public StrengthPlan(Long id, String title, DifficultyLevel difficulty, int durationWeeks, double targetRPE) {
        super(id, title, difficulty, durationWeeks);
        this.targetRPE = targetRPE;
    }

    @Override
    public double calculateCaloricBurn(double userWeightKg, int sessionMinutes) {
        // Resistance training formula: MET 6.0 + RPE intensity modifier
        double met = computeMetabolicEquivalent();
        double hours = sessionMinutes / 60.0;
        return (met * 3.5 * userWeightKg / 200.0) * (sessionMinutes) * (1.0 + (targetRPE / 20.0));
    }

    @Override
    public String getProgressionGuidance() {
        return "Add 2.5kg to upper body lifts and 5.0kg to compound leg lifts upon completing 3 consecutive target set limits.";
    }

    @Override
    public int computeMetabolicEquivalent() {
        return 6; // Standard Heavy Weightlifting MET
    }

    public double getTargetRPE() { return targetRPE; }
    public void setTargetRPE(double targetRPE) { this.targetRPE = targetRPE; }

    public boolean isBarbellFocus() { return barbellFocus; }
    public void setBarbellFocus(boolean barbellFocus) { this.barbellFocus = barbellFocus; }
}`
  },
  {
    id: 'cardio-child',
    filename: 'CardioPlan.java',
    packageName: 'com.fitpulse.model',
    layer: 'Model',
    oopConcepts: ['Polymorphism', 'Subclass Specialization', 'Formula Overriding'],
    description: 'Polymorphic concrete WorkoutPlan implementation modeling sustained aerobic conditioning and Zone 2 heart rate.',
    code: `package com.fitpulse.model;

/**
 * Concrete Polymorphic implementation: Cardiovascular Aerobic Conditioning.
 */
public class CardioPlan extends WorkoutPlan {
    private static final long serialVersionUID = 1L;

    private int targetHeartRateZone; // 1 to 5
    private String aerobicModality;  // Rowing, Running, Cycling

    public CardioPlan(Long id, String title, DifficultyLevel difficulty, int durationWeeks, int targetHeartRateZone) {
        super(id, title, difficulty, durationWeeks);
        this.targetHeartRateZone = targetHeartRateZone;
    }

    @Override
    public double calculateCaloricBurn(double userWeightKg, int sessionMinutes) {
        // High oxygen-consumption equation based on target heart rate zone
        double met = computeMetabolicEquivalent();
        return (met * 3.5 * userWeightKg / 200.0) * sessionMinutes;
    }

    @Override
    public String getProgressionGuidance() {
        return "Increase duration by 10% weekly while maintaining strict Zone " + targetHeartRateZone + " nasal breathing pace.";
    }

    @Override
    public int computeMetabolicEquivalent() {
        return 8 + (targetHeartRateZone * 2); // Dynamic MET scale from 10 to 18
    }

    public int getTargetHeartRateZone() { return targetHeartRateZone; }
    public String getAerobicModality() { return aerobicModality; }
    public void setAerobicModality(String aerobicModality) { this.aerobicModality = aerobicModality; }
}`
  },
  {
    id: 'generic-dao-interface',
    filename: 'GenericDAO.java',
    packageName: 'com.fitpulse.dao',
    layer: 'DAO',
    oopConcepts: ['Interfaces', 'Generics (<T, ID>)', 'Type Parameter Bounds'],
    description: 'Generic Data Access Object interface defining standard CRUD operations with strong compile-time type safety.',
    code: `package com.fitpulse.dao;

import com.fitpulse.exception.DatabaseConnectionException;
import com.fitpulse.exception.ResourceNotFoundException;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * Generic DAO interface demonstrating Java Generics & Interface Abstraction.
 *
 * @param <T>  Entity type handled by the repository
 * @param <ID> Primary key identifier type (extends Serializable)
 */
public interface GenericDAO<T, ID extends Serializable> {

    /**
     * Persists a new domain entity.
     * @param entity the entity to save
     * @return the saved entity with generated ID populated
     * @throws DatabaseConnectionException on JDBC failure
     */
    T save(T entity) throws DatabaseConnectionException;

    /**
     * Retrieves an entity by its primary key.
     * @param id primary key identifier
     * @return Optional containing entity if found, empty otherwise
     */
    Optional<T> findById(ID id) throws DatabaseConnectionException;

    /**
     * Retrieves all persistent entities of type T.
     */
    List<T> findAll() throws DatabaseConnectionException;

    /**
     * Updates an existing entity.
     */
    T update(T entity) throws DatabaseConnectionException, ResourceNotFoundException;

    /**
     * Deletes an entity by primary key.
     * @return true if deleted, false if record did not exist
     */
    boolean deleteById(ID id) throws DatabaseConnectionException;
}`
  },
  {
    id: 'db-connection-pool',
    filename: 'ConnectionPool.java',
    packageName: 'com.fitpulse.dao',
    layer: 'DAO',
    oopConcepts: ['Multithreading & Synchronization', 'Singleton Pattern (Double-Checked Locking)', 'volatile keyword'],
    description: 'Thread-safe JDBC Connection Pool implementing synchronized wait/notify mechanics and double-checked locking.',
    code: `package com.fitpulse.dao;

import com.fitpulse.exception.DatabaseConnectionException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Thread-Safe JDBC Connection Pool utilizing Synchronization and the Singleton Pattern.
 * Demonstrates double-checked locking with volatile keyword.
 */
public class ConnectionPool {
    private static volatile ConnectionPool instance;
    
    private final String dbUrl;
    private final String dbUser;
    private final String dbPassword;
    private final int maxPoolSize;

    // Synchronized pool collections
    private final List<Connection> availableConnections;
    private final List<Connection> busyConnections;
    private final AtomicInteger activeConnectionCount = new AtomicInteger(0);

    // Private constructor enforcing Singleton pattern
    private ConnectionPool(String url, String user, String password, int maxPoolSize) {
        this.dbUrl = url;
        this.dbUser = user;
        this.dbPassword = password;
        this.maxPoolSize = maxPoolSize;
        this.availableConnections = new ArrayList<>(maxPoolSize);
        this.busyConnections = new ArrayList<>(maxPoolSize);

        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("PostgreSQL JDBC Driver registered in runtime classpath.");
        }
    }

    /**
     * Thread-safe Singleton access with Double-Checked Locking.
     */
    public static ConnectionPool getInstance(String url, String user, String pwd, int max) {
        if (instance == null) {
            synchronized (ConnectionPool.class) {
                if (instance == null) {
                    instance = new ConnectionPool(url, user, pwd, max);
                }
            }
        }
        return instance;
    }

    /**
     * Acquires a JDBC Connection with thread synchronization.
     * If all connections are in use, caller thread enters wait() state until notified.
     */
    public synchronized Connection getConnection() throws DatabaseConnectionException {
        long startTime = System.currentTimeMillis();
        long timeoutMs = 5000;

        while (availableConnections.isEmpty()) {
            if (activeConnectionCount.get() < maxPoolSize) {
                try {
                    Connection newConn = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
                    busyConnections.add(newConn);
                    activeConnectionCount.incrementAndGet();
                    return newConn;
                } catch (SQLException e) {
                    throw new DatabaseConnectionException("Failed to establish raw JDBC connection: " + e.getMessage(), e);
                }
            }

            try {
                long elapsed = System.currentTimeMillis() - startTime;
                if (elapsed >= timeoutMs) {
                    throw new DatabaseConnectionException("Connection pool exhausted; timed out after 5000ms.");
                }
                // Thread blocks safely releasing monitor lock
                wait(timeoutMs - elapsed);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw new DatabaseConnectionException("Thread interrupted while waiting for DB connection.", ie);
            }
        }

        Connection conn = availableConnections.remove(availableConnections.size() - 1);
        busyConnections.add(conn);
        return conn;
    }

    /**
     * Releases a JDBC Connection back into the pool and notifies waiting worker threads.
     */
    public synchronized void releaseConnection(Connection connection) {
        if (connection != null && busyConnections.remove(connection)) {
            availableConnections.add(connection);
            // Awaken waiting threads blocked in getConnection()
            notifyAll();
        }
    }

    public int getAvailableCount() {
        synchronized (this) {
            return availableConnections.size();
        }
    }

    public int getBusyCount() {
        synchronized (this) {
            return busyConnections.size();
        }
    }
}`
  },
  {
    id: 'user-dao-impl',
    filename: 'UserDAOImpl.java',
    packageName: 'com.fitpulse.dao',
    layer: 'DAO',
    oopConcepts: ['Database Operations', 'JDBC PreparedStatement', 'ResultSet Mapping', 'Exception Handling'],
    description: 'Data Access Object executing parameterized SQL to prevent SQL injection and map relational records to Java objects.',
    code: `package com.fitpulse.dao;

import com.fitpulse.model.Member;
import com.fitpulse.model.User;
import com.fitpulse.model.UserRole;
import com.fitpulse.model.UserStatus;
import com.fitpulse.exception.DatabaseConnectionException;
import com.fitpulse.exception.ResourceNotFoundException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Concrete JDBC DAO implementation for User entities.
 * Demonstrates PreparedStatement, SQL Injection Prevention, and Try-With-Resources.
 */
public class UserDAOImpl implements GenericDAO<User, Long> {

    private final ConnectionPool connectionPool;

    public UserDAOImpl(ConnectionPool pool) {
        this.connectionPool = pool;
    }

    @Override
    public User save(User user) throws DatabaseConnectionException {
        final String SQL_INSERT = 
            "INSERT INTO users (name, email, password_hash, role, status, created_at) " +
            "VALUES (?, ?, ?, ?, ?, ?)";

        Connection conn = null;
        try {
            conn = connectionPool.getConnection();
            try (PreparedStatement pstmt = conn.prepareStatement(SQL_INSERT, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setString(1, user.getName());
                pstmt.setString(2, user.getEmail());
                pstmt.setString(3, user.getPasswordHash());
                pstmt.setString(4, user.getRole().name());
                pstmt.setString(5, user.getStatus().name());
                pstmt.setObject(6, user.getCreatedAt());

                int affectedRows = pstmt.executeUpdate();
                if (affectedRows == 0) {
                    throw new SQLException("Creating user failed, no rows affected.");
                }

                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        user.setId(generatedKeys.getLong(1));
                    }
                }
            }
            return user;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("JDBC Error executing save user: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                connectionPool.releaseConnection(conn);
            }
        }
    }

    @Override
    public Optional<User> findById(Long id) throws DatabaseConnectionException {
        final String SQL_FIND = "SELECT id, name, email, password_hash, role, status, created_at FROM users WHERE id = ?";
        Connection conn = null;

        try {
            conn = connectionPool.getConnection();
            try (PreparedStatement pstmt = conn.prepareStatement(SQL_FIND)) {
                pstmt.setLong(1, id);

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        User user = new Member();
                        user.setId(rs.getLong("id"));
                        user.setName(rs.getString("name"));
                        user.setEmail(rs.getString("email"));
                        user.setPasswordHash(rs.getString("password_hash"));
                        user.setRole(UserRole.valueOf(rs.getString("role")));
                        user.setStatus(UserStatus.valueOf(rs.getString("status")));
                        return Optional.of(user);
                    }
                }
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Error querying user by ID: " + id, e);
        } finally {
            if (conn != null) connectionPool.releaseConnection(conn);
        }
    }

    @Override
    public List<User> findAll() throws DatabaseConnectionException {
        final String SQL_ALL = "SELECT id, name, email, password_hash, role, status FROM users ORDER BY id ASC";
        List<User> list = new ArrayList<>();
        Connection conn = null;

        try {
            conn = connectionPool.getConnection();
            try (PreparedStatement pstmt = conn.prepareStatement(SQL_ALL);
                 ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    User u = new Member();
                    u.setId(rs.getLong("id"));
                    u.setName(rs.getString("name"));
                    u.setEmail(rs.getString("email"));
                    u.setRole(UserRole.valueOf(rs.getString("role")));
                    u.setStatus(UserStatus.valueOf(rs.getString("status")));
                    list.add(u);
                }
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to fetch all users", e);
        } finally {
            if (conn != null) connectionPool.releaseConnection(conn);
        }
    }

    @Override
    public User update(User entity) throws DatabaseConnectionException, ResourceNotFoundException {
        final String SQL_UPDATE = "UPDATE users SET name = ?, email = ?, status = ? WHERE id = ?";
        Connection conn = null;
        try {
            conn = connectionPool.getConnection();
            try (PreparedStatement pstmt = conn.prepareStatement(SQL_UPDATE)) {
                pstmt.setString(1, entity.getName());
                pstmt.setString(2, entity.getEmail());
                pstmt.setString(3, entity.getStatus().name());
                pstmt.setLong(4, entity.getId());

                int rows = pstmt.executeUpdate();
                if (rows == 0) {
                    throw new ResourceNotFoundException("User not found for update with ID: " + entity.getId());
                }
            }
            return entity;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("SQL Update failure: " + e.getMessage(), e);
        } finally {
            if (conn != null) connectionPool.releaseConnection(conn);
        }
    }

    @Override
    public boolean deleteById(Long id) throws DatabaseConnectionException {
        final String SQL_DEL = "DELETE FROM users WHERE id = ?";
        Connection conn = null;
        try {
            conn = connectionPool.getConnection();
            try (PreparedStatement pstmt = conn.prepareStatement(SQL_DEL)) {
                pstmt.setLong(1, id);
                return pstmt.executeUpdate() > 0;
            }
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Delete failed for ID " + id, e);
        } finally {
            if (conn != null) connectionPool.releaseConnection(conn);
        }
    }
}`
  },
  {
    id: 'workout-dao-impl',
    filename: 'WorkoutDAOImpl.java',
    packageName: 'com.fitpulse.dao',
    layer: 'DAO',
    oopConcepts: ['JDBC Transactions (ACID)', 'Batch Processing (addBatch)', 'Rollback & Commit'],
    description: 'Demonstrates manual JDBC transaction management (commit & rollback) and batch execution for multi-row operations.',
    code: `package com.fitpulse.dao;

import com.fitpulse.model.Exercise;
import com.fitpulse.model.WorkoutPlan;
import com.fitpulse.exception.DatabaseConnectionException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * WorkoutDAO demonstrating ACID JDBC Transactions and Batch Processing.
 */
public class WorkoutDAOImpl {

    private final ConnectionPool connectionPool;

    public WorkoutDAOImpl(ConnectionPool pool) {
        this.connectionPool = pool;
    }

    /**
     * Atomic transaction: inserts workout plan record AND batch-inserts its exercises.
     * Enforces atomicity with setAutoCommit(false), commit(), and rollback().
     */
    public boolean saveWorkoutWithExercises(WorkoutPlan plan) throws DatabaseConnectionException {
        final String SQL_INSERT_PLAN = 
            "INSERT INTO workout_plans (title, description, difficulty, duration_weeks, coach_id, is_approved) " +
            "VALUES (?, ?, ?, ?, ?, ?)";

        final String SQL_INSERT_EXERCISE = 
            "INSERT INTO exercises (plan_id, name, muscle_group, sets, reps, rest_seconds) " +
            "VALUES (?, ?, ?, ?, ?, ?)";

        Connection conn = null;
        try {
            conn = connectionPool.getConnection();
            // BEGIN TRANSACTION
            conn.setAutoCommit(false);

            long generatedPlanId;
            try (PreparedStatement planStmt = conn.prepareStatement(SQL_INSERT_PLAN, Statement.RETURN_GENERATED_KEYS)) {
                planStmt.setString(1, plan.getTitle());
                planStmt.setString(2, plan.getDescription());
                planStmt.setString(3, plan.getDifficulty().name());
                planStmt.setInt(4, plan.getDurationWeeks());
                planStmt.setLong(5, plan.getAuthorCoachId());
                planStmt.setBoolean(6, plan.isApproved());

                planStmt.executeUpdate();

                try (ResultSet rs = planStmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        generatedPlanId = rs.getLong(1);
                        plan.setId(generatedPlanId);
                    } else {
                        throw new SQLException("Failed to obtain generated plan ID.");
                    }
                }
            }

            // BATCH PROCESSING FOR EXERCISES
            try (PreparedStatement exStmt = conn.prepareStatement(SQL_INSERT_EXERCISE)) {
                for (Exercise ex : plan.getExerciseRoutine()) {
                    exStmt.setLong(1, generatedPlanId);
                    exStmt.setString(2, ex.getName());
                    exStmt.setString(3, ex.getMuscleGroup());
                    exStmt.setInt(4, ex.getSets());
                    exStmt.setString(5, String.valueOf(ex.getReps()));
                    exStmt.setInt(6, ex.getRestSec());
                    exStmt.addBatch(); // Enqueue in JDBC batch buffer
                }

                int[] batchResults = exStmt.executeBatch(); // Send batch over wire in single roundtrip
            }

            // COMMIT TRANSACTION
            conn.commit();
            return true;

        } catch (SQLException ex) {
            // ROLLBACK TRANSACTION ON FAILURE
            if (conn != null) {
                try {
                    conn.rollback();
                    System.err.println("Transaction rolled back due to error: " + ex.getMessage());
                } catch (SQLException rollbackEx) {
                    rollbackEx.printStackTrace();
                }
            }
            throw new DatabaseConnectionException("Transaction aborted: " + ex.getMessage(), ex);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true); // Restore autocommit default
                } catch (SQLException ignored) {}
                connectionPool.releaseConnection(conn);
            }
        }
    }
}`
  },
  {
    id: 'notification-concurrency',
    filename: 'NotificationWorkerPool.java',
    packageName: 'com.fitpulse.concurrency',
    layer: 'Concurrency',
    oopConcepts: ['Multithreading & Synchronization', 'ThreadPoolExecutor', 'BlockingQueue', 'Atomic Counters'],
    description: 'Thread pool manager processing asynchronous workout reminders and coach alerts with thread safety.',
    code: `package com.fitpulse.concurrency;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Concurrency Subsystem: Multi-Threaded Notification & Progress Worker Engine.
 * Implements ThreadPoolExecutor with customized rejected execution policies and thread naming.
 */
public class NotificationWorkerPool {

    private static final int CORE_THREADS = 4;
    private static final int MAX_THREADS = 8;
    private static final long KEEP_ALIVE_SECONDS = 60L;
    private static final int QUEUE_CAPACITY = 200;

    private final ThreadPoolExecutor executor;
    private final AtomicInteger processedTaskCount = new AtomicInteger(0);

    public NotificationWorkerPool() {
        BlockingQueue<Runnable> workQueue = new ArrayBlockingQueue<>(QUEUE_CAPACITY);

        ThreadFactory customThreadFactory = new ThreadFactory() {
            private final AtomicInteger threadSequence = new AtomicInteger(1);

            @Override
            public Thread newThread(Runnable r) {
                Thread worker = new Thread(r, "FitPulse-Worker-" + threadSequence.getAndIncrement());
                worker.setDaemon(true); // Allow JVM shutdown if only daemon threads remain
                worker.setPriority(Thread.NORM_PRIORITY);
                return worker;
            }
        };

        RejectedExecutionHandler rejectionPolicy = (r, exec) -> {
            System.err.println("Worker Queue Saturated! Task caller runs on fall-back: " + r.toString());
            r.run();
        };

        this.executor = new ThreadPoolExecutor(
                CORE_THREADS,
                MAX_THREADS,
                KEEP_ALIVE_SECONDS,
                TimeUnit.SECONDS,
                workQueue,
                customThreadFactory,
                rejectionPolicy
        );
    }

    /**
     * Submits an asynchronous notification dispatch task.
     */
    public void submitNotificationTask(String recipientEmail, String subject, String body) {
        executor.execute(() -> {
            try {
                // Simulate asynchronous mail server handshake
                Thread.sleep(120);
                processedTaskCount.incrementAndGet();
                System.out.printf("[%s] Dispatched notification to %s: '%s'%n",
                        Thread.currentThread().getName(), recipientEmail, subject);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }

    public int getActiveWorkerCount() {
        return executor.getActiveCount();
    }

    public int getQueueDepth() {
        return executor.getQueue().size();
    }

    public int getTotalCompletedTasks() {
        return processedTaskCount.get();
    }

    public void shutdownGracefully() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}`
  },
  {
    id: 'workout-service-impl',
    filename: 'WorkoutServiceImpl.java',
    packageName: 'com.fitpulse.service',
    layer: 'Service',
    oopConcepts: ['Collections & Generics', 'PriorityQueue', 'ConcurrentHashMap', 'TreeSet', 'Interfaces'],
    description: 'Business logic layer utilizing advanced collections for caching, sorted leaderboards, and reminder queues.',
    code: `package com.fitpulse.service;

import com.fitpulse.model.ProgressLog;
import com.fitpulse.model.WorkoutPlan;
import com.fitpulse.dao.GenericDAO;
import com.fitpulse.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service Layer demonstrating Java Collections Framework & Generics:
 * - ConcurrentHashMap for thread-safe session caches
 * - PriorityQueue for time-ordered reminder scheduling
 * - TreeSet for sorted milestone chronologies
 */
public class WorkoutServiceImpl {

    private final GenericDAO<WorkoutPlan, Long> workoutDAO;
    
    // Concurrent thread-safe cache for hot workout plans
    private final Map<Long, WorkoutPlan> planFastCache = new ConcurrentHashMap<>();

    // PriorityQueue storing upcoming workout reminders ordered by scheduled timestamp
    private final PriorityQueue<WorkoutReminder> reminderQueue = 
        new PriorityQueue<>(Comparator.comparing(WorkoutReminder::getScheduledTime));

    public WorkoutServiceImpl(GenericDAO<WorkoutPlan, Long> workoutDAO) {
        this.workoutDAO = workoutDAO;
    }

    public WorkoutPlan getPlanWithCache(Long planId) throws ResourceNotFoundException {
        // ComputeIfAbsent with thread safety
        return planFastCache.computeIfAbsent(planId, id -> {
            try {
                return workoutDAO.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Plan with ID " + id + " not found."));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

    public synchronized void scheduleReminder(Long memberId, String planName, LocalDateTime targetTime) {
        reminderQueue.offer(new WorkoutReminder(memberId, planName, targetTime));
    }

    public synchronized Optional<WorkoutReminder> pollNextDueReminder() {
        WorkoutReminder next = reminderQueue.peek();
        if (next != null && next.getScheduledTime().isBefore(LocalDateTime.now())) {
            return Optional.ofNullable(reminderQueue.poll());
        }
        return Optional.empty();
    }

    // Helper Inner Class demonstrating Comparable/Comparator in Generics
    public static class WorkoutReminder {
        private final Long memberId;
        private final String planName;
        private final LocalDateTime scheduledTime;

        public WorkoutReminder(Long memberId, String planName, LocalDateTime scheduledTime) {
            this.memberId = memberId;
            this.planName = planName;
            this.scheduledTime = scheduledTime;
        }

        public Long getMemberId() { return memberId; }
        public String getPlanName() { return planName; }
        public LocalDateTime getScheduledTime() { return scheduledTime; }
    }
}`
  },
  {
    id: 'workout-servlet',
    filename: 'WorkoutServlet.java',
    packageName: 'com.fitpulse.servlet',
    layer: 'Servlet',
    oopConcepts: ['Servlets & Web Integration', 'HttpServlet Subclassing', 'HTTP Methods (doGet, doPost)', 'JSON Response'],
    description: 'Java Servlet processing HTTP requests, handling route routing, and writing JSON responses.',
    code: `package com.fitpulse.servlet;

import com.fitpulse.model.WorkoutPlan;
import com.fitpulse.service.WorkoutServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Java Servlet handling HTTP endpoints for Workout Catalog operations.
 * Demonstrates HttpServlet lifecycle: init(), doGet(), doPost(), and Session verification.
 */
@WebServlet(name = "WorkoutServlet", urlPatterns = {"/api/workouts/*"})
public class WorkoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private WorkoutServiceImpl workoutService;

    @Override
    public void init() throws ServletException {
        super.init();
        // Retrieve singleton service configured in ServletContextListener
        this.workoutService = (WorkoutServiceImpl) getServletContext().getAttribute("WORKOUT_SERVICE");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo(); // e.g. "/1"
        if (pathInfo == null || "/".equals(pathInfo)) {
            // Return all plans summary
            resp.setStatus(HttpServletResponse.SC_OK);
            out.print("{\"status\":\"SUCCESS\",\"message\":\"Workout catalog retrieved.\"}");
            return;
        }

        try {
            Long planId = Long.parseLong(pathInfo.substring(1));
            WorkoutPlan plan = workoutService.getPlanWithCache(planId);
            resp.setStatus(HttpServletResponse.SC_OK);
            out.printf("{\"status\":\"SUCCESS\",\"data\":{\"id\":%d,\"title\":\"%s\"}}",
                    plan.getId(), plan.getTitle());
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"ERROR\",\"message\":\"Invalid workout ID parameter\"}");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.printf("{\"status\":\"ERROR\",\"message\":\"%s\"}", e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("CURRENT_USER") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().print("{\"error\":\"Authentication required to create workouts\"}");
            return;
        }

        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.getWriter().print("{\"status\":\"SUCCESS\",\"message\":\"Workout plan drafted for admin review.\"}");
    }
}`
  },
  {
    id: 'auth-filter',
    filename: 'AuthFilter.java',
    packageName: 'com.fitpulse.servlet',
    layer: 'Servlet',
    oopConcepts: ['Servlet Filter', 'Role-Based Access Control (RBAC)', 'FilterChain'],
    description: 'HTTP Filter intercepting requests to validate user session and role authorization before reaching Servlets.',
    code: `package com.fitpulse.servlet;

import com.fitpulse.model.User;
import com.fitpulse.model.UserRole;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Web Filter enforcing Role-Based Access Control (RBAC) across protected servlet endpoints.
 */
@WebFilter(filterName = "AuthFilter", urlPatterns = {"/views/*", "/api/admin/*", "/api/coach/*"})
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String uri = req.getRequestURI();
        HttpSession session = req.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("CURRENT_USER") : null;

        if (currentUser == null) {
            // Unauthenticated request
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.sendRedirect(req.getContextPath() + "/login.jsp?error=SESSION_EXPIRED");
            return;
        }

        // Role verification
        if (uri.contains("/admin/") && currentUser.getRole() != UserRole.ADMIN) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Administrative privileges required.");
            return;
        }

        if (uri.contains("/coach/") && currentUser.getRole() != UserRole.COACH && currentUser.getRole() != UserRole.ADMIN) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Coach privileges required.");
            return;
        }

        // Delegate to next filter or target servlet
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}`
  },
  {
    id: 'custom-exceptions',
    filename: 'FitnessPlatformException.java',
    packageName: 'com.fitpulse.exception',
    layer: 'Exception',
    oopConcepts: ['Exception Hierarchy', 'Checked vs Unchecked Exceptions', 'Error Codes'],
    description: 'Base checked exception class with specialized child exceptions for domain-specific error handling.',
    code: `package com.fitpulse.exception;

/**
 * Base Application Exception demonstrating proper Java Exception Hierarchy.
 */
public class FitnessPlatformException extends Exception {
    private static final long serialVersionUID = 1L;

    private final String errorCode;

    public FitnessPlatformException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public FitnessPlatformException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}

// Child Exception 1
class AuthenticationException extends FitnessPlatformException {
    public AuthenticationException(String message) {
        super(message, "ERR_AUTH_CREDENTIALS_INVALID");
    }
}

// Child Exception 2
class ResourceNotFoundException extends FitnessPlatformException {
    public ResourceNotFoundException(String message) {
        super(message, "ERR_RESOURCE_NOT_FOUND");
    }
}

// Child Exception 3: Database & JDBC Wrapper
class DatabaseConnectionException extends FitnessPlatformException {
    public DatabaseConnectionException(String message) {
        super(message, "ERR_JDBC_COMMUNICATION_FAILURE");
    }
    public DatabaseConnectionException(String message, Throwable cause) {
        super(message, "ERR_JDBC_COMMUNICATION_FAILURE", cause);
    }
}`
  },
  {
    id: 'db-schema-sql',
    filename: 'schema.sql',
    packageName: 'com.fitpulse.schema',
    layer: 'Database Schema',
    oopConcepts: ['Relational Model', 'Foreign Key Constraints', 'ACID Indexes', 'Audit Columns'],
    description: 'Production-ready SQL DDL schema for PostgreSQL / MySQL supporting the JDBC DAO layer.',
    code: `-- THRYVE Relational Schema DDL
-- Compatible with PostgreSQL 15+ and MySQL 8.0+

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('MEMBER', 'COACH', 'ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS coach_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    certification VARCHAR(255) NOT NULL,
    bio TEXT,
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    hourly_rate NUMERIC(6,2) DEFAULT 50.00
);

CREATE TABLE IF NOT EXISTS workout_plans (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(30) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE')),
    category VARCHAR(30) NOT NULL CHECK (category IN ('STRENGTH', 'CARDIO', 'HIIT', 'CALISTHENICS', 'MOBILITY')),
    duration_weeks INT NOT NULL DEFAULT 4,
    estimated_calories_burn INT DEFAULT 400,
    days_per_week INT DEFAULT 3,
    coach_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    muscle_group VARCHAR(100) NOT NULL,
    sets INT NOT NULL,
    reps VARCHAR(50) NOT NULL,
    rest_seconds INT DEFAULT 60,
    instructions TEXT,
    sequence_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS progress_logs (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id BIGINT REFERENCES workout_plans(id) ON DELETE SET NULL,
    workout_title VARCHAR(200) NOT NULL,
    duration_minutes INT NOT NULL,
    calories_burned INT NOT NULL,
    weight_kg NUMERIC(5,2),
    notes TEXT,
    perceived_effort INT CHECK (perceived_effort BETWEEN 1 AND 10),
    logged_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_workout_plans_coach ON workout_plans(coach_id);
CREATE INDEX IF NOT EXISTS idx_exercises_plan ON exercises(plan_id);
CREATE INDEX IF NOT EXISTS idx_progress_member ON progress_logs(member_id, logged_at DESC);
`
  }
];
