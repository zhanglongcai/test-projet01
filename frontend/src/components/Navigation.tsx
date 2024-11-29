import { Link } from 'react-router-dom';
import { Bot, Menu, User, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FreeNoAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link to="/detect" className="text-sm font-medium hover:text-primary">
              Detection
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                to="/detect"
                className="px-4 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Detection
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/login"
                className="mx-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}