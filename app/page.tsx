"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/top-bar/top-bar";

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/signin");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <TopBar showLogo title="GroupGPT">
        <Button
          variant="ghost"
          onClick={ handleLoginClick }
        >
          Sign In
        </Button>
        <Button
          variant="default"
          onClick={ handleSignUpClick }
          className="hidden sm:flex"  // Hide button on small screens
        >
          Sign Up
        </Button>
      </TopBar>

      <div className="flex flex-col items-center justify-center flex-1 px-4 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-xl font-bold text-gray-900 sm:text-xl">
            Welcome to GroupGPT
          </h1>
          
          <p className="text-l text-gray-600 max-w-2xl">
            Collaborate smarter with AI-powered group conversations. 
            Share documents, ask questions, and work together seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button
              size="lg"
              onClick={handleSignUpClick}
              className="w-full sm:w-auto"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoginClick}
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="mt-16 pb-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-8">
            What you can do with GroupGPT
          </h2>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a3 3 0 01-3-3v-1" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12H5a2 2 0 01-2-2V4a2 2 0 012-2h4l4 4v2" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Group Chat</h3>
              <p className="text-sm text-gray-600">Create chatrooms and collaborate with your team in real-time</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Document Sharing</h3>
              <p className="text-sm text-gray-600">Upload and share documents with AI-powered insights</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Get intelligent responses and assistance for your projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}