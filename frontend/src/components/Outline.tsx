import { ChevronRight } from 'lucide-react';

interface OutlineProps {
  sections: Array<{
    title: string;
    level: number;
  }>;
  onSectionClick: (index: number) => void;
}

export function Outline({ sections, onSectionClick }: OutlineProps) {
  return (
    <div className="w-64 border-l bg-gray-50">
      <div className="p-4 border-b bg-white">
        <h2 className="font-medium">Document Outline</h2>
      </div>
      <div className="p-4">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onSectionClick(index)}
            className={`w-full text-left py-1 px-2 rounded hover:bg-gray-100 flex items-center ${
              section.level > 1 ? 'ml-' + (section.level - 1) * 4 : ''
            }`}
          >
            <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600">{section.title}</span>
          </button>
        ))}
        <button className="w-full mt-4 text-center py-2 text-blue-600 hover:bg-blue-50 rounded-md">
          Add Section
        </button>
      </div>
    </div>
  );
}