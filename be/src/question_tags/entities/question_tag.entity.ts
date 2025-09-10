import { BaseEntity } from "src/common/entities/base.entity";
import { Question } from "src/question/entities/question.entity";
import { Skill } from "src/skill/entities/skill.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('question_tags')
export class QuestionTag extends BaseEntity {
    @ManyToOne(() => Question, (question) => question.questionTags, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @ManyToOne(() => Skill, (skill) => skill.questionTags, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'skill_id' })
    skill: Skill;

    @Column({ name: 'difficulty', default: 0, type: 'numeric', scale: 2 })
    difficulty: number;

    @Column({ name: 'confidence', default: 0, type: 'numeric', scale: 2 })
    confidence: number;
}
