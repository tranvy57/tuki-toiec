"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Clock, 
  BookOpen,
  Settings,
  LogOut,
  Edit
} from "lucide-react";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    joinDate: "2024-01-15",
    level: "Intermediate",
    targetScore: 750,
    currentScore: 650,
    totalStudyTime: 45,
    testsCompleted: 12,
    vocabularyLearned: 156,
    streak: 15
  };

  const achievements = [
    { name: "First Test", description: "Complete your first TOEIC test", completed: true },
    { name: "Vocabulary Master", description: "Learn 100 vocabulary words", completed: true },
    { name: "Study Streak", description: "Study for 7 days in a row", completed: true },
    { name: "Score Improver", description: "Improve your score by 50 points", completed: false },
    { name: "Perfect Score", description: "Achieve 990 points in a test", completed: false },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="mt-2">
                {user.level}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* TOEIC Score Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#ff776f]" />
              TOEIC Score Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Score</span>
              <span className="text-2xl font-bold text-[#ff776f]">{user.currentScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Target Score</span>
              <span className="text-lg font-semibold">{user.targetScore}</span>
            </div>
            <Progress value={(user.currentScore / user.targetScore) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {user.targetScore - user.currentScore} points to reach your goal
            </p>
          </CardContent>
        </Card>

        {/* Study Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#ff776f]" />
              Study Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{user.totalStudyTime}h</div>
                <div className="text-sm text-muted-foreground">Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{user.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{user.testsCompleted}</div>
                <div className="text-sm text-muted-foreground">Tests Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{user.vocabularyLearned}</div>
                <div className="text-sm text-muted-foreground">Words Learned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#ff776f]" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  achievement.completed 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-muted border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.completed ? 'bg-green-500' : 'bg-muted-foreground'
                  }`}>
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.completed && (
                    <Badge className="bg-green-500">Completed</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#ff776f]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-[#ff776f] rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Completed New Economy TOEIC Test 5</p>
                <p className="text-sm text-muted-foreground">Score: 680 • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Learned 10 new vocabulary words</p>
                <p className="text-sm text-muted-foreground">Business category • Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Reached 15-day study streak</p>
                <p className="text-sm text-muted-foreground">Keep it up! • 2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            <Button variant="outline" className="flex-1">
              Export Progress
            </Button>
            <Button variant="destructive" className="flex-1">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
