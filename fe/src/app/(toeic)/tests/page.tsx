"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestCard } from "@/components/toeic/tests/test-card";
import { mockTests } from "@/lib/test-data";
import { 
  Search,
  Filter,
  BookOpen,
  Clock,
  Target
} from "lucide-react";

export default function TestsPage() {
  const [tests] = useState(mockTests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const handleTestPress = (testId: number) => {
    console.log('Test pressed:', testId);
    // TODO: Navigate to test details
  };

  const handleTestStart = (testId: number) => {
    console.log('Test started:', testId);
    // TODO: Start the test
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = searchQuery === '' || 
      test.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
      test.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const totalTests = tests.length;
  const easyTests = tests.filter(t => t.difficulty === 'easy').length;
  const mediumTests = tests.filter(t => t.difficulty === 'medium').length;
  const hardTests = tests.filter(t => t.difficulty === 'hard').length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#ff776f] to-[#ff9b94] text-white">
        <CardContent className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">TOEIC Tests</h1>
          <p className="text-white/90 mb-4">
            {totalTests} practice tests available to boost your TOEIC score
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>200 questions per test</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>120 minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Real TOEIC format</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{totalTests}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{easyTests}</div>
            <div className="text-sm text-muted-foreground">Easy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{mediumTests}</div>
            <div className="text-sm text-muted-foreground">Medium</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{hardTests}</div>
            <div className="text-sm text-muted-foreground">Hard</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Difficulty Filter */}
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Available Tests
          </h2>
          <Badge variant="outline">
            {filteredTests.length} tests found
          </Badge>
        </div>

        {filteredTests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No tests found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <TestCard
                key={test.test_id}
                test={test}
                onTestPress={handleTestPress}
                onTestStart={handleTestStart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Start */}
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-lg font-semibold">Ready to start?</h3>
          <p className="text-muted-foreground">
            Take a random test to challenge yourself
          </p>
          <Button 
            size="lg" 
            className="bg-[#ff776f] hover:bg-[#e55a52]"
            onClick={() => {
              const randomTest = tests[Math.floor(Math.random() * tests.length)];
              handleTestStart(randomTest.test_id);
            }}
          >
            Take Random Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
