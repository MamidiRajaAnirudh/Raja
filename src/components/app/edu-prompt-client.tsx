
'use client';

import { useState, useRef, useTransition } from 'react';
import { Lightbulb, Send, BookMarked } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { generateExplanationAndQuiz } from '@/app/actions';
import { parseQuizText } from '@/lib/quiz-parser';
import { useToast } from '@/hooks/use-toast';
import type { Quiz } from '@/lib/types';
import { QuizForm } from './quiz-form';
import { Separator } from '../ui/separator';

type View = 'form' | 'loading' | 'content';

export function EduPromptClient() {
  const [view, setView] = useState<View>('form');
  const [explanation, setExplanation] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();

  const handleFormSubmit = async (formData: FormData) => {
    const topic = formData.get('topic');
    if (!topic || typeof topic !== 'string' || topic.trim().length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid Topic",
        description: "Please enter a topic with at least 2 characters.",
      });
      return;
    }

    setView('loading');
    startTransition(async () => {
      const result = await generateExplanationAndQuiz(formData);
      if (result.status === 'error') {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.message,
        });
        setView('form');
      } else if (result.explanation && result.quiz) {
        setExplanation(result.explanation);
        const parsedQuiz = parseQuizText(result.quiz);
        if (parsedQuiz.questions.length === 0) {
            toast({
                variant: "destructive",
                title: "Quiz Parsing Failed",
                description: "The AI generated a quiz in an unexpected format. Please try again.",
            });
            setView('form');
            return;
        }
        setQuiz(parsedQuiz);
        setView('content');
      }
    });
  };

  const handleReset = () => {
    setView('form');
    setExplanation('');
    setQuiz(null);
    formRef.current?.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <header className="text-center mb-10 relative">
        <div className="absolute top-0 right-0">
          <Button asChild variant="outline">
            <Link href="/history">
              <BookMarked />
              History
            </Link>
          </Button>
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          EduPrompt
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Unlock knowledge with AI-powered explanations and quizzes.
        </p>
      </header>

      {view === 'form' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Lightbulb className="text-primary" />
              Enter a Topic to Learn
            </CardTitle>
            <CardDescription>
              For example: "Photosynthesis", "The Roman Empire", or "Machine Learning".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <Label htmlFor="topic-input" className="sr-only">Topic</Label>
                <Input
                  id="topic-input"
                  name="topic"
                  placeholder="What do you want to learn about today?"
                  className="h-12 text-base"
                  required
                  minLength={2}
                />
              </div>
              <Button type="submit" size="lg" className="h-12" disabled={isPending}>
                Generate <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {view === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
            <svg
                className="animate-spin h-12 w-12 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                ></circle>
                <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <h2 className="font-headline text-2xl font-semibold">Generating your lesson...</h2>
            <p className="text-muted-foreground">The AI is warming up. This might take a moment.</p>
        </div>
      )}

      {view === 'content' && explanation && quiz && (
        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Your Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-headline text-2xl font-semibold border-b pb-2 mb-4">Explanation</h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{explanation}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-headline text-2xl font-semibold mb-4">Test Your Knowledge</h3>
              <QuizForm quiz={quiz} onReset={handleReset} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
