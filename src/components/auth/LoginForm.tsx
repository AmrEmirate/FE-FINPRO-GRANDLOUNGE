// src/components/auth/LoginForm.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { SocialLogin } from "@/components/auth/social-login";

// Definisikan tipe untuk props agar lebih aman
type LoginFormProps = {
    userType: string;
    formData: { email: string; password: string };
    isLoading: boolean;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
};

export function LoginForm({
    userType,
    formData,
    isLoading,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleSubmit,
}: LoginFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input Email */}
                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="pl-10" placeholder="Enter your email" />
                        </div>
                    </div>
                    {/* Input Password */}
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleInputChange} className="pl-10 pr-10" placeholder="Enter your password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <Link href="/auth/forgot-password" className="text-sm text-amber-600 hover:text-amber-500">
                            Forgot password?
                        </Link>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
                <SocialLogin type="login" />
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href={`/auth/register?type=${userType}`} className="font-medium text-amber-600">
                            Sign up
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}