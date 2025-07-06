import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface TaskEnhancement {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  suggestedDeadline: string;
  confidence: number;
}

export interface ExtractedTask {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
}

export const enhanceTask = async (
  title: string,
  description: string = '',
  existingTasks: any[] = []
): Promise<TaskEnhancement> => {
  try {
    const prompt = `
You are an AI task management assistant. Enhance the following task with better details:

Original Task:
- Title: "${title}"
- Description: "${description}"

Context (existing tasks count: ${existingTasks.length}):
${existingTasks.slice(0, 3).map(t => `- ${t.title} (${t.priority} priority, due: ${t.deadline})`).join('\n')}

Please provide an enhanced version with:
1. A clear, actionable title
2. A detailed description with specific steps if needed
3. Appropriate category (Work, Personal, Health, Finance, Shopping, Travel)
4. Priority level (high, medium, low) based on urgency and importance
5. Suggested deadline (YYYY-MM-DD format, within next 30 days)
6. Confidence score (0-1) for your suggestions

Respond in JSON format:
{
  "title": "enhanced title",
  "description": "detailed description",
  "category": "category",
  "priority": "priority",
  "suggestedDeadline": "YYYY-MM-DD",
  "confidence": 0.85
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    const enhancement = JSON.parse(content) as TaskEnhancement;
    return enhancement;
  } catch (error) {
    console.error('Error enhancing task:', error);
    // Fallback enhancement
    return {
      title: title || 'New Task',
      description: description || 'Task description',
      category: 'Work',
      priority: 'medium',
      suggestedDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      confidence: 0.5
    };
  }
};

export const extractTasksFromContext = async (
  content: string,
  sourceType: string
): Promise<ExtractedTask[]> => {
  try {
    const prompt = `
You are an AI assistant that extracts actionable tasks from various types of content.

Content Type: ${sourceType}
Content: "${content}"

Analyze this content and extract any actionable tasks, deadlines, or commitments. For each task found:

1. Create a clear, specific title
2. Provide a detailed description
3. Assign appropriate category (Work, Personal, Health, Finance, Shopping, Travel)
4. Set priority (high, medium, low) based on urgency/importance
5. Extract or suggest deadline if mentioned or implied

Return a JSON array of tasks:
[
  {
    "title": "task title",
    "description": "detailed description",
    "category": "category",
    "priority": "priority",
    "deadline": "YYYY-MM-DD or null"
  }
]

If no clear tasks are found, return an empty array [].
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) return [];

    const tasks = JSON.parse(responseContent) as ExtractedTask[];
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error('Error extracting tasks from context:', error);
    return [];
  }
};