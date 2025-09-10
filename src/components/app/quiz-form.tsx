'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CircleHelp, Send } from 'lucide-react';

import type { Quiz, UserAnswers } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { QuizResults } from './quiz-results';

interface QuizFormProps {
  quiz: Quiz;
  onReset: () => void;
}

export function QuizForm({ quiz, onReset }: QuizFormProps) {
  const [submittedAnswers, setSubmittedAnswers] = useState<UserAnswers | null>(null);

  const schema = z.object(
    quiz.questions.reduce((acc, question) => {
      acc[`question-${question.id}`] = z.string().min(1, 'Please select an answer.');
      return acc;
    }, {} as Record<string, z.ZodString>)
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: quiz.questions.reduce((acc, question) => {
        acc[`question-${question.id}`] = '';
        return acc;
      }, {} as Record<string, string>),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    setSubmittedAnswers(data);
  }

  if (submittedAnswers) {
    return <QuizResults quiz={quiz} userAnswers={submittedAnswers} onReset={onReset} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          {quiz.questions.map((q, index) => (
            <Card key={q.id} className="bg-background/50">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name={`question-${q.id}`}
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg font-semibold flex items-start gap-2">
                        <CircleHelp className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                        <span>{index + 1}. {q.questionText}</span>
                      </FormLabel>
                      <FormControl>
                        {q.type === 'multiple-choice' || q.type === 'true-false' ? (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {q.options?.map((option) => (
                              <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        ) : q.type === 'fill-in-the-blank' ? (
                          <Input {...field} placeholder="Type your answer here..." />
                        ) : (
                          <p className="text-destructive">Unsupported question type.</p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-right">
            <Button type="submit" size="lg">
                Submit Quiz <Send className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </form>
    </Form>
  );
}
