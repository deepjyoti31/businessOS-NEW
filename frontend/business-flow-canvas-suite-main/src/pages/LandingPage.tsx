import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, BarChart3, FileText, Users, Briefcase, Zap, Globe, Shield, Code, Menu, X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import '@/styles/landing-page.css';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BusinessOS</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors font-medium">Features</a>
            <a href="#use-cases" className="text-gray-600 hover:text-primary transition-colors font-medium">Use Cases</a>
            <a href="#ai-capabilities" className="text-gray-600 hover:text-primary transition-colors font-medium">AI Capabilities</a>
            <a href="https://github.com/yourusername/businessOS" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </nav>

          <div className="hidden md:flex space-x-4">
            <Link to="/login">
              <Button variant="outline" className="rounded-full px-6">Log In</Button>
            </Link>
            <Link to="/register">
              <Button className="rounded-full px-6 shadow-md bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">Sign Up Free</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 border-b border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#use-cases"
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Use Cases
              </a>
              <a
                href="#ai-capabilities"
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Capabilities
              </a>
              <a
                href="https://github.com/yourusername/businessOS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
              <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col space-y-4">
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link
                  to="/register"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">Sign Up Free</Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section hero-gradient py-20">
        <div className="blob-shape blob-1"></div>
        <div className="blob-shape blob-2"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center hero-content">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="hero-heading text-4xl md:text-6xl font-bold mb-6">
                AI-First Business Management Platform
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline your operations with an intelligent platform that integrates all your business functions, powered by advanced AI capabilities.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg" className="cta-button w-full sm:w-auto">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="cta-button w-full sm:w-auto">
                    Explore Features
                  </Button>
                </a>
              </div>
              <div className="mt-8 text-sm text-gray-500">
                <p>Open source. Free for all. No credit card required.</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="hero-image">
                <img
                  src="/images/dashboard-mockup.svg"
                  alt="BusinessOS Dashboard"
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400?text=BusinessOS+Dashboard';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section id="ai-capabilities" className="py-20 bg-white relative overflow-hidden">
        <div className="blob-shape blob-1" style={{ top: '60%', right: '10%' }}></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-3xl md:text-4xl font-bold">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform leverages cutting-edge AI technology to transform how you manage your business documents and operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="feature-card p-8 rounded-lg shadow-sm">
                <div className="ai-feature-icon inline-block rounded-lg">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold my-3">Intelligent Document Processing</h3>
                <p className="text-gray-600">
                  Automatically extract text, classify documents, generate summaries, and identify key entities with our AI-powered document analysis.
                </p>
              </div>

              <div className="feature-card p-8 rounded-lg shadow-sm">
                <div className="ai-feature-icon inline-block rounded-lg">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold my-3">Semantic Search</h3>
                <p className="text-gray-600">
                  Find documents based on meaning, not just keywords, with our vector-based semantic search powered by Azure OpenAI embeddings.
                </p>
              </div>

              <div className="feature-card p-8 rounded-lg shadow-sm">
                <div className="ai-feature-icon inline-block rounded-lg">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold my-3">AI Content Generation</h3>
                <p className="text-gray-600">
                  Create professional documents, summaries, and reports with AI-powered content generation and customizable templates.
                </p>
              </div>

              <div className="feature-card p-8 rounded-lg shadow-sm">
                <div className="ai-feature-icon inline-block rounded-lg">
                  <Globe className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold my-3">AI Assistants</h3>
                <p className="text-gray-600">
                  Get help with tasks, answer questions, and receive recommendations from our intelligent AI assistants.
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <img
                src="/images/ai-document.svg"
                alt="AI Document Processing"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 flex items-center justify-center">
              <img
                src="/images/ai-assistant.svg"
                alt="AI Assistant"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="feature-card p-8 rounded-lg shadow-sm">
                <div className="ai-feature-icon inline-block rounded-lg">
                  <BarChart3 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold my-3">Financial Insights</h3>
                <p className="text-gray-600">
                  Get AI-powered analysis of your financial data with automatic categorization, trend detection, and actionable recommendations.
                </p>
              </div>

              <div className="feature-card p-8 rounded-lg shadow-sm">
                <div className="ai-feature-icon inline-block rounded-lg">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold my-3">Smart HR Management</h3>
                <p className="text-gray-600">
                  Optimize your workforce with AI-assisted employee management, performance analysis, and department optimization.
                </p>
              </div>

              <div className="feature-card p-8 rounded-lg shadow-sm md:col-span-2">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                    <div className="ai-feature-icon inline-block rounded-lg mb-3">
                      <Brain className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Powered by Azure OpenAI</h3>
                    <p className="text-gray-600">
                      Our platform integrates with Azure OpenAI to provide state-of-the-art AI capabilities, ensuring your business benefits from the latest advancements in artificial intelligence.
                    </p>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <code className="text-sm text-primary">
                        <pre>
                          {`{
  "model": "azure-openai",
  "capabilities": [
    "document-analysis",
    "semantic-search",
    "content-generation"
  ]
}`}
                        </pre>
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="blob-shape blob-2" style={{ bottom: '20%', left: '5%' }}></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-3xl md:text-4xl font-bold">Comprehensive Business Management</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BusinessOS brings together all the essential tools your small business needs in one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src="/images/finance-chart.svg"
                  alt="Finance Management"
                  className="w-full md:w-64 h-auto rounded-lg shadow-md"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Finance Management</h3>
                <p className="text-gray-600 mb-4">
                  Track transactions, create invoices, manage budgets, and generate financial reports with AI-powered insights.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Transaction tracking and categorization
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Invoice creation and management
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Budget planning and performance tracking
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src="/images/hr-management.svg"
                  alt="HR Management"
                  className="w-full md:w-64 h-auto rounded-lg shadow-md"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">HR & People Management</h3>
                <p className="text-gray-600 mb-4">
                  Manage employees, departments, and HR processes with intelligent tools and automation.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Employee profiles and management
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Department organization
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Performance tracking and reporting
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src="/images/project-management.svg"
                  alt="Project Management"
                  className="w-full md:w-64 h-auto rounded-lg shadow-md"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Project & Task Management</h3>
                <p className="text-gray-600 mb-4">
                  Plan, track, and manage projects and tasks with intuitive tools and AI assistance.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Project planning and tracking
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Task assignment and status tracking
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Kanban boards for visual workflow management
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src="/images/ai-document.svg"
                  alt="Document Management"
                  className="w-full md:w-64 h-auto rounded-lg shadow-md"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Document Management</h3>
                <p className="text-gray-600 mb-4">
                  Store, organize, and collaborate on documents with version control, sharing, and AI-powered insights.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Intelligent document organization
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Automatic text extraction and analysis
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-1 rounded-full mr-3">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    Secure document sharing and collaboration
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-white relative overflow-hidden">
        <div className="blob-shape blob-1" style={{ top: '70%', right: '10%' }}></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-3xl md:text-4xl font-bold">Perfect For Your Business</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BusinessOS is designed to help various types of small businesses streamline their operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="use-case-card bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Professional Services</h3>
              <p className="text-gray-600 mb-6">
                Law firms, accounting practices, consultancies, and other professional service providers can manage clients, documents, and projects efficiently.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Client document management
                </li>
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Time tracking and invoicing
                </li>
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Project management and reporting
                </li>
              </ul>
            </div>

            <div className="use-case-card bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Retail Businesses</h3>
              <p className="text-gray-600 mb-6">
                Retail stores, e-commerce businesses, and small shops can manage inventory, finances, and customer relationships with our integrated platform.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Financial tracking and reporting
                </li>
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Employee management
                </li>
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Document organization
                </li>
              </ul>
            </div>

            <div className="use-case-card bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Service Providers</h3>
              <p className="text-gray-600 mb-6">
                Home services, healthcare providers, and other service-based businesses can streamline operations and client management with our AI-powered tools.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Service scheduling and tracking
                </li>
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Client documentation
                </li>
                <li className="flex items-center">
                  <div className="bg-primary/10 p-1 rounded-full mr-3">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  Financial management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary/5 relative overflow-hidden">
        <div className="blob-shape blob-2" style={{ bottom: '10%', left: '5%', opacity: '0.3' }}></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="section-heading text-3xl md:text-4xl font-bold">Open Source & Free For All</h2>
              <p className="text-xl text-gray-600 mb-8">
                BusinessOS is completely open source and free to use. We believe in the power of community-driven development and making powerful business tools accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="https://github.com/yourusername/businessOS" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="cta-button w-full sm:w-auto bg-[#24292e] hover:bg-[#24292e]/90">
                    <Code className="mr-2 h-5 w-5" /> View on GitHub
                  </Button>
                </a>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="cta-button w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              <div className="mt-12">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Our Commitment</h3>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span>No hidden fees or premium features - everything is included for free</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span>Community-driven development with transparent roadmap</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span>Enterprise-grade tools without the enterprise price tag</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg transform rotate-3"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md transform -rotate-1">
                  <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                      <Code className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
                    <p className="text-gray-600">
                      Contribute to the project, report issues, or suggest new features.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <code className="text-sm text-gray-800 block">
                      <span className="text-green-600">git clone</span> https://github.com/yourusername/businessOS.git
                    </code>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-[#24292e] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </div>
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-12">
            <div className="mb-12 md:mb-0 md:w-1/3">
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">BusinessOS</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                An AI-first business management platform for small businesses. Open source and free for all. Powered by Azure OpenAI and Agno.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1.41 16.09V8.09c0-.35.44-.53.7-.29l6.17 4.41c.22.17.22.5 0 .67l-6.17 4.41c-.26.24-.7.06-.7-.29z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
              <div>
                <h3 className="text-lg font-semibold mb-6">Platform</h3>
                <ul className="space-y-4">
                  <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#ai-capabilities" className="text-gray-300 hover:text-white transition-colors">AI Capabilities</a></li>
                  <li><a href="#use-cases" className="text-gray-300 hover:text-white transition-colors">Use Cases</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Resources</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Reference</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Company</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} BusinessOS. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all z-50 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
