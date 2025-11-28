// app/learning/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  level: string;
  explanation: string;
  syntax?: string;
  example: string;
  hint?: string;
  note?: string;
  open?: boolean;
}

export default function LearningPage() {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Lesson 1 — CREATE TABLE (creating tables)",
      level: "Beginner",
      explanation: "CREATE TABLE defines a new table with columns, data types, and constraints. Decide column names and data types before inserting data.",
      syntax: `CREATE TABLE table_name (
  column1 DATATYPE [CONSTRAINTS],
  column2 DATATYPE [CONSTRAINTS],
  ...
);`,
      example: `CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name TEXT NOT NULL UNIQUE
);`,
      hint: "Tip: In SQLite, INTEGER PRIMARY KEY behaves like AUTO-INCREMENT when omitted on insert.",
      open: true
    },
    {
      id: 2,
      title: "Lesson 2 — Data Types & Constraints",
      level: "Beginner",
      explanation: "Choose data types (INTEGER, REAL, TEXT, BLOB). Use constraints to ensure integrity: NOT NULL, UNIQUE, PRIMARY KEY, CHECK, FOREIGN KEY.",
      syntax: `column_name DATATYPE NOT NULL UNIQUE DEFAULT 0 CHECK(column_name >= 0)`,
      example: `CREATE TABLE students (
  student_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  semester INTEGER CHECK(semester BETWEEN 1 AND 8),
  marks INTEGER DEFAULT 0,
  department TEXT
);`
    },
    {
      id: 3,
      title: "Lesson 3 — INSERT (adding rows)",
      level: "Beginner",
      explanation: "INSERT INTO adds rows to a table. You can insert single or multiple rows in one statement (if DB supports it).",
      syntax: `INSERT INTO table_name (col1, col2, ...)
VALUES (val1, val2, ...);

-- Multiple rows (SQLite supports multi-row INSERT)
INSERT INTO table_name (col1, col2) VALUES (v1a, v2a), (v1b, v2b);`,
      example: `INSERT INTO departments (dept_id, dept_name) VALUES (6, 'R&D');
INSERT INTO students (student_id, name, semester, marks, department)
VALUES (10, 'Asha', 4, 82, 'IT');`,
      hint: "Note: For this demo server most write operations are purposely discouraged/blocked. Use examples for learning and run SELECTs on practice."
    },
    {
      id: 4,
      title: "Lesson 4 — SELECT (reading data)",
      level: "Beginner → Intermediate",
      explanation: "Use SELECT to retrieve columns and rows. Combine with WHERE, ORDER BY, LIMIT.",
      syntax: `SELECT column1, column2
FROM table_name
WHERE condition
GROUP BY column
HAVING aggregate_condition
ORDER BY column ASC|DESC
LIMIT n;`,
      example: `SELECT name, salary FROM employees WHERE salary > 60000 ORDER BY salary DESC LIMIT 10;`,
      hint: "Tip: Use SELECT * to retrieve all columns during exploration, but prefer explicit columns in production."
    },
    {
      id: 5,
      title: "Lesson 5 — WHERE (filtering & pattern matching)",
      level: "Beginner",
      explanation: "WHERE filters rows using comparison operators, logical operators, IN, BETWEEN, and LIKE for patterns.",
      example: `-- Range
SELECT * FROM students WHERE marks BETWEEN 70 AND 90;

-- Pattern
SELECT name FROM employees WHERE name LIKE 'A%';

-- Multiple values
SELECT name FROM employees WHERE dept_id IN (1,2);`
    },
    {
      id: 6,
      title: "Lesson 6 — JOINS (combining related tables)",
      level: "Intermediate",
      explanation: "JOINs let you combine rows from two or more tables using keys. Common joins: INNER, LEFT (LEFT OUTER), RIGHT (not native in SQLite), and FULL (emulated).",
      example: `SELECT e.name, e.salary, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
ORDER BY e.salary DESC;`,
      hint: "Note: Use JOINs when querying related data (e.g., employee + department)."
    },
    {
      id: 7,
      title: "Lesson 7 — GROUP BY & HAVING (aggregations)",
      level: "Intermediate",
      explanation: "Use aggregate functions (COUNT, SUM, AVG, MIN, MAX) with GROUP BY to summarize data. Use HAVING to filter groups.",
      example: `SELECT d.dept_name AS department, ROUND(AVG(e.salary),2) AS avg_salary, COUNT(e.emp_id) AS emp_count
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
GROUP BY d.dept_name
HAVING AVG(e.salary) > 60000
ORDER BY avg_salary DESC;`
    },
    {
      id: 8,
      title: "Lesson 8 — Subqueries (nested SELECTs)",
      level: "Intermediate",
      explanation: "Subqueries are SELECT statements inside another query (in WHERE, FROM, or SELECT). They help express complex logic.",
      example: `-- Employees with salary above average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);`
    },
    {
      id: 9,
      title: "Lesson 9 — VIEWS (virtual tables)",
      level: "Intermediate",
      explanation: "A VIEW is a saved SELECT that behaves like a virtual table. Use it to simplify repetitive queries or expose safe subsets.",
      syntax: `CREATE VIEW view_name AS
SELECT ... FROM ... WHERE ...;`,
      example: `CREATE VIEW emp_with_dept AS
SELECT e.emp_id, e.name, e.salary, d.dept_name
FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id;`
    },
    {
      id: 10,
      title: "Lesson 10 — INDEX (performance)",
      level: "Intermediate",
      explanation: "Indexes speed up searches on columns used often in WHERE or JOIN. They trade off faster reads for slower writes (inserts/updates).",
      example: `CREATE INDEX idx_emp_city ON employees(city);
CREATE INDEX idx_emp_dept ON employees(dept_id);`,
      hint: "Tip: Index foreign keys and large-text search columns you query frequently."
    },
    {
      id: 11,
      title: "Lesson 11 — Transactions (atomic operations)",
      level: "Advanced",
      explanation: "Transactions ensure a group of statements succeed together or not at all (atomicity). Use BEGIN, COMMIT, ROLLBACK.",
      example: `BEGIN TRANSACTION;
UPDATE employees SET salary = salary + 5000 WHERE dept_id = 1;
COMMIT;`,
      hint: "Note: On the demo server ALTER/WRITE operations may be disallowed. Use examples for learning."
    },
    {
      id: 12,
      title: "Lesson 12 — UPDATE & DELETE",
      level: "Advanced",
      explanation: "UPDATE modifies existing rows; DELETE removes rows. Always use WHERE to avoid changing entire tables unintentionally.",
      example: `-- Increase salary by 5% for a department
UPDATE employees SET salary = CAST(salary * 1.05 AS INTEGER) WHERE dept_id = 1;

-- Delete failing students
DELETE FROM students WHERE marks < 40;`,
      hint: "Best practice: Wrap multi-row updates in transactions and backup data first."
    },
    {
      id: 13,
      title: "Lesson 13 — Normalization (design principles)",
      level: "Design",
      explanation: "Normalization reduces redundancy by organizing data into multiple related tables (1NF, 2NF, 3NF). Keep single-purpose tables and use foreign keys.",
      example: "Example: Keep employees and departments in separate tables and link via dept_id."
    },
    {
      id: 14,
      title: "Lesson 14 — Parameterized / Prepared Statements",
      level: "Security",
      explanation: "Use parameterized queries in server code to avoid SQL injection. Never concatenate raw user input into SQL.",
      example: `// db is sqlite3.Database
db.all("SELECT name, salary FROM employees WHERE salary > ?", [50000], (err, rows) => {
  // rows returned
});`,
      hint: "Never directly interpolate user strings in SQL."
    },
    {
      id: 15,
      title: "Lesson 15 — CTEs (WITH) & Window Functions",
      level: "Advanced",
      explanation: "CTEs (WITH) make complex queries readable. Window functions allow computations across rows (ROW_NUMBER, RANK, SUM() OVER ...).",
      example: `WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id
)
SELECT e.name, e.salary, d.dept_name
FROM employees e
JOIN dept_avg da ON e.dept_id = da.dept_id
JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary > da.avg_sal;`,
      note: "Window function quick example (SQLite 3.25+):\nSELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM employees;"
    },
    {
      id: 16,
      title: "Lesson 16 — CREATE TRIGGER (audit, validation)",
      level: "Advanced",
      explanation: "Triggers run automatically on table events (INSERT, UPDATE, DELETE). Use them for audit logs, enforcement, or maintaining summary tables.",
      example: `CREATE TABLE employees_audit (
  audit_id INTEGER PRIMARY KEY,
  emp_id INTEGER,
  old_salary INTEGER,
  new_salary INTEGER,
  changed_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_emp_salary_update
AFTER UPDATE OF salary ON employees
FOR EACH ROW
BEGIN
  INSERT INTO employees_audit (emp_id, old_salary, new_salary)
  VALUES (OLD.emp_id, OLD.salary, NEW.salary);
END;`,
      hint: "Quick: Use OLD and NEW to access rows inside triggers. Use RAISE(ABORT,'msg') to stop unsafe operations."
    },
    {
      id: 17,
      title: "Lesson 17 — Best Practices & Checklist",
      level: "Summary",
      explanation: "SQL development best practices and guidelines.",
      example: `• Validate and sanitize all user input; use parameterized queries.
• Design normalized tables to avoid redundancy.
• Use indexes where appropriate; monitor write performance.
• Prefer explicit column lists in SELECTs in production.
• Use transactions for multi-step changes.
• Document views and triggers carefully.`,
      hint: "After finishing lessons, practice the examples on the Practice page and try the Quiz for knowledge checks."
    }
  ]);

  const toggleLesson = (id: number) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, open: !lesson.open } : lesson
    ));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (fallbackErr) {
        console.error('Copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "Beginner": return "default";
      case "Intermediate": return "secondary";
      case "Advanced": return "destructive";
      case "Design": return "outline";
      case "Security": return "outline";
      case "Summary": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">
              SQL Lessons — Step-by-step
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Each lesson below contains: <strong>explanation</strong>, <strong>syntax</strong>, and a working <strong>example</strong>. Use the copy button to copy examples, then go to <Link href="/practice" className="text-blue-600 hover:underline">Practice</Link> to run them.
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className={`border-l-4 ${lesson.open ? 'border-l-blue-600' : 'border-l-transparent'}`}>
              <CardHeader 
                className="cursor-pointer pb-3" 
                onClick={() => toggleLesson(lesson.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {lesson.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getLevelVariant(lesson.level) as any}>
                      {lesson.level}
                    </Badge>
                    {lesson.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </CardHeader>
              
              {lesson.open && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <strong>Explanation:</strong> {lesson.explanation}
                    </p>

                    {lesson.syntax && (
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-2">Syntax</div>
                        <pre className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm overflow-x-auto">
                          {lesson.syntax}
                        </pre>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">Example</div>
                      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-x-auto">
                        {lesson.example}
                      </pre>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(lesson.example)}
                          className="flex items-center gap-1"
                        >
                          <Copy size={14} />
                          Copy example
                        </Button>
                        <Button asChild size="sm">
                          <Link href="/practice">
                            Try in Practice
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {lesson.hint && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="text-sm text-yellow-800">{lesson.hint}</div>
                      </div>
                    )}

                    {lesson.note && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{lesson.note}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="flex gap-4 mt-8 justify-center">
          <Button asChild size="lg">
            <Link href="/practice">Go to Practice</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/quiz">Open Quiz</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}