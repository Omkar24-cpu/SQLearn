// app/quiz/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  id: number;
  title: string;
  level: string;
  description: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "SQL Basics & SELECT",
      level: "Beginner",
      description: "Fundamental SQL queries and SELECT statements"
    },
    {
      id: 2,
      title: "WHERE Clause & Filtering",
      level: "Beginner",
      description: "Filtering data with WHERE, operators, and conditions"
    },
    {
      id: 3,
      title: "JOINs & Relationships",
      level: "Intermediate",
      description: "Combining tables with different JOIN types"
    },
    {
      id: 4,
      title: "Aggregate Functions",
      level: "Intermediate",
      description: "GROUP BY, HAVING, and aggregate functions"
    },
    {
      id: 5,
      title: "Subqueries & Advanced SQL",
      level: "Advanced",
      description: "Nested queries and advanced SQL features"
    },
    {
      id: 6,
      title: "Data Modification",
      level: "Intermediate",
      description: "INSERT, UPDATE, DELETE operations"
    }
  ];

  const questions: Record<number, Question[]> = {
    1: [
      {
        id: 1,
        question: "Which SQL keyword is used to retrieve data from a database?",
        options: ["GET", "SELECT", "RETRIEVE", "FETCH"],
        correctAnswer: 1,
        explanation: "The SELECT statement is used to select data from a database."
      },
      {
        id: 2,
        question: "What does the following query do: SELECT * FROM employees;",
        options: [
          "Selects all columns from employees table",
          "Selects only employee names",
          "Deletes all employees",
          "Updates employee records"
        ],
        correctAnswer: 0,
        explanation: "The asterisk (*) means 'all columns'. This query selects all columns from the employees table."
      },
      {
        id: 3,
        question: "Which clause is used to filter records in SQL?",
        options: ["FILTER", "WHERE", "HAVING", "CONDITION"],
        correctAnswer: 1,
        explanation: "The WHERE clause is used to filter records based on specified conditions."
      },
      {
        id: 4,
        question: "What is the purpose of the FROM clause in SQL?",
        options: [
          "Specify the source table",
          "Define column aliases",
          "Filter results",
          "Sort results"
        ],
        correctAnswer: 0,
        explanation: "The FROM clause specifies the table from which to retrieve data."
      },
      {
        id: 5,
        question: "Which SQL statement is used to return only different values?",
        options: ["UNIQUE", "DIFFERENT", "DISTINCT", "DISTINGUISH"],
        correctAnswer: 2,
        explanation: "SELECT DISTINCT is used to return only distinct (different) values."
      },
      {
        id: 6,
        question: "How do you select all columns from a table called 'users'?",
        options: [
          "SELECT ALL FROM users;",
          "SELECT * FROM users;",
          "SELECT COLUMNS FROM users;",
          "SELECT [all] FROM users;"
        ],
        correctAnswer: 1,
        explanation: "SELECT * FROM users; will select all columns from the users table."
      },
      {
        id: 7,
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Question Language",
          "Structured Question Logic",
          "Standard Query Logic"
        ],
        correctAnswer: 0,
        explanation: "SQL stands for Structured Query Language."
      },
      {
        id: 8,
        question: "Which statement is true about SQL?",
        options: [
          "SQL is case sensitive",
          "SQL requires semicolon at end of each statement",
          "SQL can only retrieve data",
          "SQL is used for relational databases"
        ],
        correctAnswer: 3,
        explanation: "SQL is primarily used for managing data in relational database management systems."
      }
    ],
    2: [
      {
        id: 1,
        question: "Which operator is used to check if a value is within a range?",
        options: ["RANGE", "BETWEEN", "IN", "WITHIN"],
        correctAnswer: 1,
        explanation: "The BETWEEN operator selects values within a given range."
      },
      {
        id: 2,
        question: "What does the LIKE operator do?",
        options: [
          "Compares numerical values",
          "Searches for a specified pattern",
          "Joins tables",
          "Sorts results"
        ],
        correctAnswer: 1,
        explanation: "The LIKE operator is used in a WHERE clause to search for a specified pattern in a column."
      },
      {
        id: 3,
        question: "Which wildcard represents any sequence of characters?",
        options: ["?", "*", "%", "#"],
        correctAnswer: 2,
        explanation: "The % wildcard represents zero, one, or multiple characters in SQL LIKE patterns."
      },
      {
        id: 4,
        question: "What is the result of: WHERE age >= 18 AND age <= 65",
        options: [
          "Ages between 18 and 65 inclusive",
          "Ages 18 or 65 only",
          "Ages less than 18",
          "Ages greater than 65"
        ],
        correctAnswer: 0,
        explanation: "The AND operator combines conditions, selecting ages from 18 to 65 inclusive."
      },
      {
        id: 5,
        question: "Which operator checks if a value is NULL?",
        options: ["IS NULL", "EQUALS NULL", "= NULL", "NULL CHECK"],
        correctAnswer: 0,
        explanation: "The IS NULL operator is used to test for empty values."
      },
      {
        id: 6,
        question: "What does IN operator do?",
        options: [
          "Checks if a value is within a list",
          "Inserts data",
          "Creates indexes",
          "Joins tables"
        ],
        correctAnswer: 0,
        explanation: "The IN operator allows you to specify multiple values in a WHERE clause."
      },
      {
        id: 7,
        question: "Which pattern matches names starting with 'A'?",
        options: ["LIKE 'A_'", "LIKE 'A%'", "LIKE '%A'", "LIKE '_A'"],
        correctAnswer: 1,
        explanation: "The 'A%' pattern matches any string that starts with 'A'."
      },
      {
        id: 8,
        question: "What is the purpose of NOT operator?",
        options: [
          "Negates a condition",
          "Creates tables",
          "Sorts descending",
          "Groups data"
        ],
        correctAnswer: 0,
        explanation: "The NOT operator is used to negate a condition in a WHERE clause."
      }
    ],
    3: [
      {
        id: 1,
        question: "Which JOIN returns all rows when there is a match in either table?",
        options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"],
        correctAnswer: 2,
        explanation: "FULL OUTER JOIN returns all rows when there is a match in either left or right table."
      },
      {
        id: 2,
        question: "What does INNER JOIN do?",
        options: [
          "Returns all rows from both tables",
          "Returns only matching rows from both tables",
          "Returns all rows from left table",
          "Returns all rows from right table"
        ],
        correctAnswer: 1,
        explanation: "INNER JOIN returns only the rows where there is a match in both tables."
      },
      {
        id: 3,
        question: "Which JOIN returns all rows from the left table?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
        correctAnswer: 1,
        explanation: "LEFT JOIN returns all rows from the left table and matched rows from the right table."
      },
      {
        id: 4,
        question: "What is the purpose of ON clause in JOINs?",
        options: [
          "Specify join conditions",
          "Filter results",
          "Sort the output",
          "Group the data"
        ],
        correctAnswer: 0,
        explanation: "The ON clause specifies the condition for joining tables."
      },
      {
        id: 5,
        question: "Which type of JOIN produces Cartesian product?",
        options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"],
        correctAnswer: 2,
        explanation: "CROSS JOIN produces Cartesian product of both tables."
      },
      {
        id: 6,
        question: "What is a SELF JOIN?",
        options: [
          "Joining a table with itself",
          "Joining two identical tables",
          "Joining without conditions",
          "Joining with the same column"
        ],
        correctAnswer: 0,
        explanation: "A SELF JOIN is a regular join but the table is joined with itself."
      },
      {
        id: 7,
        question: "Which JOIN is most commonly used?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
        correctAnswer: 0,
        explanation: "INNER JOIN is the most commonly used JOIN type in SQL."
      },
      {
        id: 8,
        question: "What happens if JOIN condition is omitted?",
        options: [
          "Syntax error",
          "CROSS JOIN behavior",
          "Returns no rows",
          "Uses primary keys automatically"
        ],
        correctAnswer: 1,
        explanation: "Without JOIN conditions, it behaves like a CROSS JOIN producing Cartesian product."
      }
    ],
    4: [
      {
        id: 1,
        question: "Which function calculates the average value?",
        options: ["AVG()", "MEAN()", "AVERAGE()", "CALC_AVG()"],
        correctAnswer: 0,
        explanation: "AVG() function calculates the average of a numeric column."
      },
      {
        id: 2,
        question: "What does COUNT(*) return?",
        options: [
          "Number of non-null values",
          "Total number of rows",
          "Number of distinct values",
          "Number of columns"
        ],
        correctAnswer: 1,
        explanation: "COUNT(*) returns the total number of rows in the table."
      },
      {
        id: 3,
        question: "Which clause is used with aggregate functions to filter groups?",
        options: ["WHERE", "HAVING", "FILTER", "GROUP BY"],
        correctAnswer: 1,
        explanation: "HAVING clause filters groups created by GROUP BY."
      },
      {
        id: 4,
        question: "What is the purpose of GROUP BY clause?",
        options: [
          "Group rows that have same values",
          "Sort the results",
          "Filter the data",
          "Join tables"
        ],
        correctAnswer: 0,
        explanation: "GROUP BY groups rows that have the same values in specified columns."
      },
      {
        id: 5,
        question: "Which function returns the highest value?",
        options: ["MAX()", "HIGHEST()", "TOP()", "PEAK()"],
        correctAnswer: 0,
        explanation: "MAX() returns the maximum value in a column."
      },
      {
        id: 6,
        question: "What does SUM() function do?",
        options: [
          "Returns total sum of values",
          "Counts number of rows",
          "Calculates average",
          "Finds maximum value"
        ],
        correctAnswer: 0,
        explanation: "SUM() returns the total sum of a numeric column."
      },
      {
        id: 7,
        question: "Can WHERE clause be used with aggregate functions?",
        options: [
          "Yes, always",
          "No, never",
          "Only with GROUP BY",
          "Only with HAVING"
        ],
        correctAnswer: 1,
        explanation: "WHERE cannot be used with aggregate functions; use HAVING instead."
      },
      {
        id: 8,
        question: "What is the difference between COUNT(*) and COUNT(column)?",
        options: [
          "COUNT(*) counts all rows, COUNT(column) counts non-null values",
          "No difference",
          "COUNT(*) is faster",
          "COUNT(column) counts distinct values"
        ],
        correctAnswer: 0,
        explanation: "COUNT(*) counts all rows, COUNT(column) counts non-null values in that column."
      }
    ],
    5: [
      {
        id: 1,
        question: "What is a subquery?",
        options: [
          "A query within another query",
          "A simplified query",
          "A backup query",
          "A temporary query"
        ],
        correctAnswer: 0,
        explanation: "A subquery is a SQL query nested inside a larger query."
      },
      {
        id: 2,
        question: "Which operator is used with single-row subqueries?",
        options: ["IN", "ANY", "=", "ALL"],
        correctAnswer: 2,
        explanation: "= operator is used when subquery returns exactly one row."
      },
      {
        id: 3,
        question: "What does EXISTS operator do?",
        options: [
          "Checks if subquery returns any rows",
          "Checks if value exists",
          "Validates data",
          "Creates temporary table"
        ],
        correctAnswer: 0,
        explanation: "EXISTS returns true if the subquery returns one or more rows."
      },
      {
        id: 4,
        question: "Which clause cannot contain subqueries?",
        options: ["SELECT", "FROM", "GROUP BY", "All can contain subqueries"],
        correctAnswer: 3,
        explanation: "Subqueries can be used in SELECT, FROM, WHERE, HAVING, and other clauses."
      },
      {
        id: 5,
        question: "What is a correlated subquery?",
        options: [
          "Subquery that references outer query",
          "Subquery that joins tables",
          "Subquery with aggregate functions",
          "Subquery in SELECT clause"
        ],
        correctAnswer: 0,
        explanation: "Correlated subquery references columns from the outer query."
      },
      {
        id: 6,
        question: "Which is faster: JOIN or subquery?",
        options: [
          "JOIN is usually faster",
          "Subquery is faster",
          "They are same",
          "Depends on database"
        ],
        correctAnswer: 3,
        explanation: "Performance depends on the database system and specific query."
      },
      {
        id: 7,
        question: "What does ANY operator do?",
        options: [
          "Compares value to each value in subquery",
          "Checks for any condition",
          "Returns any row",
          "Random selection"
        ],
        correctAnswer: 0,
        explanation: "ANY compares a value to each value returned by subquery."
      },
      {
        id: 8,
        question: "Can subqueries be used in INSERT statements?",
        options: [
          "Yes",
          "No",
          "Only in SELECT",
          "Only with WHERE"
        ],
        correctAnswer: 0,
        explanation: "Subqueries can be used in INSERT, UPDATE, DELETE, and SELECT statements."
      }
    ],
    6: [
      {
        id: 1,
        question: "Which statement adds new rows to a table?",
        options: ["ADD", "INSERT", "CREATE", "NEW"],
        correctAnswer: 1,
        explanation: "INSERT statement adds new rows to a table."
      },
      {
        id: 2,
        question: "What does UPDATE statement do?",
        options: [
          "Modifies existing rows",
          "Adds new columns",
          "Changes table structure",
          "Deletes data"
        ],
        correctAnswer: 0,
        explanation: "UPDATE modifies existing rows in a table."
      },
      {
        id: 3,
        question: "Which statement removes rows from a table?",
        options: ["REMOVE", "DELETE", "DROP", "ERASE"],
        correctAnswer: 1,
        explanation: "DELETE statement removes rows from a table."
      },
      {
        id: 4,
        question: "Why is WHERE clause important in UPDATE and DELETE?",
        options: [
          "To avoid modifying all rows",
          "For better performance",
          "It's optional",
          "To specify columns"
        ],
        correctAnswer: 0,
        explanation: "WHERE clause prevents modifying all rows accidentally."
      },
      {
        id: 5,
        question: "What does TRUNCATE TABLE do?",
        options: [
          "Deletes all rows quickly",
          "Removes table structure",
          "Backs up table",
          "Modifies columns"
        ],
        correctAnswer: 0,
        explanation: "TRUNCATE TABLE removes all rows quickly without logging individual row deletions."
      },
      {
        id: 6,
        question: "Can multiple rows be inserted with single INSERT?",
        options: [
          "Yes, using multiple VALUES",
          "No, only one row at a time",
          "Only with subqueries",
          "Only in some databases"
        ],
        correctAnswer: 0,
        explanation: "Multiple rows can be inserted using INSERT INTO table VALUES (row1), (row2), ..."
      },
      {
        id: 7,
        question: "What is the difference between DELETE and TRUNCATE?",
        options: [
          "DELETE can use WHERE, TRUNCATE cannot",
          "No difference",
          "TRUNCATE is slower",
          "DELETE is for columns"
        ],
        correctAnswer: 0,
        explanation: "DELETE can filter rows with WHERE, TRUNCATE always removes all rows."
      },
      {
        id: 8,
        question: "Which statement is used to modify table structure?",
        options: ["ALTER TABLE", "MODIFY TABLE", "CHANGE TABLE", "UPDATE TABLE"],
        correctAnswer: 0,
        explanation: "ALTER TABLE is used to modify table structure (add, drop, modify columns)."
      }
    ]
  };

  useEffect(() => {
    // Initialize answered array when lesson is selected
    if (selectedLesson !== null && questions[selectedLesson]) {
      setAnswered(new Array(questions[selectedLesson].length).fill(false));
    }
  }, [selectedLesson]);

  const handleLessonSelect = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setSelectedOption(null);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedLesson === null || answered[currentQuestion]) return;

    setSelectedOption(optionIndex);
    const currentQ = questions[selectedLesson][currentQuestion];
    const isCorrect = optionIndex === currentQ.correctAnswer;

    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (selectedLesson === null) return;

    if (currentQuestion < questions[selectedLesson].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedLesson(null);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered([]);
    setSelectedOption(null);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const getProgress = () => {
    if (selectedLesson === null) return 0;
    return ((currentQuestion + 1) / questions[selectedLesson].length) * 100;
  };

  if (selectedLesson === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                SQL Quiz - Select a Lesson
              </CardTitle>
              <p className="text-lg text-gray-600 text-center mt-2">
                Each lesson contains 8 one-click questions. Score is shown at the end.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-blue-200"
                    onClick={() => handleLessonSelect(lesson.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          variant={
                            lesson.level === "Beginner"
                              ? "default"
                              : lesson.level === "Intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {lesson.level}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 text-sm">{lesson.description}</p>
                      <div className="mt-4 text-xs text-gray-500">
                        8 questions • Click to start
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const totalQuestions = questions[selectedLesson].length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Quiz Completed!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl font-bold text-blue-600">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl font-semibold">
                {percentage >= 80
                  ? "Excellent! 🎉"
                  : percentage >= 60
                    ? "Good job! 👍"
                    : "Keep practicing! 📚"}
              </div>
              <Progress value={percentage} className="w-full" />
              <p className="text-gray-600">
                You scored {score} out of {totalQuestions} questions correctly ({percentage}%).
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={handleRestartQuiz} size="lg">
                  Choose Another Lesson
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuizCompleted(false);
                    setCurrentQuestion(0);
                    setScore(0);
                    setAnswered(new Array(totalQuestions).fill(false));
                    setSelectedOption(null);
                    setShowResult(false);
                  }}
                  size="lg"
                >
                  Retry This Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[selectedLesson][currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <CardTitle className="text-2xl font-bold">
                {lessons.find((l) => l.id === selectedLesson)?.title}
              </CardTitle>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions[selectedLesson].length}
              </Badge>
            </div>
            <Progress value={getProgress()} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedOption === index
                          ? index === currentQ.correctAnswer
                            ? "default"
                            : "destructive"
                          : "outline"
                      }
                      className="w-full justify-start h-auto py-3 px-4 text-left whitespace-normal"
                      onClick={() => handleAnswerSelect(index)}
                      disabled={answered[currentQuestion]}
                    >
                      <span className="font-medium mr-3 min-w-6">{String.fromCharCode(65 + index)}.</span>
                      <span className="text-left">{option}</span>
                    </Button>
                  ))}
                </div>

                {/* Explanation */}
                {showResult && (
                  <div className={`mt-4 p-4 rounded-lg ${selectedOption === currentQ.correctAnswer
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                    }`}>
                    <div className={`font-semibold ${selectedOption === currentQ.correctAnswer ? "text-green-800" : "text-red-800"
                      }`}>
                      {selectedOption === currentQ.correctAnswer ? "✓ Correct!" : "✗ Incorrect"}
                    </div>
                    <div className="text-sm mt-2 text-gray-700">
                      {currentQ.explanation}
                    </div>
                  </div>
                )}

                {/* Next Button */}
                {showResult && (
                  <div className="mt-6 text-center">
                    <Button onClick={handleNextQuestion} size="lg">
                      {currentQuestion < questions[selectedLesson].length - 1
                        ? "Next Question"
                        : "Finish Quiz"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Score Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <span className="font-semibold">Score: </span>
                    {score} / {questions[selectedLesson].length}
                  </div>
                  <Button variant="outline" onClick={handleRestartQuiz}>
                    Change Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}