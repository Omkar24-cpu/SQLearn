// app/admin/init-db/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InitDBPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const initializeDB = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch('/api/init-db');
      const data = await response.json();
      
      if (data.success) {
        setMessage("✅ Database initialized successfully!");
      } else {
        setMessage("❌ Failed to initialize database: " + data.error);
      }
    } catch (error: any) {
      setMessage("❌ Error initializing database: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Initialize Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This will create and seed the SQLite database with sample data including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Departments table (5 departments)</li>
              <li>Employees table (20 employees)</li>
              <li>Projects table (5 projects)</li>
              <li>Employee_Projects table (assignments)</li>
              <li>Students table (7 students)</li>
            </ul>
            
            <Button
              onClick={initializeDB}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Initializing..." : "Initialize Database"}
            </Button>
            
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes("✅") 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                {message}
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              <strong>Note:</strong> You need to run this once before using the Practice page.
              The database file (app.db) will be created in your project root.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}