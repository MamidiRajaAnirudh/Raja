
import { getLessonHistory } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookMarked, Home, Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DeleteLessonButton } from '@/components/app/delete-lesson-button';

export default async function HistoryPage() {
  const lessons = await getLessonHistory();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
       <header className="text-center mb-10 relative">
        <div className="absolute top-0 left-0">
            <Button asChild variant="outline">
                <Link href="/">
                <Home className="mr-2"/>
                Home
                </Link>
            </Button>
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
          <BookMarked className="h-10 w-10" />
          Lesson History
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Review your previously generated lessons.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          {lessons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.topic}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(new Date(lesson.createdAt), "PPP")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button asChild variant="ghost" size="icon">
                        <Link href={`/lesson/${lesson.id}`}>
                           <Eye className="h-4 w-4" />
                           <span className="sr-only">View Lesson</span>
                         </Link>
                       </Button>
                       <DeleteLessonButton lessonId={lesson.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't generated any lessons yet.</p>
              <Button asChild className="mt-4">
                <Link href="/">Start Learning</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
