import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SpeechToSQLHome: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white shadow-lg rounded-xl p-8 mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Speech → Natural Language → SQL
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Speak or type natural queries; server maps to safe SQL and returns results
          from a seeded SQLite DB.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/learning">See Learning</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/practice">Start Practice</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Secure</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Read-only SELECT allowed; dangerous operations blocked.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Rich DB</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Employees, Departments, Projects, Student data seeded.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Voice Input</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Use mic to speak queries (Chrome recommended).
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Quiz</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            15 randomized questions each attempt.
          </p>
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ready to Master SQL?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Start with our interactive learning modules, practice with real-world scenarios, 
          and test your knowledge with comprehensive quizzes.
        </p>
        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
          <Link href="/learning">Get Started Now</Link>
        </Button>
      </section>
    </div>
  );
};

export default SpeechToSQLHome;