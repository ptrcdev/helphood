"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Heart, ArrowLeft, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RequestHelp = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    urgency: "normal",
    location: "Auto-detected location", // Simulated for demo
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    } else {
        if (session?.user?.role === "volunteer") {
            router.push("/volunteer-dashboard");
        }
    }
  }, [status, router]);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Please provide more details";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData, userId: session?.user?.userId}),
      });

      if (response.status !== 201) {
        toast(
          {
            title: "Error submitting request",
            description: "Please try again",
          }
        );
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      setTimeout(() => {
        console.log("Help request submitted:", formData);
        
        // Show success message
        toast({
          title: "Request submitted!",
          description: "Volunteers in your area have been notified.",
        });
        
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="max-w-2xl mx-auto w-full flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to home</span>
          </Link>
          <div className="flex items-center gap-2 mx-auto">
            <Heart className="h-6 w-6 text-rose-500" />
            <h1 className="text-xl font-bold text-gray-800">HelpHood</h1>
          </div>
        </div>
      </header>

      {/* Request Help Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Request Community Help</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
                  <h3 className="font-semibold text-lg mb-2">Help is on the way!</h3>
                  <p>Your request has been sent to volunteers in your area.</p>
                </div>
                <p className="mb-6">
                  We'll notify you when someone accepts your request. You can view
                  the status of your request in your dashboard.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="bg-gray-900 text-white">
                    Create Another Request
                  </Button>
                  <Link href="/">
                    <Button>Return Home</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">What do you need help with?</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="E.g., Grocery shopping, Yard work, Ride to doctor"
                    value={formData.title}
                    onChange={handleChange}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Please provide details about your request
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what you need help with and any important details"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">How urgent is your request?</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleSelectChange("urgency", value)}
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          Low - Whenever someone is available
                        </SelectItem>
                        <SelectItem value="normal">
                          Normal - Within a few days
                        </SelectItem>
                        <SelectItem value="high">
                          High - As soon as possible
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Your Location</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="flex-1"
                        disabled
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Your location will be shared with volunteers
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 text-white mt-14"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Help Request"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestHelp;