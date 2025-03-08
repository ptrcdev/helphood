
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
import { MapPin, User, PlusCircle, Clock, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { HelpRequest } from "../entitites/help-request";
import { useRouter } from "next/navigation";
import { useProfile } from "../context/ProfileContext";
import StatusBadge from "@/components/ui/StatusBadge";
import UrgencyBadge from "@/components/ui/UrgencyBadge";
import Header from "@/components/ui/Header";
import { getDistanceFromLatLonInKm, getPostedTimeAgo } from "@/lib/utils";

const RequesterDashboard = () => {
    const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const router = useRouter();
    const { profile } = useProfile();
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location", error);
                    setUserLocation(null);
                }
            );
        } else {
            setUserLocation(null);
        }
    }, [profile, router]);

    useEffect(() => {
        const fetchRequests = async (userId: string) => {
            const response = await fetch(`/api/requests?userId=${userId}`);
            const data = await response.json();
            setRequests(data);
        };

        if (profile) {
            fetchRequests(profile.userId as string);
        }
    }, [profile, router]);

    // Toggle request details
    const toggleRequestDetails = (id: string) => {
        setExpandedRequest(expandedRequest === id ? null : id);
    };

    const cancelRequest = async (id: string) => {
        const response = await fetch(`/api/requests/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                status: 'cancelled',
            }),
        });

        if (response.status === 200) {
            const updatedRequests = requests.map((request) => request._id === id ? { ...request, status: 'cancelled' } : request);
            setRequests(updatedRequests);
            toast({
                title: "Request cancelled!",
                description: "The requester has been notified that you've cancelled the request.",
            });
        } else {
            toast({
                title: "Failed to cancel request",
                description: "Please try again.",
            });
        }
    };

    const activeRequests = requests.filter(
        req => req.status !== "completed" && req.status !== "cancelled"
    );

    const pastRequests = requests.filter(
        req => req.status === "completed" || req.status === "cancelled"
    );

    const cancelledRequests = requests.filter(
        req => req.status === "cancelled"
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Dashboard Content */}
            <div className="flex-1 p-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Welcome Back, {profile?.name}</CardTitle>
                                    <CardDescription>
                                        Manage your help requests and track their status
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Link href="/request-help">
                                        <Button className="w-full gap-2 bg-gray-900 text-white hover:bg-gray-700 cursor-pointer">
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
                                            <TabsTrigger value="active" className="cursor-pointer">Active Requests</TabsTrigger>
                                            <TabsTrigger value="past" className="cursor-pointer">Past Requests</TabsTrigger>
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
                                                activeRequests.map((request) => (
                                                    <Card key={request._id} className="overflow-hidden">
                                                        <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleRequestDetails(request._id)}>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <CardTitle className="text-lg">{request.title}</CardTitle>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                                                                        <div className="flex items-center">
                                                                            <MapPin className="h-3.5 w-3.5 mr-1" />
                                                                            {userLocation ? `${getDistanceFromLatLonInKm(
                                                                                request.location.coordinates[0],
                                                                                request.location.coordinates[1],
                                                                                userLocation?.lat,
                                                                                userLocation?.lon
                                                                            )} km away` : 'Unknown'}
                                                                        </div>
                                                                        <span>•</span>
                                                                        <div className="flex items-center">
                                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                                            {getPostedTimeAgo(request.createdAt)}
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
                                                                            <span>Accepted by: {request.acceptedBy}</span>
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                                <CardFooter className="p-4 pt-0 flex justify-end">
                                                                    {request.status === "cancelled" ? (
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
                                                                            {userLocation ? `${getDistanceFromLatLonInKm(
                                                                                request.location.coordinates[0],
                                                                                request.location.coordinates[1],
                                                                                userLocation?.lat,
                                                                                userLocation?.lon
                                                                            )} km away` : "Unknown"}
                                                                            {/* {request.location} */}
                                                                        </div>
                                                                        <span>•</span>
                                                                        <div className="flex items-center">
                                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                                            {getPostedTimeAgo(request.createdAt)}
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