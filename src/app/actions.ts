
'use server';

import { generateTopicExplanation } from '@/ai/flows/generate-topic-explanation';
import { generateQuizFromExplanation } from '@/ai/flows/generate-quiz-from-explanation';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, getDoc, doc, deleteDoc } from 'firebase/firestore';
import type { Lesson } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters.").max(100, "Topic must be 100 characters or less."),
});

export type AppState = {
  status: 'error' | 'success';
  message: string;
  explanation?: string;
  quiz?: string;
}

export async function generateExplanationAndQuiz(
  formData: FormData
): Promise<AppState> {

  const validatedFields = formSchema.safeParse({
    topic: formData.get('topic'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.errors[0].message,
    };
  }

  const { topic } = validatedFields.data;

  try {
    const explanationResult = await generateTopicExplanation({ topic });
    if (!explanationResult?.explanation) {
      throw new Error("Failed to generate explanation.");
    }
    const explanation = explanationResult.explanation;

    const quizResult = await generateQuizFromExplanation({ explanation });
    if (!quizResult?.quiz) {
      throw new Error("Failed to generate quiz.");
    }
    const quiz = quizResult.quiz;

    // Save to Firestore
    await addDoc(collection(db, "lessons"), {
      topic,
      explanation,
      quiz,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/history');

    return {
      status: 'success',
      message: 'Content generated and saved successfully.',
      explanation,
      quiz,
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.';
    return {
      status: 'error',
      message: errorMessage,
    };
  }
}

export async function getLessonHistory(): Promise<Lesson[]> {
    const lessonsCol = collection(db, 'lessons');
    const q = query(lessonsCol, orderBy('createdAt', 'desc'));
    const lessonSnapshot = await getDocs(q);
    const lessonList = lessonSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            topic: data.topic,
            // Convert Firestore Timestamp to a serializable format (ISO string)
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        };
    });
    return lessonList;
}

export async function getLesson(id: string): Promise<Lesson | null> {
    try {
        const lessonRef = doc(db, 'lessons', id);
        const lessonSnap = await getDoc(lessonRef);

        if (!lessonSnap.exists()) {
            return null;
        }

        const data = lessonSnap.data();
        return {
            id: lessonSnap.id,
            topic: data.topic,

            explanation: data.explanation,
            quiz: data.quiz,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return null;
    }
}

export async function deleteLesson(id: string): Promise<{ status: 'success' | 'error', message: string }> {
    try {
        const lessonRef = doc(db, 'lessons', id);
        await deleteDoc(lessonRef);

        revalidatePath('/history');
        revalidatePath('/');


        return {
            status: 'success',
            message: 'Lesson deleted successfully.'
        };
    } catch (error) {
        console.error("Error deleting lesson:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while deleting the lesson.';
        return {
            status: 'error',
            message: errorMessage,
        };
    }
}
