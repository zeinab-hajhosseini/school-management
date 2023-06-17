import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
  ) {}

  async createLesson(
    createLessonInput: CreateLessonInput,
  ): Promise<LessonEntity> {
    const { name, startDate, endDate, students } = createLessonInput;

    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });

    return this.lessonRepository.save(lesson);
  }

  async getLesson(id): Promise<LessonEntity> {
    return this.lessonRepository.findOneBy({ id });
  }

  async getLessons(): Promise<LessonEntity[]> {
    return this.lessonRepository.find();
  }

  async assignStudentsToLesson(
    assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ): Promise<LessonEntity> {
    const { lessonId, studentIds } = assignStudentsToLessonInput;

    const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
    lesson.students = [...lesson.students, ...studentIds];
    return this.lessonRepository.save(lesson);
  }
}
