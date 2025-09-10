'use client';

import { useMemo } from 'react';
import { CheckCircle, XCircle, Award, RotateCw } from 'lucide-react';

import type { Quiz, UserAnswers } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface QuizResultsProps {
  quiz: Quiz;
  userAnswers: UserAnswers;
  onReset: () => void;
}

export function QuizResults({ quiz, userAnswers, onReset }: QuizResultsProps) {
  const { score, total, correctAnswersCount } = useMemo(() => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      const userAnswer = userAnswers[`question-${q.id}`];
      if (userAnswer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });
    const totalQuestions = quiz.questions.length;
    return {
      score: totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0,
      total: totalQuestions,
      correctAnswersCount: correctCount,
    };
  }, [quiz, userAnswers]);

  const getResultIcon = (isCorrect: boolean) => {
    return isCorrect ? (
      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
    ) : (
      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
    );
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Award className="text-primary"/>
            Quiz Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-secondary/50 rounded-lg">
          <p className="text-lg text-muted-foreground">You scored</p>
          <p className="text-5xl font-bold text-primary my-2">{correctAnswersCount} / {total}</p>
          <Progress value={score} className="w-full max-w-sm mx-auto mt-4 h-3" />
        </div>

        <div className="space-y-4">
            <h3 className="font-headline text-xl font-semibold">Review Your Answers</h3>
            {quiz.questions.map(q => {
                const userAnswer = userAnswers[`question-${q.id}`];
                const isCorrect = userAnswer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                return (
                    <div key={q.id} className="p-4 border rounded-md">
                        <p className="font-semibold mb-2">{q.questionText}</p>
                        <div className="flex items-center gap-2 text-sm">
                            {getResultIcon(isCorrect)}
                            <span>Your answer: <span className={isCorrect ? 'text-green-600' : 'text-destructive'}>{userAnswer || "No answer"}</span></span>
                        </div>
                        {!isCorrect && (
                            <div className="flex items-center gap-2 text-sm mt-1 text-green-600">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <span>Correct answer: {q.correctAnswer}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} size="lg" className="w-full sm:w-auto mx-auto">
            <RotateCw className="mr-2 h-4 w-4"/>
            Learn Something New
        </Button>
      </CardFooter>
    </Card>
  );
}
