// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/Button";
// import { Label } from "@/components/ui/Label";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/Card";
// import { Heart, MapPin, User, ArrowRight, Check } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Switch } from "@/components/ui/Switch";
// import { Separator } from "@/components/ui/Separator";
// import { HelpRequest } from "../entitites/help-request";
// import clientPromise from "@/lib/mongodb";
// import { getDistanceFromLatLonInKm } from "@/lib/utils";

// const mockRequests = [
//     {
//         id: 1,
//         title: "Help with grocery shopping",
//         description: "I need assistance with weekly grocery shopping. I have a list ready and can reimburse for the groceries when delivered.",
//         location: "1.2 miles away",
//         urgency: "normal",
//         timestamp: "2 hours ago",
//         requester: "Margaret T.",
//     },
//     {
//         id: 2,
//         title: "Ride to doctor's appointment",
//         description: "I have a doctor's appointment on Thursday at 2pm and need a ride there and back. The clinic is about 15 minutes away from my home.",
//         location: "0.5 miles away",
//         urgency: "high",
//         timestamp: "5 hours ago",
//         requester: "Robert J.",
//     },
//     {
//         id: 3,
//         title: "Help setting up new tablet",
//         description: "I received a new tablet as a gift but I'm having trouble setting it up. Could someone help me configure it and show me how to use basic functions?",
//         location: "3.1 miles away",
//         urgency: "low",
//         timestamp: "1 day ago",
//         requester: "Eleanor W.",
//     },
//     {
//         id: 4,
//         title: "Yard maintenance help needed",
//         description: "Looking for help with some basic yard work - mowing the lawn and trimming some bushes. I have all the necessary equipment.",
//         location: "1.7 miles away",
//         urgency: "normal",
//         timestamp: "3 days ago",
//         requester: "Thomas H.",
//     },
// ];

// // Ask for location.
// const UrgencyBadge = ({ urgency }: { urgency: string }) => {
//     const variants: Record<string, string> = {
//         low: "bg-blue-100 text-blue-800",
//         normal: "bg-yellow-100 text-yellow-800",
//         high: "bg-red-100 text-red-800",
//     };

//     const labels: Record<string, string> = {
//         low: "Low",
//         normal: "Normal",
//         high: "Urgent",
//     };

//     return (
//         <span className={`${variants[urgency]} px-2 py-1 rounded text-xs`}>
//             {labels[urgency]}
//         </span>
//     );
// };

// const VolunteerDashboard = () => {
//     const [isAvailable, setIsAvailable] = useState(true);
//     const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
//     const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);
//     const { data: session, status } = useSession();
//     const router = useRouter();
//     const [requests, setRequests] = useState<HelpRequest[]>([]);

//     const [distance, setDistance] = useState<string | null>(null);
//     const targetLocation = { coordinates: [40.713, -74.007] }; // Example target location

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const userLat = position.coords.latitude;
//                     const userLon = position.coords.longitude;
//                     const [targetLat, targetLon] = targetLocation.coordinates;
//                     const km = getDistanceFromLatLonInKm(userLat, userLon, targetLat, targetLon);
//                     setDistance(`${km.toFixed(1)} km away`);
//                 },
//                 (error) => {
//                     console.error("Error getting location", error);
//                     setDistance("Location unavailable");
//                 }
//             );
//         } else {
//             setDistance("Geolocation not supported");
//         }
//     }, []);

//     useEffect(() => {
//         const fetchRequests = async () => {
//             if (session?.user) {
//                 const client = await clientPromise;
//                 const db = client.db("hoodhelp");
//                 const requests = await db.collection("requests").find({ status: { $ne: "completed" } }).toArray();
//                 setRequests(requests.map((request) => ({
//                     id: request._id.toString(),
//                     title: request.title,
//                     description: request.description,
//                     location: request.location,
//                     urgency: request.urgency,
//                     timestamp: request.timestamp,
//                     author: request.author,
//                     status: request.status,
//                     createdAt: request.createdAt,
//                 })));
//             }
//         };
//         fetchRequests();
//     }, [session]);
//     const toggleAvailability = () => {
//         const newAvailability = !isAvailable;
//         setIsAvailable(newAvailability);
//         toast({
//             title: newAvailability ? "You're now available" : "You're now unavailable",
//             description: newAvailability
//                 ? "You'll receive notifications for new help requests"
//                 : "You won't receive new help requests",
//         });
//     };

//     const toggleRequestDetails = (id: string) => {
//         setExpandedRequest(expandedRequest === id ? null : id);
//     };

//     const acceptRequest = (id: string) => {
//         if (!acceptedRequests.includes(id)) {
//             setAcceptedRequests([...acceptedRequests, id]);
//             toast({
//                 title: "Request accepted!",
//                 description: "The requester has been notified that you'll help them.",
//             });
//         }
//     };

//     const authenticated = status === "authenticated";

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col">
//             {/* Header */}
//             <header className="bg-white shadow-sm py-4 px-4">
//                 <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                         <Heart className="h-6 w-6 text-rose-500" />
//                         <h1 className="text-xl font-bold text-gray-800">HelpHood</h1>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         {authenticated ? (
//                             <>
//                                 {/* <Button variant="ghost" size="icon">
//                                     <Bell className="h-5 w-5" />
//                                 </Button> */}
//                                 <Link href="/profile">
//                                     <Button variant="ghost" size="icon">
//                                         <User className="h-5 w-5" />
//                                     </Button>
//                                 </Link>
//                             </>
//                         ) : (
//                             <Link href="/signin">
//                                 <Button variant="ghost" className="bg-gray-900 text-white hover:bg-gray-700">
//                                     <User className="h-5 w-5" />
//                                     Sign In
//                                 </Button>
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//             </header>

//             {/* Dashboard Content */}
//             <div className="flex-1 p-4">
//                 <div className="max-w-5xl mx-auto">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                         {/* Render Sidebar only if authenticated */}
//                         {authenticated && (
//                             <div className="lg:col-span-1 space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Volunteer Status</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="flex items-center justify-between">
//                                             <div className="space-y-0.5">
//                                                 <Label htmlFor="availability">Available to Help</Label>
//                                                 <p className="text-sm text-gray-500">Toggle off when you're busy</p>
//                                             </div>
//                                             <Switch
//                                                 id="availability"
//                                                 checked={isAvailable}
//                                                 onCheckedChange={toggleAvailability}
//                                             />
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Your Impact</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-gray-600">Requests Accepted</span>
//                                             <span className="font-semibold">8</span>
//                                         </div>
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-gray-600">Hours Volunteered</span>
//                                             <span className="font-semibold">12.5</span>
//                                         </div>
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-gray-600">People Helped</span>
//                                             <span className="font-semibold">5</span>
//                                         </div>
//                                         <Separator />
//                                         <Link href="/volunteer-history" className="flex items-center text-blue-600 hover:underline">
//                                             View your volunteer history <ArrowRight className="ml-1 h-4 w-4" />
//                                         </Link>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         )}

//                         {/* Main Content: if not authenticated, span entire width */}
//                         <div className={authenticated ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Help Requests Near You</CardTitle>
//                                     <CardDescription>
//                                         {isAvailable
//                                             ? "These seniors in your community need help"
//                                             : "You're currently marked as unavailable"}
//                                     </CardDescription>
//                                 </CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {requests.map((request) => (
//                                         <Card key={request.id} className="overflow-hidden">
//                                             <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleRequestDetails(request.id)}>
//                                                 <div className="flex justify-between items-start">
//                                                     <div>
//                                                         <CardTitle className="text-lg">{request.title}</CardTitle>
//                                                         <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
//                                                             <div className="flex items-center">
//                                                                 <MapPin className="h-3.5 w-3.5 mr-1" />
//                                                                 {request.location}
//                                                             </div>
//                                                             <span>•</span>
//                                                             <span>{request.timestamp}</span>
//                                                         </div>
//                                                     </div>
//                                                     <UrgencyBadge urgency={request.urgency} />
//                                                 </div>
//                                             </CardHeader>
//                                             {expandedRequest === request.id && (
//                                                 <>
//                                                     <CardContent className="p-4 pt-0">
//                                                         <p className="text-gray-600 mb-4">{request.description}</p>
//                                                         <div className="flex items-center text-sm text-gray-500">
//                                                             <User className="h-3.5 w-3.5 mr-1" />
//                                                             <span>Requested by {request.requester}</span>
//                                                         </div>
//                                                     </CardContent>
//                                                     <CardFooter className="p-4 pt-0 flex justify-end">
//                                                         {acceptedRequests.includes(request.id) ? (
//                                                             <Button variant="outline" className="gap-2" disabled>
//                                                                 <Check className="h-4 w-4" />
//                                                                 Accepted
//                                                             </Button>
//                                                         ) : (
//                                                             <Button onClick={() => acceptRequest(request.id)} disabled={!isAvailable} className="gap-2">
//                                                                 Accept Request
//                                                             </Button>
//                                                         )}
//                                                     </CardFooter>
//                                                 </>
//                                             )}
//                                         </Card>
//                                     ))}
//                                 </CardContent>
//                                 <CardFooter className="flex justify-center">
//                                     <Button variant="outline">Load More Requests</Button>
//                                 </CardFooter>
//                             </Card>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VolunteerDashboard;
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
    const { data: session, status } = useSession();
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    // Store user's location in state
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const router = useRouter();

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
    }, [session, router]);

    useEffect(() => {
        const fetchRequests = async () => {
            const response = await fetch('/api/requests')
            const data = await response.json();
            const nonCompletedRequests = data.requests.filter((request: HelpRequest) => request.status !== "completed");
            setRequests(nonCompletedRequests);
            console.log(nonCompletedRequests);
        };

        const fetchVolunteer = async () => {
            // check if it's logged in
            if (!session?.user?.userId && session?.user?.role !== "volunteer") return;
            try {
                // console.log(session.user);
                const res = await fetch(`/api/volunteers/${session.user.userId}`, {
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

        if (session?.user?.role !== "volunteer") {
            router.push("/request-help");
        } else {
            fetchVolunteer();
            fetchRequests();
        }
    }, [session, router]);

    const toggleAvailability = async () => {
        // check if it's logged in
        if (!session?.user?.userId) return;
        else {
            const response = await fetch(`/api/volunteers/${session.user.userId}`, {
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
            }),
        });

        if (response.status === 200) {
            const updatedRequests = requests.map((request) => request._id === id ? { ...request, status: 'accepted' } : request);
            setRequests(updatedRequests);
            toast({
                title: "Request accepted!",
                description: "The requester has been notified that you'll help them.",
            });
        } else {
            toast({
                title: "Failed to accept request",
                description: "Please try again.",
            });
        }
    };

    const authenticated = status === "authenticated";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-4">
                <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
                    <Link href="/"><div className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-rose-500" />
                        <h1 className="text-xl font-bold text-gray-800">HelpHood</h1>
                    </div></Link>
                    <div className="flex items-center gap-4">
                        {authenticated ? (
                            <Link href="/profile">
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/signin">
                                <Button variant="ghost" className="bg-gray-900 text-white hover:bg-gray-700">
                                    <User className="h-5 w-5" />
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

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
                                        {requests.slice(0, 5).map((request, index) => {
                                            // Calculate distance if user's location is available and request has a location (GeoJSON)
                                            let distanceDisplay = 'Unknown'; // fallback
                                            if (userLocation && request.location && request.location.coordinates) {
                                                // Assume request.location.coordinates = [lon, lat]
                                                const dist = getDistanceFromLatLonInKm(
                                                    userLocation.lat,
                                                    userLocation.lon,
                                                    request.location.coordinates[1],
                                                    request.location.coordinates[0]
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
                                                request.location.coordinates[1],
                                                request.location.coordinates[0]
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
    );
};

export default VolunteerDashboard;
