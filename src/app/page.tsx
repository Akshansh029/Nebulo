"use client";
import {
  ArrowRight,
  Github,
  Sparkles,
  FileText,
  CreditCard,
  Zap,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn, user } = useUser();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Sparkles className="size-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                Nebulo
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Button>
              {isSignedIn ? (
                <UserButton />
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-gray-300"
                    onClick={() => {
                      redirect("/sign-in");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => {
                      redirect("/sign-up");
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
              <Sparkles className="mr-1 size-3" />
              AI-Powered GitHub Analysis
            </Badge>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-6xl">
              Understand Any{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Codebase
              </span>{" "}
              Instantly
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
              Transform complex GitHub repositories into clear, actionable
              insights. Perfect for developers, teams, and newcomers who want to
              understand codebases quickly.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg text-white hover:from-blue-700 hover:to-purple-700"
                onClick={() => {
                  redirect("/sign-in");
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 px-8 py-3 text-lg"
              >
                <a
                  href="https://github.com/Akshansh029/Nebulo"
                  target="_blank"
                  className="flex items-center"
                >
                  <Github className="mr-2 size-5" />
                  View GitHub
                </a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              ✨ 150 free credits • No credit card required
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 size-20 animate-pulse rounded-full bg-blue-100 opacity-60"></div>
        <div className="absolute right-10 bottom-20 size-16 animate-pulse rounded-full bg-purple-100 opacity-60 [animation-delay:1s]"></div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to understand code
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              From repository analysis to README generation, Nebulo provides
              comprehensive tools for code comprehension.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100">
                  <Github className="size-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">
                  Smart Repository Analysis
                </CardTitle>
                <CardDescription>
                  Connect your GitHub repo and get AI-generated summaries of all
                  commits and project structure.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-100">
                  <Search className="size-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Q&A</CardTitle>
                <CardDescription>
                  Ask questions about any codebase and get instant answers with
                  relevant file references.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-100">
                  <FileText className="size-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">README Generator</CardTitle>
                <CardDescription>
                  Generate professional README files with customization options
                  and direct download.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-100">
                  <CreditCard className="size-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Credit System</CardTitle>
                <CardDescription>
                  Fair usage with 150 free credits. Buy more as needed with
                  secure Razorpay integration.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              How Nebulo Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Connect Repository</h3>
              <p className="text-gray-600">
                Provide your GitHub repo URL and access token for private
                repositories.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI processes your codebase, analyzing files and generating
                comprehensive summaries.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Query & Understand</h3>
              <p className="text-gray-600">
                Ask questions, generate READMEs, and gain deep insights into any
                codebase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, scale as you grow
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <Card className="border-2 border-gray-200 transition-colors hover:border-blue-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free Tier</CardTitle>
                <CardDescription className="text-lg">
                  Perfect for getting started
                </CardDescription>
                <div className="mt-4 text-4xl font-bold text-gray-900">
                  150{" "}
                  <span className="text-lg font-normal text-gray-600">
                    credits
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    Repository analysis
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    AI-powered Q&A
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    README generator
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    Limited Repositories
                  </li>
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => {
                    redirect("/sign-in");
                  }}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            <Card className="relative border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Credit Packs</CardTitle>
                <CardDescription className="text-lg">
                  For power users
                </CardDescription>
                <div className="mt-4 text-4xl font-bold text-gray-900">
                  ₹80{" "}
                  <span className="text-lg font-normal text-gray-600">
                    / 50 credits
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    Repository analysis
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    AI-powered Q&A
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    README generator
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-3 size-5 text-green-500" />
                    Unlimited number of Repositories
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Buy Credits
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <Sparkles className="size-5 text-white" />
                </div>
                <span className="text-xl font-bold">Nebulo</span>
              </div>
              <p className="text-gray-400">
                AI-powered GitHub repository analysis for developers and teams.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-800 pt-8 sm:flex-row">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Nebulo. All rights reserved.
            </p>
            <div className="mt-4 flex gap-6 sm:mt-0">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
