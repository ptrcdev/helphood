"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { uploadFile } from "@/lib/utils";

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "requester", // Default role
        bio: "",
        address: "",
        phone: "",
        notifications: {
            email: true,
            sms: true,
        },
        image: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [step, setStep] = useState(1); // Track the current step of the form
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleRoleChange = (value: string) => {
        setFormData({
            ...formData,
            role: value,
        });
    };

    const handleNotificationChange = (type: string, checked: boolean) => {
        setFormData({
            ...formData,
            notifications: {
                ...formData.notifications,
                [type]: checked,
            },
        });
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 3) {
            try {
                let imageUrl = formData.image;
                // If a file was selected, upload it now
                if (selectedFile) {
                    imageUrl = await uploadFile(selectedFile); // This returns the Firebase download URL
                    // Update formData with the actual download URL
                    setFormData((prev) => ({ ...prev, image: imageUrl }));
                }


                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    body: JSON.stringify({ ...formData, image: imageUrl }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setErrors(data.errors || { general: "An error occurred" });
                    return;
                } else {
                    router.push("/signin");
                }

                // Show success message
                toast({
                    title: "Account created!",
                    description: "Welcome to HelpHood! You are now signed up.",
                });
            } catch (err: any) {
                setErrors(err);
            }

            // In a real app, we would redirect to the appropriate dashboard
            console.log(`User would be redirected to ${formData.role === "requester" ? "request help" : "volunteer"} page`);
        } else {
            nextStep();
        }
    };

    const handleImageChange = (file: File | null, previewUrl: string | null) => {
        setSelectedFile(file);
        setPreviewUrl(previewUrl); // create preview url for image
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-4">
                <div className="max-w-md mx-auto w-full flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Back to home</span>
                    </Link>
                    <div className="flex items-center gap-2 mx-auto">
                        <Heart className="h-6 w-6 text-rose-500" />
                        <h1 className="text-xl font-bold text-gray-800">HelpHood</h1>
                    </div>
                </div>
            </header>

            {/* Sign Up Form */}
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create your account</CardTitle>
                        <CardDescription>
                            {step === 1 && "Step 1: Basic Information"}
                            {step === 2 && "Step 2: Contact Details"}
                            {step === 3 && "Step 3: Finalize Your Profile"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={errors.name ? "border-red-500" : ""}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={errors.password ? "border-red-500" : ""}
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-sm">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label>I want to:</Label>
                                        <RadioGroup
                                            value={formData.role}
                                            onValueChange={handleRoleChange}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="requester" id="requester" />
                                                <Label htmlFor="requester" className="font-normal cursor-pointer">
                                                    Request help (I'm a senior or need assistance)
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="volunteer" id="volunteer" />
                                                <Label htmlFor="volunteer" className="font-normal cursor-pointer">
                                                    Volunteer (I want to help others)
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            placeholder="Enter your address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={errors.address ? "border-red-500" : ""}
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-sm">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={errors.phone ? "border-red-500" : ""}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Notification Preferences</Label>
                                        <div className="flex flex-col gap-2 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="email-notifications"
                                                    checked={formData.notifications.email}
                                                    onCheckedChange={(checked) =>
                                                        handleNotificationChange("email", checked as boolean)
                                                    }
                                                />
                                                <Label htmlFor="email-notifications" className="font-normal">
                                                    Email notifications
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="sms-notifications"
                                                    checked={formData.notifications.sms}
                                                    onCheckedChange={(checked) =>
                                                        handleNotificationChange("sms", checked as boolean)
                                                    }
                                                />
                                                <Label htmlFor="sms-notifications" className="font-normal">
                                                    SMS notifications
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio (Optional)</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            placeholder="Tell us a bit about yourself"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image">Profile Image (Optional)</Label>
                                        <div className="flex items-center gap-2">
                                            {previewUrl && (
                                                <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Profile preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <label
                                                htmlFor="image-upload"
                                                className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                <Upload className="h-4 w-4" />
                                                <ImageUploader onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 mt-4">
                                        <p>By completing signup, you agree to HelpHood's Terms of Service and Privacy Policy.</p>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-between pt-4">
                                {step > 1 ? (
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Back
                                    </Button>
                                ) : (
                                    <div></div>
                                )}
                                <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-700">
                                    {step < 3 ? "Continue" : "Complete Signup"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-blue-600 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SignUp;