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
    <div className="flex flex-col h-full w-full items-center">
      <TopBar showLogo title="GroupGPT">
        <Button variant="ghost" onClick={handleLoginClick}>
          Sign In
        </Button>
        <Button variant="default" onClick={handleSignUpClick} className="hidden sm:flex">
          Sign Up
        </Button>
      </TopBar>

      <div className="flex flex-col items-center flex-1 w-full">
        {/* Hero Section */}
        <section className="text-center py-16 px-4 w-full bg-gradient-to-b from-indigo-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Collaborate smarter on coursework and research
            </h1>
            <p className="text-xl text-gray-600 my-8 max-w-3xl mx-auto">
              Transform your group projects with intelligent chatrooms that understand your documents, 
              search the web, run code, and provide research-backed answers in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleSignUpClick} className="w-full sm:w-auto px-8">
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={handleLoginClick} className="w-full sm:w-auto px-8">
                Sign In
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-16 px-4 w-full bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Chatroom-specific Knowledge Bases */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-t-4 border-blue-500 hover:-translate-y-1 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Project-Specific Knowledge</h3>
                <p className="text-sm text-gray-600">
                  Upload different documents to separate chatrooms. Each project gets its own AI-powered knowledge base.
                </p>
              </div>

              {/* Real-time Collaboration */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-t-4 border-emerald-500 hover:-translate-y-1 hover:shadow-md transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a3 3 0 01-3-3v-1" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12H5a2 2 0 01-2-2V4a2 2 0 012-2h4l4 4v2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Collaboration</h3>
                <p className="text-sm text-gray-600">
                  Chat with teammates and GroupGPT simultaneously. Everyone sees GroupGPT&apos;s responses instantly for seamless knowledge sharing.
                </p>
              </div>

              {/* Multimodal Inputs */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-t-4 border-violet-500 hover:-translate-y-1 hover:shadow-md transition">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Images & Text</h3>
                <p className="text-sm text-gray-600">
                  Upload diagrams, charts, and images. GroupGPT can analyze and explain visual content alongside text.
                </p>
              </div>

              {/* AI Tools */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-t-4 border-amber-500 hover:-translate-y-1 hover:shadow-md transition">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Intelligent Tools</h3>
                <p className="text-sm text-gray-600">
                  Web search, Python calculations, ArXiv research papers, and document retrieval &mdash; all in one chat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 px-4 w-full bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perfect for Every Educational Scenario
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              <div className="bg-blue-50 p-8 rounded-2xl text-center flex flex-col h-full shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900">Research Projects</h3>
                <p className="text-gray-600 mt-3">
                  Upload research papers, generate summaries, search ArXiv for related work, and collaborate on literature reviews.
                </p>
                <div className="mt-auto" />
              </div>

              <div className="bg-green-50 p-8 rounded-2xl text-center flex flex-col h-full shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900">STEM Coursework</h3>
                <p className="text-gray-600 mt-3">
                  Solve complex calculations with Python and get explanations for mathematical concepts.
                </p>
                <div className="mt-auto" />
              </div>

              <div className="bg-purple-50 p-8 rounded-2xl text-center flex flex-col h-full shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900">Group Assignments</h3>
                <p className="text-gray-600 mt-3">
                  Share project documents, brainstorm ideas, and get GroupGPT&apos;s assistance while maintaining team communication.
                </p>
                <div className="mt-auto" />
              </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Get Started in 3 Simple Steps
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-indigo-600 cursor-default hover:-translate-y-1 hover:shadow-md transition">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create a Chatroom</h3>
                <p className="text-sm text-gray-600">Set up a dedicated space for your project or study group</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-indigo-600 cursor-default hover:-translate-y-1 hover:shadow-md transition">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Documents</h3>
                <p className="text-sm text-gray-600">Add your PDFs, images, and materials to build your knowledge base</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-indigo-600 cursor-default hover:-translate-y-1 hover:shadow-md transition">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Collaborating</h3>
                <p className="text-sm text-gray-600">Chat with AI and teammates to unlock insights from your content</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="w-full bg-gradient-to-b from-white to-indigo-50">
          <section className="px-4 py-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Create your first chatroom</h2>
              <p className="mt-2 text-gray-600">
                Create a room, upload your materials, and invite your team. Get answers in seconds.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={handleSignUpClick} className="w-full sm:w-auto">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" onClick={handleLoginClick} className="w-full sm:w-auto">
                  Sign In
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}