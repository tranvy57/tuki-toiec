"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Clock, 
  MessageCircle, 
  Search,
  Filter,
  Star,
  Users,
  Briefcase,
  Plane,
  Heart,
  BookOpen,
  Globe
} from "lucide-react";

export interface SpeakingTopic {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  estimatedTime: number; // in minutes
  questions: string[];
  tags: string[];
  popularity?: number;
}

interface SpeakingTopicSelectorProps {
  topics: SpeakingTopic[];
  onTopicSelect: (topic: SpeakingTopic) => void;
  selectedTopicId?: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Personal": Users,
  "Professional": Briefcase,
  "Travel": Plane,
  "Lifestyle": Heart,
  "Education": BookOpen,
  "Global Issues": Globe,
  "Descriptive": MessageCircle,
  "Opinion": Star
};

export default function SpeakingTopicSelector({
  topics,
  onTopicSelect,
  selectedTopicId
}: SpeakingTopicSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");

  const filteredTopics = topics
    .filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDifficulty = difficultyFilter === "all" || topic.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === "all" || topic.category === categoryFilter;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        case "difficulty":
          const difficultyOrder = { "beginner": 1, "intermediate": 2, "advanced": 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "time":
          return a.estimatedTime - b.estimatedTime;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEstimatedTimeColor = (time: number) => {
    if (time <= 10) return "text-green-600";
    if (time <= 20) return "text-yellow-600";
    return "text-red-600";
  };

  const categories = [...new Set(topics.map(topic => topic.category))];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Your Perfect Speaking Topic
          </CardTitle>
          <CardDescription>
            Choose from {topics.length} carefully curated speaking topics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search topics, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="time">Duration</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{filteredTopics.length} topics found</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const IconComponent = categoryIcons[topic.category] || MessageCircle;
          const isSelected = selectedTopicId === topic.id;
          
          return (
            <Card 
              key={topic.id} 
              className={`hover:shadow-lg transition-all cursor-pointer ${
                isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <Badge className={getDifficultyColor(topic.difficulty)}>
                      {topic.difficulty}
                    </Badge>
                  </div>
                  {topic.popularity && topic.popularity > 80 && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg leading-tight">{topic.title}</CardTitle>
                <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Topic Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{topic.questions.length} questions</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getEstimatedTimeColor(topic.estimatedTime)}`}>
                    <Clock className="w-4 h-4" />
                    <span>{topic.estimatedTime} min</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {topic.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {topic.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{topic.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Category */}
                <div className="text-sm">
                  <span className="font-medium">Category:</span> {topic.category}
                </div>

                {/* Sample Questions Preview */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-1">Sample Question:</p>
                  <p className="text-sm italic">"{topic.questions[0]}"</p>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => onTopicSelect(topic)}
                  className="w-full"
                  variant={isSelected ? "default" : "outline"}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isSelected ? "Selected" : "Start Practice"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTopics.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find more topics.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setDifficultyFilter("all");
                setCategoryFilter("all");
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

