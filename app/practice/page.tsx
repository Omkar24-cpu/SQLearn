// app/practice/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Copy, Download, ChevronLeft, ChevronRight, Play, Trash2, Eye, AlertCircle } from "lucide-react";

interface QueryResult {
  columns?: string[];
  rows?: Record<string, any>[];
  rowCount?: number;
  type?: string;
  message?: string;
  changes?: number;
  lastInsertRowid?: number;
}

interface Question {
  id: number;
  text: string;
  hint: string;
  example: string;
  expectedSql: string;
}

export default function PracticePage() {
  const [mode, setMode] = useState<"direct" | "question">("direct");
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("");
  const [explanation, setExplanation] = useState("No query yet.");
  const [suggestions, setSuggestions] = useState("No suggestions.");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState("none");
  const [tablePreview, setTablePreview] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluation, setEvaluation] = useState("");
  const [dbInitialized, setDbInitialized] = useState<boolean | null>(null);
  
  const recognitionRef = useRef<any>(null);

  const questions: Question[] = [
    {
      id: 1,
      text: "Show all employees with salary greater than 60000",
      hint: "Use WHERE clause to filter by salary",
      example: "SELECT * FROM employees WHERE salary > 60000;",
      expectedSql: "SELECT * FROM employees WHERE salary > 60000;"
    },
    {
      id: 2,
      text: "Find the average salary by department",
      hint: "Use GROUP BY with AVG function",
      example: "SELECT dept_id, AVG(salary) as avg_salary FROM employees GROUP BY dept_id;",
      expectedSql: "SELECT dept_id, AVG(salary) as avg_salary FROM employees GROUP BY dept_id;"
    },
    {
      id: 3,
      text: "Show top 5 highest paid employees",
      hint: "Use ORDER BY and LIMIT",
      example: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;",
      expectedSql: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;"
    },
    {
      id: 4,
      text: "Find employees in the Marketing department",
      hint: "You'll need to JOIN employees and departments tables",
      example: "SELECT e.name FROM employees e JOIN departments d ON e.dept_id = d.dept_id WHERE d.dept_name = 'Marketing';",
      expectedSql: "SELECT e.name FROM employees e JOIN departments d ON e.dept_id = d.dept_id WHERE d.dept_name = 'Marketing';"
    },
    {
      id: 5,
      text: "Count the number of employees in each department",
      hint: "Use COUNT with GROUP BY",
      example: "SELECT d.dept_name, COUNT(e.emp_id) as employee_count FROM departments d LEFT JOIN employees e ON d.dept_id = e.dept_id GROUP BY d.dept_name;",
      expectedSql: "SELECT d.dept_name, COUNT(e.emp_id) as employee_count FROM departments d LEFT JOIN employees e ON d.dept_id = e.dept_id GROUP BY d.dept_name;"
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        setStatus("Voice input captured");
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setStatus("Voice input failed");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Load tables and history on component mount
  useEffect(() => {
    loadTables();
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem('sql-query-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const loadTables = async () => {
    try {
      setStatus("Loading tables...");
      const response = await fetch('/api/tables');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load tables');
      }

      if (data.tables) {
        setTables(data.tables);
        setDbInitialized(true);
        setSuggestions("Database is ready. You can start running queries.");
      } else if (data.message) {
        setDbInitialized(false);
        setSuggestions(data.message);
      }
    } catch (error: any) {
      console.error('Failed to load tables:', error);
      setDbInitialized(false);
      setSuggestions("Failed to load tables. Make sure the database is initialized.");
    } finally {
      setStatus("");
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setStatus("Listening...");
      recognitionRef.current.start();
    } else {
      setStatus("Speech recognition not supported");
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setStatus("Please enter a query");
      return;
    }

    if (dbInitialized === false) {
      setStatus("Database not initialized");
      setSuggestions("Please initialize the database first before running queries.");
      return;
    }

    setStatus("Running query...");
    setResult(null);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Query failed');
      }

      // Handle different response types
      if (data.type === 'SELECT') {
        setResult({
          columns: data.columns,
          rows: data.rows,
          rowCount: data.rowCount,
          type: data.type
        });
        setExplanation("Query executed successfully.");
        setSuggestions("No issues detected.");
        setStatus(`Query completed - ${data.rowCount} rows returned`);
      } else {
        // DML/DDL operations
        setResult({
          message: data.message,
          changes: data.changes,
          lastInsertRowid: data.lastInsertRowid,
          type: data.type
        });
        setExplanation("DML/DDL operation executed successfully.");
        setSuggestions("No issues detected.");
        setStatus(`Operation completed - ${data.changes || 0} rows affected`);
      }

      // Add to history
      const newHistory = [query, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('sql-query-history', JSON.stringify(newHistory));

      // Evaluate if in question mode
      if (mode === "question") {
        evaluateAnswer();
      }
    } catch (error: any) {
      setStatus("Query failed");
      setExplanation("Error executing query");
      setSuggestions(error.message || "Check your SQL syntax and try again.");
      setResult(null);
    }
  };

  const evaluateAnswer = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = query.trim().toLowerCase() === currentQ.expectedSql.toLowerCase();
    
    setEvaluation(isCorrect ? "Correct! Your query matches the expected solution." : "Not quite right. Compare your query with the expected solution.");
    setShowEvaluation(true);
  };

  const clearAll = () => {
    setQuery("");
    setResult(null);
    setExplanation("No query yet.");
    setSuggestions(dbInitialized ? "No suggestions." : "Database not initialized. Please initialize first.");
    setStatus("");
    setShowEvaluation(false);
  };

  const exportToCSV = () => {
    if (!result || !result.rows || result.rows.length === 0) {
      setStatus("No results to export");
      return;
    }

    const headers = result.columns?.join(',') || '';
    const rows = result.rows.map(row => 
      result.columns?.map(col => {
        const value = row[col];
        // Escape quotes and wrap in quotes if contains comma or quote
        const escaped = String(value ?? '').replace(/"/g, '""');
        return /[,"\n]/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(',') || ''
    );
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-result-${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setStatus("Exported to CSV");
  };

  const previewTable = async (tableName: string) => {
    setSelectedTable(tableName);
    
    if (tableName === "none") {
      setTablePreview(null);
      return;
    }

    if (dbInitialized === false) {
      setStatus("Database not initialized");
      return;
    }

    try {
      setStatus(`Loading ${tableName}...`);
      const response = await fetch('/api/table-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load table preview');
      }

      setTablePreview({
        columns: data.columns,
        rows: data.rows
      });
      setStatus(`Loaded ${data.rowCount} rows from ${tableName}`);
    } catch (error: any) {
      setStatus("Failed to load table preview");
      setSuggestions(error.message);
      setTablePreview(null);
    }
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    setShowEvaluation(false);
    setEvaluation("");
    setQuery("");
    setResult(null);
    setExplanation("No query yet.");
    setSuggestions(dbInitialized ? "No suggestions." : "Database not initialized. Please initialize first.");
    
    if (direction === "next") {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    } else {
      setCurrentQuestion((prev) => (prev - 1 + questions.length) % questions.length);
    }
  };

  const useExample = () => {
    setQuery(questions[currentQuestion].example);
  };

  const showExpected = () => {
    setQuery(questions[currentQuestion].expectedSql);
    setStatus("Expected SQL filled");
  };

  const sampleQueries = [
    "SELECT * FROM employees LIMIT 5",
    "SELECT name, salary FROM employees WHERE salary > 60000",
    "SELECT dept_name, COUNT(*) FROM departments JOIN employees USING(dept_id) GROUP BY dept_name",
    "INSERT INTO employees (name, salary, dept_id) VALUES ('John Doe', 75000, 1)",
    "UPDATE employees SET salary = salary * 1.1 WHERE dept_id = 2",
    "DELETE FROM employees WHERE salary < 30000",
    "CREATE TABLE projects (proj_id INTEGER PRIMARY KEY, title TEXT, budget REAL)",
    "ALTER TABLE employees ADD COLUMN hire_date TEXT",
    "DROP TABLE IF EXISTS temp_data"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Database Status Alert */}
        {dbInitialized === false && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Database not initialized. Please run the initialization first.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={loadTables}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Practice Area</CardTitle>
                {dbInitialized && (
                  <Badge variant="secondary" className="w-fit">
                    Database Connected
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={mode === "direct" ? "default" : "outline"}
                    onClick={() => setMode("direct")}
                    className="flex-1"
                  >
                    Direct Query
                  </Button>
                  <Button
                    variant={mode === "question" ? "default" : "outline"}
                    onClick={() => setMode("question")}
                    className="flex-1"
                  >
                    Question Mode
                  </Button>
                </div>

                {/* Query Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Type natural language or SQL (or use mic):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., Top 5 employees by salary OR SELECT * FROM employees WHERE salary > 60000; OR INSERT INTO employees (name, salary) VALUES ('John', 50000)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          executeQuery();
                        }
                      }}
                      disabled={dbInitialized === false}
                    />
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                      onClick={startVoiceInput}
                      disabled={isListening || dbInitialized === false}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Button 
                    onClick={executeQuery} 
                    className="flex items-center gap-1"
                    disabled={dbInitialized === false}
                  >
                    <Play className="h-4 w-4" />
                    Run
                  </Button>
                  <Button variant="outline" onClick={clearAll} className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={exportToCSV} 
                    className="flex items-center gap-1"
                    disabled={!result || !result.rows || result.rows.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  {mode === "question" && (
                    <Button variant="outline" onClick={showExpected} className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Show Expected
                    </Button>
                  )}
                  <span className="text-blue-600 font-medium text-sm">{status}</span>
                </div>

                {/* Question Panel */}
                {mode === "question" && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <strong>Question:</strong>
                          <div className="mt-1 text-gray-700">{questions[currentQuestion].text}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {questions[currentQuestion].hint}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => navigateQuestion("prev")} className="flex items-center gap-1">
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                          </Button>
                          <Button variant="outline" onClick={() => navigateQuestion("next")} className="flex items-center gap-1">
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" onClick={useExample}>
                            Fill Example
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Explanation */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Explanation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700">{explanation}</div>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Suggestions / Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700">{suggestions}</div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result ? (
                      <div>
                        {result.type === 'SELECT' && result.rows ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {result.columns?.map((col) => (
                                    <TableHead key={col}>{col}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {result.rows.map((row, i) => (
                                  <TableRow key={i}>
                                    {result.columns?.map((col) => (
                                      <TableCell key={col}>{row[col]}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <div className="mt-2 text-sm text-gray-500">
                              {result.rowCount} row(s) returned
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-green-800 font-medium">{result.message}</div>
                            {result.changes !== undefined && (
                              <div className="text-green-600 text-sm mt-1">
                                Rows affected: {result.changes}
                              </div>
                            )}
                            {result.lastInsertRowid !== undefined && (
                              <div className="text-green-600 text-sm">
                                Last insert ID: {result.lastInsertRowid}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        {dbInitialized === false 
                          ? "Database not initialized. Please initialize first." 
                          : "No results yet."}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Evaluation */}
                {showEvaluation && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-sm ${
                        evaluation.includes("Correct") ? "text-green-600" : "text-red-600"
                      } font-medium`}>
                        {evaluation}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Table Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Table Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={selectedTable} 
                  onValueChange={previewTable}
                  disabled={dbInitialized === false || tables.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      dbInitialized === false 
                        ? "Database not initialized" 
                        : tables.length === 0 
                        ? "No tables available" 
                        : "Choose table to preview"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Choose table to preview --</SelectItem>
                    {tables.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600">
                  Preview first 20 rows of selected table
                </div>

                {tablePreview && selectedTable !== "none" && (
                  <div className="overflow-x-auto">
                    <div className="text-xs text-gray-500 mb-2">
                      Showing {tablePreview.rows ? tablePreview.rows.length : 0} row(s) from {selectedTable}
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tablePreview.columns && tablePreview.columns.map((col) => (
                            <TableHead key={col} className="text-xs">{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tablePreview.rows && tablePreview.columns && tablePreview.rows.slice(0, 5).map((row, i) => (
                          <TableRow key={i}>
                            {tablePreview.columns && tablePreview.columns.map((col) => (
                              <TableCell key={col} className="text-xs">
                                {row[col]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Query History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Query History (local)</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 break-words"
                        onClick={() => setQuery(item)}
                      >
                        {item.slice(0, 80)}{item.length > 80 ? '...' : ''}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No history</div>
                )}
              </CardContent>
            </Card>

            {/* Sample Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Quick Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {sampleQueries.map((query, index) => (
                    <div
                      key={index}
                      className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 break-words"
                      onClick={() => setQuery(query)}
                    >
                      {query}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}