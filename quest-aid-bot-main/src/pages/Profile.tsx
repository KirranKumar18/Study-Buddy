import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Mail, Lock, Bell, Settings, Trophy, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user: authUser, logout } = useAuth();
  
  const [user, setUser] = useState({
    name: authUser?.username || "Student",
    email: authUser?.email || "student@example.com",
    xp: 2450,
    level: 8,
    streak: 12,
    joinedDate: authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "2025",
    totalStudyHours: 124.5,
    plansCompleted: 3,
    quizzesTaken: 45,
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReminders: true,
    weeklyReport: true,
    darkMode: false,
    dailyGoalMinutes: 60,
    sessionLength: 45,
  });

  const handleProfileUpdate = () => {
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = () => {
    toast.success("Password changed successfully!");
  };

  const handlePreferencesUpdate = () => {
    toast.success("Preferences saved!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground text-lg">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {user.name[0]}
                </div>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <Separator className="my-4 w-full" />
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user.level}</p>
                    <p className="text-xs text-muted-foreground">Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{user.xp}</p>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">{user.streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{user.plansCompleted}</p>
                    <p className="text-xs text-muted-foreground">Plans Done</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Total Study Hours</Label>
                        <p className="text-2xl font-bold">{user.totalStudyHours}h</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Quizzes Taken</Label>
                        <p className="text-2xl font-bold">{user.quizzesTaken}</p>
                      </div>
                    </div>

                    <Button onClick={handleProfileUpdate} className="w-full gradient-primary text-white">
                      Save Changes
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Current Password
                      </Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <Button onClick={handlePasswordChange} className="w-full gradient-primary text-white">
                      Change Password
                    </Button>

                    <Separator />

                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">Security Options</h3>
                      <Button variant="outline" className="w-full">
                        Enable Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Login History
                      </Button>
                      <Button variant="destructive" className="w-full">
                        Sign Out All Devices
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                          </div>
                          <Switch
                            checked={preferences.emailNotifications}
                            onCheckedChange={(checked) =>
                              setPreferences({ ...preferences, emailNotifications: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Daily Reminders</p>
                            <p className="text-sm text-muted-foreground">Get reminded to study</p>
                          </div>
                          <Switch
                            checked={preferences.dailyReminders}
                            onCheckedChange={(checked) =>
                              setPreferences({ ...preferences, dailyReminders: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Weekly Progress Report</p>
                            <p className="text-sm text-muted-foreground">Summary of your week</p>
                          </div>
                          <Switch
                            checked={preferences.weeklyReport}
                            onCheckedChange={(checked) =>
                              setPreferences({ ...preferences, weeklyReport: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Study Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="daily-goal">Daily Study Goal (minutes)</Label>
                          <Input
                            id="daily-goal"
                            type="number"
                            value={preferences.dailyGoalMinutes}
                            onChange={(e) =>
                              setPreferences({ ...preferences, dailyGoalMinutes: parseInt(e.target.value) })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="session-length">Default Session Length (minutes)</Label>
                          <Input
                            id="session-length"
                            type="number"
                            value={preferences.sessionLength}
                            onChange={(e) =>
                              setPreferences({ ...preferences, sessionLength: parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handlePreferencesUpdate} className="w-full gradient-primary text-white">
                      Save Preferences
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <Card className="p-6 border-destructive/50">
            <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
