import { Bold, Italic, Underline, List, Image, Table, BarChart, Copy, Trash } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="border-b bg-white">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex items-center space-x-1 py-2">
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <button className="p-1.5 rounded hover:bg-gray-100">
              <List className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Image className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Table className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100">
              <BarChart className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[calc(100vh-12rem)] resize-none border-0 bg-transparent p-0 focus:ring-0 text-lg"
          placeholder="Start writing or type '/' for commands..."
        />
      </div>
    </div>
  );
}