
'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { archiveLesson } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface DeleteLessonButtonProps {
  lessonId: string;
}

export function DeleteLessonButton({ lessonId }: DeleteLessonButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleArchive = () => {
    startTransition(async () => {
      const result = await archiveLesson(lessonId);
      if (result.status === 'success') {
        toast({
          title: 'Lesson Archived',
          description: 'The lesson has been successfully removed from your history.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Archiving Failed',
          description: result.message,
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Archive Lesson</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to archive this lesson?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the lesson from your history view. This action can be reversed by your database administrator.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchive}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? 'Archiving...' : 'Archive'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
