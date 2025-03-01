"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Heart, MapPin, User, Bell, ArrowRight, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for help requests
const mockRequests = [
  {
    id: 1,
    title: "Help with grocery shopping",
    description: "I need assistance with weekly grocery shopping. I have a list ready and can reimburse for the groceries when delivered.",
    location: "1.2 miles away",
    urgency: "normal",
    timestamp: "2 hours ago",
    requester: "Margaret T.",
  },
  {
    id: 2,
    title: "Ride to doctor's appointment",
    description: "I have a doctor's appointment on Thursday at 2pm and need a ride there and back. The clinic is about 15 minutes away from my home.",
    location: "0.5 miles away",
    urgency: "high",
    timestamp: "5 hours ago",
    requester: "Robert J.",
  },
  {
    id: 3,
    title: "Help setting up new tablet",
    description: "I received a new tablet as a gift but I'm having trouble setting it up. Could someone help me configure it and show me how to use basic functions?",
    location: "3.1 miles away",
    urgency: "low",
    timestamp: "1 day ago",
    requester: "Eleanor W.",
  },
  {
    id: 4,
    title: "Yard maintenance help needed",
    description: "Looking for help with some basic yard work - mowing the lawn and trimming some bushes. I have all the necessary equipment.",
    location: "1.7 miles away",
    urgency: "normal",
    timestamp: "3 days ago",
    requester: "Thomas H.",
  },
];

// Urgency badge component
const UrgencyBadge = ({ urgency }: { urgency: string }) => {
  const variants: Record<string, string> = {
    low: "bg-blue-100 text-blue-800",
    normal: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };
  
  const labels: Record<string, string> = {
    low: "Low",
    normal: "Normal",
    high: "Urgent",
  };
  
  return (
    <Badge variant="outline" className={`${variants[urgency]} border-none`}>
      {labels[urgency]}
    </Badge>
  );
};

const VolunteerDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);
  const [acceptedRequests, setAcceptedRequests] = useState<number[]>([]);

  const toggleAvailability = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    
    toast({
      title: newAvailability ? "You're now available" : "You're now unavailable",
      description: newAvailability 
        ? "You'll receive notifications for new help requests" 
        : "You won't receive new help requests",
    });
  };

  const toggleRequestDetails = (id: number) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const acceptRequest = (id: number) => {
    if (!acceptedRequests.includes(id)) {
      setAcceptedRequests([...acceptedRequests, id]);
      
      toast({
        title: "Request accepted!",
        description: "The requester has been notified that you'll help them.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <h1 className="text-xl font-bold text-gray-800">HelpHood</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="availability">Available to Help</Label>
                      <p className="text-sm text-gray-500">
                        Toggle off when you're busy
                      </p>
                    </div>
                    <Switch
                      id="availability"
                      checked={isAvailable}
                      onCheckedChange={toggleAvailability}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Requests Accepted</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hours Volunteered</span>
                    <span className="font-semibold">12.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">People Helped</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <Separator />
                  <Link href="/volunteer-history" className="flex items-center text-blue-600 hover:underline">
                    View your volunteer history <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Help Requests Near You</CardTitle>
                  <CardDescription>
                    {isAvailable 
                      ? "These seniors in your community need help" 
                      : "You're currently marked as unavailable"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleRequestDetails(request.id)}>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{request.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {request.location}
                              </div>
                              <span>•</span>
                              <span>{request.timestamp}</span>
                            </div>
                          </div>
                          <UrgencyBadge urgency={request.urgency} />
                        </div>
                      </CardHeader>
                      {expandedRequest === request.id && (
                        <>
                          <CardContent className="p-4 pt-0">
                            <p className="text-gray-600 mb-4">
                              {request.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-3.5 w-3.5 mr-1" />
                              <span>Requested by {request.requester}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-end">
                            {acceptedRequests.includes(request.id) ? (
                              <Button variant="outline" className="gap-2" disabled>
                                <Check className="h-4 w-4" />
                                Accepted
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => acceptRequest(request.id)}
                                disabled={!isAvailable}
                                className="gap-2"
                              >
                                Accept Request
                              </Button>
                            )}
                          </CardFooter>
                        </>
                      )}
                    </Card>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">Load More Requests</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;