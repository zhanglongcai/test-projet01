import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <BookOpen className="w-8 h-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900">学问·AI</span>
    </Link>
  );
}