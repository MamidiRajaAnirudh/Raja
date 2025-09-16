
import { getLesson } from '@/app/actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuizForm } from '@/components/app/quiz-form';
import { parseQuizText } from '@/lib/quiz-parser';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface LessonPageProps {
  params: {
    id: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await getLesson(params.id);

  if (!lesson || !lesson.explanation || !lesson.quiz) {
    notFound();
  }

  const quiz = parseQuizText(lesson.quiz);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/history">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to History
                </Link>
            </Button>
        </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{lesson.topic}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="font-headline text-2xl font-semibold border-b pb-2 mb-4">Explanation</h3>
            <p className="whitespace-pre-wrap text-base leading-relaxed">{lesson.explanation}</p>
          </div>
          <Separator />
          {quiz.questions.length > 0 ? (
             <div>
                <h3 className="font-headline text-2xl font-semibold mb-4">Test Your Knowledge</h3>
                <QuizForm quiz={quiz} onReset={() => {
                    // We don't need a reset function here as this page is for viewing a single past lesson.
                    // The main form's reset is handled on the main page.
                }} />
            </div>
          ) : (
            <p className="text-muted-foreground">No quiz available for this lesson.</p>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
