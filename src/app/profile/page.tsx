"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/Card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Heart, User, ArrowLeft, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProfile } from "../context/ProfileContext";
import ImageUploader from "@/components/ImageUploader";
import { uploadFile } from "@/lib/utils";

const UserProfile = () => {
    const { profile } = useProfile();

    const router = useRouter();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        role: "",
        phone: "",
        address: "",
        bio: "",
        notifications: {
            email: false,
            sms: false
        },
        image: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${profile?.userId}`,);
                const user = await response.json();

                if (user) {
                    setUserData({
                        name: user.user.name,
                        email: user.user.email,
                        role: user.user.role,
                        phone: user.user.phone,
                        address: user.user.address,
                        bio: user.user.bio,
                        notifications: {
                            email: user.user.notifications.email,
                            sms: user.user.notifications.sms
                        },
                        image: user.user.image
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: "Failed to fetch user data.",
                });
            }
        }

        if (profile) fetchUserData();

    }, [router, profile]);



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleNotificationChange = (type: string, value: boolean) => {
        setUserData({
            ...userData,
            notifications: {
                ...userData.notifications,
                [type]: value,
            },
        });
    };

    const handleRoleChange = (value: string) => {
        setUserData({
            ...userData,
            role: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/users/${profile?.userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                toast({
                    title: "Profile updated",
                    variant: 'default',
                    description: "Your profile information has been saved.",
                });
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: "Failed to update profile.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to update profile.",
            });
        }
    };

    const handleSignOut = () => {
        signOut();
        toast({
            title: "Signed out",
            variant: 'default',
            description: "You have been signed out successfully.",
        });
    };

    const handleImageChange = async (file: File | null, previewUrl: string | null) => {
        setPreviewUrl(previewUrl);
        let imageUrl = userData.image;
        // If a file was selected, upload it now
        if (file) {
            imageUrl = await uploadFile(file); // This returns the Firebase download URL
            // Update formData with the actual download URL
            setUserData({ ...userData, image: imageUrl });
        }

    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`/api/users/${profile?.userId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast({
                    title: "Account deleted",
                    variant: 'default',
                    description: "Your account has been deleted successfully.",
                });
                signOut();
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: "Failed to delete account.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to delete account.",
            });
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-4">
                <div className="max-w-4xl mx-auto w-full flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2 mx-auto">
                        <Heart className="h-6 w-6 text-rose-500" />
                        <h1 className="text-xl font-bold text-gray-800">HelpHood</h1>
                    </div>
                </div>
            </header>

            {/* Profile Content */}
            <div className="flex-1 p-4 mt-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {userData.image || previewUrl ? (
                                <>
                                    <ImageUploader onChange={handleImageChange}>
                                    <img
                                        src={previewUrl ? previewUrl : userData.image}
                                        alt="Profile"
                                        className="h-12 w-12 rounded-full"
                                    />
                                    </ImageUploader>
                                </>
                            ) : (
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <ImageUploader onChange={handleImageChange}>
                                    <User className="h-8 w-8" />
                                    </ImageUploader>
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold">{userData.name}</h1>
                                <p className="text-gray-600">{userData.email}</p>
                            </div>
                        </div>
                        <div className="space-x-2">
                            {profile?.role === "requester" && (
                                <Link href="/requester-dashboard">
                                    <Button variant="outline" className="gap-2 bg-gray-800 text-rose-300 cursor-pointer hover:bg-gray-700">
                                        <Heart className="h-4 w-4" />
                                        Check Your Requests
                                    </Button>
                                </Link>
                            )}
                            <Button variant="outline" className="gap-2 hover:bg-rose-500 hover:text-white cursor-pointer" onClick={handleSignOut}>
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="profile">
                        <TabsList className="mb-6 space-x-2">
                            <TabsTrigger value="profile" className="cursor-pointer hover:bg-gray-300">Profile Information</TabsTrigger>
                            <TabsTrigger value="account" className="cursor-pointer hover:bg-gray-300">Account Settings</TabsTrigger>
                            <TabsTrigger value="privacy" className="cursor-pointer hover:bg-gray-300">Privacy & Notifications</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Profile</CardTitle>
                                    <CardDescription>
                                        Manage your personal information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={userData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={userData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={userData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address">Address</Label>
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={userData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <textarea
                                                    id="bio"
                                                    name="bio"
                                                    value={userData.bio}
                                                    onChange={handleChange}
                                                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Your Role</Label>
                                            <RadioGroup
                                                value={userData.role}
                                                onValueChange={handleRoleChange}
                                                className="flex flex-col space-y-1"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="requester" id="role-requester" />
                                                    <Label htmlFor="role-requester" className="font-normal cursor-pointer">
                                                        I need help (Requester)
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="volunteer" id="role-volunteer" />
                                                    <Label htmlFor="role-volunteer" className="font-normal cursor-pointer">
                                                        I want to help others (Volunteer)
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <Button type="submit" className="bg-gray-700 text-white hover:bg-gray-800 cursor-pointer">Save Changes</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>
                                        Manage your account preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Password</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Current Password</Label>
                                                <Input
                                                    id="current-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">New Password</Label>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <Button className="mt-2 bg-gray-700 text-white hover:bg-gray-800 cursor-pointer">Update Password</Button>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-rose-500">Danger Zone</h3>
                                        <p className="text-sm text-gray-500">
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <Button variant="destructive" className="bg-rose-500 text-white font-bold hover:bg-red-300 cursor-pointer" onClick={handleDeleteAccount}>Delete Account</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="privacy">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Privacy & Notifications</CardTitle>
                                    <CardDescription>
                                        Manage how we contact you
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Notification Preferences</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="font-medium">Email Notifications</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Receive updates about your requests or volunteer opportunities
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userData.notifications.email}
                                                    onChange={(e) => handleNotificationChange("email", e.target.checked)}
                                                    className="h-4 w-4"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="font-medium">SMS Notifications</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Receive text messages for urgent updates
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userData.notifications.sms}
                                                    onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                                                    className="h-4 w-4"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Privacy Settings</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="visibility">Profile Visibility</Label>
                                            <select
                                                id="visibility"
                                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            >
                                                <option value="public">Public - Everyone can see my profile</option>
                                                <option value="limited">Limited - Only connected users can see my profile</option>
                                                <option value="private">Private - Only show my first name</option>
                                            </select>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Your location will always be shared with volunteers or requesters you connect with.
                                        </p>
                                    </div>

                                    <Button className="bg-gray-700 text-white hover:bg-gray-800 cursor-pointer" onClick={handleSubmit}>Save Preferences</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;