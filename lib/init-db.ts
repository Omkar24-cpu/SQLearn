// scripts/init-db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function initDatabase() {
  const dbPath = path.join(process.cwd(), 'app.db');
  
  // Remove existing database file
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = new Database(dbPath);

  try {
    // Your existing schema and data
    db.exec(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS employee_projects;
      DROP TABLE IF EXISTS projects;
      DROP TABLE IF EXISTS employees;
      DROP TABLE IF EXISTS departments;
      DROP TABLE IF EXISTS students;
      PRAGMA foreign_keys = ON;

      CREATE TABLE departments (
        dept_id INTEGER PRIMARY KEY,
        dept_name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE employees (
        emp_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        gender TEXT,
        salary INTEGER NOT NULL,
        dept_id INTEGER,
        join_date TEXT,
        email TEXT,
        city TEXT,
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
      );

      CREATE TABLE projects (
        proj_id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        budget INTEGER,
        start_date TEXT,
        end_date TEXT
      );

      CREATE TABLE employee_projects (
        id INTEGER PRIMARY KEY,
        emp_id INTEGER,
        proj_id INTEGER,
        role TEXT,
        hours_per_week INTEGER,
        FOREIGN KEY(emp_id) REFERENCES employees(emp_id),
        FOREIGN KEY(proj_id) REFERENCES projects(proj_id)
      );

      CREATE TABLE students (
        student_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        semester INTEGER,
        marks INTEGER,
        department TEXT
      );
    `);

    // Insert departments
    const deptInsert = db.prepare("INSERT INTO departments (dept_id, dept_name) VALUES (?, ?)");
    const depts = [
      [1, 'Engineering'],
      [2, 'Sales'],
      [3, 'Marketing'],
      [4, 'Support'],
      [5, 'HR']
    ];
    depts.forEach(r => deptInsert.run(...r));

    // Insert employees
    const empInsert = db.prepare("INSERT INTO employees (emp_id, name, gender, salary, dept_id, join_date, email, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    const emps = [
      [101, 'Ramesh Kumar', 'M', 60000, 2, '2019-02-12', 'ramesh.kumar@example.com', 'Pune'],
      [102, 'Suresh Patil', 'M', 80000, 1, '2018-06-01', 'suresh.patil@example.com', 'Mumbai'],
      [103, 'Priya Sharma', 'F', 48000, 4, '2020-09-15', 'priya.sharma@example.com', 'Pune'],
      [104, 'Anita Desai', 'F', 52000, 3, '2021-03-20', 'anita.desai@example.com', 'Nagpur'],
      [105, 'Rahul Singh', 'M', 72000, 1, '2017-11-05', 'rahul.singh@example.com', 'Pune'],
      [106, 'Kavita Joshi', 'F', 55000, 3, '2022-01-10', 'kavita.joshi@example.com', 'Mumbai'],
      [107, 'Vikram Rao', 'M', 95000, 1, '2015-07-22', 'vikram.rao@example.com', 'Bengaluru'],
      [108, 'Neha Kulkarni', 'F', 47000, 2, '2023-02-01', 'neha.k@example.com', 'Pune'],
      [109, 'Amit Mehra', 'M', 61000, 2, '2019-12-12', 'amit.mehra@example.com', 'Delhi'],
      [110, 'Sunita Nair', 'F', 88000, 1, '2016-08-19', 'sunita.nair@example.com', 'Chennai'],
      [111, 'Kiran Patil', 'M', 43000, 4, '2020-07-07', 'kiran.patil@example.com', 'Pune'],
      [112, 'Sana Khan', 'F', 66000, 5, '2018-04-04', 'sana.khan@example.com', 'Mumbai'],
      [113, 'Manish Gupta', 'M', 71000, 1, '2017-10-13', 'manish.gupta@example.com', 'Noida'],
      [114, 'Meera Rao', 'F', 58000, 3, '2019-03-25', 'meera.rao@example.com', 'Hyderabad'],
      [115, 'Aditya Verma', 'M', 54000, 4, '2021-12-01', 'aditya.verma@example.com', 'Pune'],
      [116, 'Divya Singh', 'F', 67000, 1, '2016-01-15', 'divya.singh@example.com', 'Mumbai'],
      [117, 'Kunal Shah', 'M', 46000, 2, '2022-06-21', 'kunal.shah@example.com', 'Surat'],
      [118, 'Pooja Kapoor', 'F', 49000, 5, '2020-05-11', 'pooja.kapoor@example.com', 'Lucknow'],
      [119, 'Rohit N', 'M', 53000, 3, '2019-09-09', 'rohit.n@example.com', 'Bengaluru'],
      [120, 'Siddharth T', 'M', 87000, 1, '2014-02-02', 'siddharth.t@example.com', 'Pune']
    ];
    emps.forEach(r => empInsert.run(...r));

    // Insert projects
    const projInsert = db.prepare("INSERT INTO projects (proj_id, title, budget, start_date, end_date) VALUES (?, ?, ?, ?, ?)");
    const projs = [
      [1, 'Website Revamp', 120000, '2023-01-01', '2023-06-30'],
      [2, 'Mobile App', 250000, '2022-05-01', '2023-05-01'],
      [3, 'Cloud Migration', 500000, '2021-09-01', '2022-12-31'],
      [4, 'Sales Automation', 80000, '2023-03-15', '2023-12-31'],
      [5, 'Marketing Campaign 2024', 150000, '2024-01-10', '2024-04-30']
    ];
    projs.forEach(r => projInsert.run(...r));

    // Insert employee_projects
    const epInsert = db.prepare("INSERT INTO employee_projects (id, emp_id, proj_id, role, hours_per_week) VALUES (?, ?, ?, ?, ?)");
    const ep = [
      [1, 102, 1, 'Lead', 20],
      [2, 105, 2, 'Manager', 25],
      [3, 107, 3, 'Architect', 15],
      [4, 101, 4, 'Sales Lead', 10],
      [5, 110, 2, 'QA', 15],
      [6, 116, 3, 'Dev', 30],
      [7, 113, 1, 'DevOps', 12],
      [8, 114, 5, 'Marketing', 18],
      [9, 106, 5, 'Designer', 12],
      [10, 120, 3, 'Senior Dev', 20]
    ];
    ep.forEach(r => epInsert.run(...r));

    // Insert students
    const studentInsert = db.prepare("INSERT INTO students (student_id, name, semester, marks, department) VALUES (?, ?, ?, ?, ?)");
    const studs = [
      [1, 'Ram', 4, 78, 'Comp Engg'],
      [2, 'Sunita', 6, 92, 'IT'],
      [3, 'Kiran', 2, 86, 'Comp Engg'],
      [4, 'Mansi', 8, 69, 'Civil'],
      [5, 'Deepak', 4, 55, 'Mech'],
      [6, 'Suhana', 6, 89, 'IT'],
      [7, 'Ishan', 2, 74, 'Comp Engg']
    ];
    studs.forEach(r => studentInsert.run(...r));

    console.log('Database initialized and seeded: app.db');
    console.log('Tables created: departments, employees, projects, employee_projects, students');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };