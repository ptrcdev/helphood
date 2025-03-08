
import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingWheelProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  logoClassName?: string;
}

const LoadingWheel = ({
  size = "md",
  className,
  logoClassName,
}: LoadingWheelProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn("min-h-screen relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-4 border-primary",
          sizeClasses[size]
        )}
      />
      <Heart
        className={cn(
          "absolute text-rose-500 animate-pulse",
          {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "md",
            "h-8 w-8": size === "lg",
          },
          logoClassName
        )}
      />
    </div>
  );
};

export default LoadingWheel;