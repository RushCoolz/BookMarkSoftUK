import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toolCategories, generateToolId } from '@/data/tools';
import { ToolPageClient } from './ToolPageClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = toolCategories.flatMap(c => c.tools).find(t => generateToolId(t.title) === resolvedParams.id);
  
  if (!tool) {
    return { title: 'Tool Not Found | BookmarkSoft' };
  }

  return {
    title: `${tool.title} - Free Online Tool | BookmarkSoft`,
    description: tool.subtitle,
    openGraph: {
      title: `${tool.title} - Free Online Tool`,
      description: tool.subtitle,
      siteName: 'BookmarkSoft',
    }
  };
}

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let tool = null;
  let categoryTitle = "";
  
  for (const category of toolCategories) {
    const foundTool = category.tools.find(t => generateToolId(t.title) === resolvedParams.id);
    if (foundTool) {
      tool = foundTool;
      categoryTitle = category.title;
      break;
    }
  }
  
  if (!tool) {
    notFound();
  }

  return <ToolPageClient tool={tool} toolId={resolvedParams.id} categoryTitle={categoryTitle} />;
}
