
"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Heart, MapPin, User, Bell, PlusCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { HelpRequest } from "../entitites/help-request";
import { useRouter } from "next/navigation";

// Mock data for help requests
const mockRequests = [
    {
        id: 1,
        title: "Help with grocery shopping",
        description: "I need assistance with weekly grocery shopping. I have a list ready and can reimburse for the groceries when delivered.",
        location: "Home",
        urgency: "normal",
        timestamp: "2 days ago",
        status: "accepted",
        volunteer: "James K.",
    },
    {
        id: 2,
        title: "Ride to doctor's appointment",
        description: "I have a doctor's appointment on Thursday at 2pm and need a ride there and back. The clinic is about 15 minutes away from my home.",
        location: "Medical Center",
        urgency: "high",
        timestamp: "5 hours ago",
        status: "pending",
        volunteer: null,
    },
    {
        id: 3,
        title: "Help setting up new tablet",
        description: "I received a new tablet as a gift but I'm having trouble setting it up. Could someone help me configure it and show me how to use basic functions?",
        location: "Home",
        urgency: "low",
        timestamp: "1 week ago",
        status: "completed",
        volunteer: "Sarah M.",
    }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        accepted: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-gray-100 text-gray-800",
    };

    const labels: Record<string, string> = {
        pending: "Pending",
        accepted: "Accepted",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return (
        <Badge variant="outline" className={`${variants[status]} border-none`}>
            {labels[status]}
        </Badge>
    );
};

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


const RequesterDashboard = () => {
    const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
    const [cancelledRequests, setCancelledRequests] = useState<string[]>([]);
    const { data: session, status } = useSession();
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchRequests = async (userId: string) => {
            const response = await fetch(`/api/requests?userId=${userId}`);
            const data = await response.json();
            setRequests(data);
        };

        if (session?.user?.userId) {
            fetchRequests(session.user.userId);
        } else {
            router.push('/signin');
        }
    }, [session, router]);

    // Toggle request details
    const toggleRequestDetails = (id: string) => {
        setExpandedRequest(expandedRequest === id ? null : id);
    };

    const cancelRequest = (id: string) => {
        if (!cancelledRequests.includes(id)) {
            setCancelledRequests([...cancelledRequests, id]);

            toast({
                title: "Request cancelled",
                description: "Your help request has been cancelled successfully.",
            });
        }
    };

    const activeRequests = requests.filter(
        req => req.status === "pending" || req.status === "accepted" || req.status === 'open'
    );

    const pastRequests = requests.filter(
        req => req.status === "completed" || cancelledRequests.includes(req._id)
    );

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
                                    {/* TODO: use context for profile. */}
                                    <CardTitle>Welcome Back, Margaret</CardTitle>
                                    <CardDescription>
                                        Manage your help requests and track their status
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Link href="/request-help">
                                        <Button className="w-full gap-2">
                                            <PlusCircle className="h-4 w-4" />
                                            Create New Request
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Request Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Active Requests</span>
                                        <span className="font-semibold">{activeRequests.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Completed Requests</span>
                                        <span className="font-semibold">{requests.filter(req => req.status === "completed").length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Cancelled Requests</span>
                                        <span className="font-semibold">{cancelledRequests.length}</span>
                                    </div>
                                    <Separator />
                                    <Link href="/request-history" className="text-blue-600 hover:underline">
                                        View your complete request history
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Help Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="active" className="w-full">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="active">Active Requests</TabsTrigger>
                                            <TabsTrigger value="past">Past Requests</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="active" className="space-y-4">
                                            {activeRequests.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p>You have no active help requests.</p>
                                                    <Link href="/request-help">
                                                        <Button variant="outline" className="mt-4">
                                                            Create a Request
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                requests.map((request) => (
                                                    <Card key={request._id} className="overflow-hidden">
                                                        <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleRequestDetails(request._id)}>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <CardTitle className="text-lg">{request.title}</CardTitle>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                                                                        <div className="flex items-center">
                                                                            <MapPin className="h-3.5 w-3.5 mr-1" />
                                                                            { }
                                                                        </div>
                                                                        <span>•</span>
                                                                        <div className="flex items-center">
                                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                                            {request.createdAt.toString()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <UrgencyBadge urgency={request.urgency} />
                                                                    <StatusBadge status={request.status} />
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        {expandedRequest === request._id && (
                                                            <>
                                                                <CardContent className="p-4 pt-0">
                                                                    <p className="text-gray-600 mb-4">
                                                                        {request.description}
                                                                    </p>
                                                                    {request.status === "accepted" && (
                                                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                                                            <User className="h-3.5 w-3.5 mr-1" />
                                                                            <span>Accepted by: {request.author}</span>
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                                <CardFooter className="p-4 pt-0 flex justify-end">
                                                                    {cancelledRequests.includes(request._id) ? (
                                                                        <Button variant="outline" className="gap-2" disabled>
                                                                            <XCircle className="h-4 w-4" />
                                                                            Cancelled
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                cancelRequest(request._id);
                                                                            }}
                                                                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                        >
                                                                            Cancel Request
                                                                        </Button>
                                                                    )}
                                                                </CardFooter>
                                                            </>
                                                        )}
                                                    </Card>
                                                ))
                                            )}
                                        </TabsContent>

                                        <TabsContent value="past" className="space-y-4">
                                            {pastRequests.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p>You have no past help requests.</p>
                                                </div>
                                            ) : (
                                                pastRequests.map((request) => (
                                                    <Card key={request._id} className="overflow-hidden opacity-75">
                                                        <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleRequestDetails(request._id)}>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <CardTitle className="text-lg">{request.title}</CardTitle>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                                                                        <div className="flex items-center">
                                                                            <MapPin className="h-3.5 w-3.5 mr-1" />
                                                                            5 km away
                                                                            {/* {request.location} */}
                                                                        </div>
                                                                        <span>•</span>
                                                                        <div className="flex items-center">
                                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                                            {request.createdAt.toString()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {request.status === "completed" ? (
                                                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
                                                                            Completed
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-none">
                                                                            Cancelled
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        {expandedRequest === request._id && (
                                                            <CardContent className="p-4 pt-0">
                                                                <p className="text-gray-600 mb-4">
                                                                    {request.description}
                                                                </p>
                                                                {request.status === "completed" && (
                                                                    <div className="flex items-center text-sm text-gray-500">
                                                                        <User className="h-3.5 w-3.5 mr-1" />
                                                                        <span>Helped by: {request.author}</span>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                ))
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequesterDashboard;