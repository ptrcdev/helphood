"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Heart, MapPin, User, ArrowRight, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/Switch";
import { Separator } from "@/components/ui/Separator";
import { HelpRequest } from "../entitites/help-request";
import { getDistanceFromLatLonInKm } from "@/lib/utils";
import { Volunteer } from "../entitites/volunteer";
import Header from "@/components/ui/Header";
import { useProfile } from "../context/ProfileContext";
import LoadingWheel from "@/components/LoadingWheel";

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
        <span className={`${variants[urgency]} px-2 py-1 rounded text-xs`}>
            {labels[urgency]}
        </span>
    );
};

const VolunteerDashboard = () => {
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    // Store user's location in state
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const router = useRouter();
    const { profile } = useProfile();
    const { data: _, status } = useSession();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error: GeolocationPositionError) => {
                    console.error("Error getting location", error);
                    setUserLocation(null);
                }
            );
        } else {
            setUserLocation(null);
        }
    }, [profile]);

    useEffect(() => {
        const fetchRequests = async () => {
            const response = await fetch('/api/requests')
            const data = await response.json();
            const nonCompletedRequests = data.requests.filter((request: HelpRequest) => request.status !== "completed" && request.status !== "cancelled");
            setRequests(nonCompletedRequests);
        };

        const fetchVolunteer = async () => {
            // check if it's logged in
            if (!profile?.userId || profile?.role !== "volunteer") {
                return;
            }
            try {
                // console.log(session.user);
                const res = await fetch(`/api/volunteers/${profile.userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                setVolunteer(data);
                setIsAvailable(data.availability);
            } catch (error) {
                console.error("Error fetching volunteer status", error);
            }
        }


        fetchVolunteer();
        fetchRequests();

    }, [profile, router]);

    const toggleAvailability = async () => {
        // check if it's logged in
        if (!profile?.userId || profile?.role !== "volunteer") return;
        else {
            const response = await fetch(`/api/volunteers/${profile.userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    availability: !isAvailable,
                }),
            });

            if (response.status !== 200) {
                toast(
                    {
                        title: "Error toggling availability",
                        variant: 'destructive',
                        description: "Please try again",
                    }
                );
                return;
            }

            const newAvailability = !isAvailable;
            setIsAvailable(newAvailability);
            toast({
                title: newAvailability ? "You're now available" : "You're now unavailable",
                description: newAvailability
                    ? "You'll receive notifications for new help requests"
                    : "You won't receive new help requests",
            });
        }

    };

    const toggleRequestDetails = (id: string) => {
        setExpandedRequest(expandedRequest === id ? null : id);
    };

    const acceptRequest = async (id: string) => {
        const response = await fetch(`/api/requests/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                status: 'accepted',
                userId: profile?.userId,
            }),
        });

        if (response.status === 200) {
            const updatedRequests = requests.map((request: HelpRequest) => request._id === id ? { ...request, status: 'accepted' } : request);
            setRequests(updatedRequests);
            toast({
                title: "Request accepted!",
                variant: 'default',
                description: "The requester has been notified that you'll help them.",
            });
        } else {
            toast({
                title: "Failed to accept request",
                variant: 'destructive',
                description: "Please try again.",
            });
        }
    };

    const authenticated = status === "authenticated";

    // Calculate unique people helped
    const uniqueUserIds = new Set(requests
        .filter((request: HelpRequest) => request.status === "completed")
        .map((request: HelpRequest) => request.author)); // Assuming 'author' holds the userId of the person who helped

    const peopleHelped = uniqueUserIds.size; // Count of unique user IDs

    return status === 'authenticated' && profile ? (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Dashboard Content */}
            <div className="flex-1 p-4">
                <div className="max-w-5xl mx-auto">
                    {authenticated ? (
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
                                                <p className="text-sm text-gray-500">Toggle off when you're busy</p>
                                            </div>
                                            <Switch
                                                id="availability"
                                                checked={isAvailable ?? false}
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
                                            <span className="font-semibold">{volunteer?.requests.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">People Helped</span>
                                            <span className="font-semibold">{peopleHelped}</span>
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
                                        {requests.slice(0, 5).map((request: HelpRequest, index: number) => {
                                            // Calculate distance if user's location is available and request has a location (GeoJSON)
                                            let distanceDisplay = 'Unknown'; // fallback
                                            if (userLocation && request.location && request.location.coordinates) {
                                                // Assume request.location.coordinates = [lon, lat]
                                                const dist = getDistanceFromLatLonInKm(
                                                    userLocation.lat,
                                                    userLocation.lon,
                                                    request.location.coordinates[0],
                                                    request.location.coordinates[1]
                                                );
                                                distanceDisplay = `${dist.toFixed(1)} km away`;
                                            }
                                            return (
                                                <Card key={request._id ?? index} className="overflow-hidden">
                                                    <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleRequestDetails(request._id)}>
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <CardTitle className="text-lg">{request.title}</CardTitle>
                                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                                                        <span>{distanceDisplay}</span>
                                                                    </div>
                                                                    <span>•</span>
                                                                    <span>{request.createdAt.toString()}</span>
                                                                </div>
                                                            </div>
                                                            <UrgencyBadge urgency={request.urgency} />
                                                        </div>
                                                    </CardHeader>
                                                    {expandedRequest === request._id && (
                                                        <>
                                                            <CardContent className="p-4 pt-0">
                                                                <p className="text-gray-600 mb-4">{request.description}</p>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <User className="h-3.5 w-3.5 mr-1" />
                                                                    <span>Requested by {request.author}</span>
                                                                </div>
                                                            </CardContent>
                                                            <CardFooter className="p-4 pt-0 flex justify-end">
                                                                {request.status === "accepted" ? (
                                                                    <Button variant="outline" className="gap-2" disabled>
                                                                        <Check className="h-4 w-4" />
                                                                        Accepted
                                                                    </Button>
                                                                ) : (
                                                                    <Button onClick={() => acceptRequest(request._id)} disabled={!isAvailable} className="gap-2 hover:shadow-md bg-green-200 cursor-pointer hover:bg-green-300">
                                                                        Accept Request
                                                                    </Button>
                                                                )}
                                                            </CardFooter>
                                                        </>
                                                    )}
                                                </Card>
                                            );
                                        })}
                                    </CardContent>
                                    {requests.length > 5 && (
                                        <CardFooter className="flex justify-center">
                                            <Button variant="outline">Load More Requests</Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            </div>
                        </div>
                    ) : (
                        // If not authenticated, render centered main content in a narrower container
                        <div className="mx-auto max-w-xl space-y-6">
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
                                    {requests.slice(0, 5).map((request, index) => {
                                        let distanceDisplay = 'Unknown'; // fallback
                                        if (userLocation && request.location && request.location.coordinates) {
                                            const dist = getDistanceFromLatLonInKm(
                                                userLocation.lat,
                                                userLocation.lon,
                                                request.location.coordinates[0],
                                                request.location.coordinates[1]
                                            );
                                            distanceDisplay = `${dist.toFixed(1)} km away`;
                                        }
                                        return (
                                            <Card key={request._id ?? index} className="overflow-hidden">
                                                <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleRequestDetails(request._id)}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg">{request.title}</CardTitle>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                                                                <div className="flex items-center">
                                                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                                                    <span>{distanceDisplay}</span>
                                                                </div>
                                                                <span>•</span>
                                                                <span>{request.createdAt.toString()}</span>
                                                            </div>
                                                        </div>
                                                        <UrgencyBadge urgency={request.urgency} />
                                                    </div>
                                                </CardHeader>
                                                {expandedRequest === request._id && (
                                                    <>
                                                        <CardContent className="p-4 pt-0">
                                                            <p className="text-gray-600 mb-4">{request.description}</p>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <User className="h-3.5 w-3.5 mr-1" />
                                                                <span>Requested by {request.author}</span>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="p-4 pt-0 flex justify-end">
                                                            {request.status === "accepted" ? (
                                                                <Button variant="outline" className="gap-2" disabled>
                                                                    <Check className="h-4 w-4" />
                                                                    Accepted
                                                                </Button>
                                                            ) : (
                                                                <Button onClick={() => acceptRequest(request._id)} disabled={!isAvailable} className="gap-2 hover:shadow-md bg-green-200 cursor-pointer hover:bg-green-300">
                                                                    Accept Request
                                                                </Button>
                                                            )}
                                                        </CardFooter>
                                                    </>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </CardContent>
                                {requests.length > 5 && (
                                    <CardFooter className="flex justify-center">
                                        <Button variant="outline">Load More Requests</Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : <LoadingWheel />;
};

export default VolunteerDashboard;
