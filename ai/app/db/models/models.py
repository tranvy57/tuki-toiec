from typing import List, Optional

from sqlalchemy import ARRAY, Boolean, Column, Date, DateTime, Double, ForeignKeyConstraint, Index, Integer, Numeric, PrimaryKeyConstraint, String, Table, Text, UniqueConstraint, Uuid, text
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship
from sqlalchemy.orm.base import Mapped

from sqlalchemy.inspection import inspect
class ReprMixin:
    def __repr__(self):
        # lấy danh sách cột từ mapper
        mapper = inspect(self.__class__)
        attrs = []
        for column in mapper.columns:
            value = getattr(self, column.key, None)
            attrs.append(f"{column.key}={value!r}")
        return f"<{self.__class__.__name__}({', '.join(attrs)})>"

Base = declarative_base(cls=ReprMixin)
metadata = Base.metadata

class Grammars(Base):
    __tablename__ = 'grammars'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_40b2966a24907acbfd5b42d8663'),
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))

    question: Mapped['Questions'] = relationship('Questions', secondary='question_grammars', back_populates='grammar')


class Permissions(Base):
    __tablename__ = 'permissions'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_920331560282b8bd21bb02290df'),
        UniqueConstraint('name', name='UQ_48ce552495d14eae9b187bb6716')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    name = mapped_column(String, nullable=False)

    role: Mapped['Roles'] = relationship('Roles', secondary='role_permissions', back_populates='permission')


class Roles(Base):
    __tablename__ = 'roles'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_c1433d71a4838793a49dcad46ab'),
        UniqueConstraint('name', name='UQ_648e3f5447f725579d7d4ffdfb7')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    name = mapped_column(String, nullable=False)

    permission: Mapped['Permissions'] = relationship('Permissions', secondary='role_permissions', back_populates='role')
    user: Mapped['Users'] = relationship('Users', secondary='user_roles', back_populates='role')


class Skills(Base):
    __tablename__ = 'skills'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_0d3212120f4ecedf90864d7e298'),
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now(SkillsSkills)'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    name = mapped_column(String(255), nullable=False)
    description = mapped_column(Text)

    parts: Mapped[List['Parts']] = relationship(
        'Parts',
        secondary='skill_parts',
        back_populates='skills'
    )
    user_progress: Mapped[List['UserProgress']] = relationship('UserProgress', uselist=True, back_populates='skill')
    lesson_skills: Mapped[List['LessonSkills']] = relationship('LessonSkills', uselist=True, back_populates='skill')
    target_skills: Mapped[List['TargetSkills']] = relationship('TargetSkills', uselist=True, back_populates='skill')
    question_tags: Mapped[List['QuestionTags']] = relationship('QuestionTags', uselist=True, back_populates='skill')


class Tests(Base):
    __tablename__ = 'tests'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_4301ca51edf839623386860aed2'),
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    title = mapped_column(String, nullable=False)
    audio_url = mapped_column(String)
    is_review = mapped_column(Boolean, server_default=text('false'))

    attempts: Mapped[List['Attempts']] = relationship('Attempts', uselist=True, back_populates='test')
    parts: Mapped[List['Parts']] = relationship('Parts', uselist=True, back_populates='tests')


class Units(Base):
    __tablename__ = 'units'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_5a8f2f064919b587d93936cb223'),
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    name = mapped_column(String(255), nullable=False)
    order = mapped_column(Integer, nullable=False, server_default=text('0'))
    description = mapped_column(Text)

    lessons: Mapped[List['Lessons']] = relationship('Lessons', uselist=True, back_populates='unit')


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_a3ffb1c0c8416b9fc6f907b7433'),
        UniqueConstraint('username', name='UQ_fe0bb3f6520ee0469504521e710')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    username = mapped_column(String, nullable=False)
    password = mapped_column(String, nullable=False)
    display_name = mapped_column(String, nullable=False)
    email = mapped_column(String, nullable=False)

    role: Mapped['Roles'] = relationship('Roles', secondary='user_roles', back_populates='user')
    attempts: Mapped[List['Attempts']] = relationship('Attempts', uselist=True, back_populates='user')
    plans: Mapped[List['Plans']] = relationship('Plans', uselist=True, back_populates='user')
    user_progress: Mapped[List['UserProgress']] = relationship('UserProgress', uselist=True, back_populates='user')
    user_vocabularies: Mapped[List['UserVocabularies']] = relationship('UserVocabularies', uselist=True, back_populates='user')


class Vocabularies(Base):
    __tablename__ = 'vocabularies'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PK_1f0c8d5539ccaf456ebf73cabb5'),
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    word = mapped_column(String, nullable=False)
    meaning = mapped_column(String, nullable=False)
    pronunciation = mapped_column(String, nullable=False)
    part_of_speech = mapped_column(String, nullable=False)
    example_en = mapped_column(String, nullable=False)
    example_vn = mapped_column(String, nullable=False)
    is_phrase = mapped_column(Boolean, nullable=False, server_default=text('false'))
    audio_url = mapped_column(String)
    lemma = mapped_column(String)

    user_vocabularies: Mapped[List['UserVocabularies']] = relationship('UserVocabularies', uselist=True, back_populates='vocabulary')
    question: Mapped['Questions'] = relationship('Questions', secondary='question_vocabularies', back_populates='vocabulary')


class Attempts(Base):
    __tablename__ = 'attempts'
    __table_args__ = (
        ForeignKeyConstraint(['test_id'], ['tests.id'], name='FK_a5e4bc5034f5ac069defae66d13'),
        ForeignKeyConstraint(['user_id'], ['users.id'], name='FK_1f23e642cf6e009c61cc2c214e2'),
        PrimaryKeyConstraint('id', name='PK_295ca261e361fd2fd217754dcac')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    started_at = mapped_column(DateTime, nullable=False)
    status = mapped_column(String, nullable=False)
    mode = mapped_column(String, nullable=False)
    finish_at = mapped_column(DateTime)
    total_score = mapped_column(Integer)
    user_id = mapped_column(Uuid)
    test_id = mapped_column(Uuid)

    test: Mapped[Optional['Tests']] = relationship('Tests', back_populates='attempts')
    user: Mapped[Optional['Users']] = relationship('Users', back_populates='attempts')
    part: Mapped['Parts'] = relationship('Parts', secondary='attempt_parts', back_populates='attempt')
    attempt_answers: Mapped[List['AttemptAnswers']] = relationship('AttemptAnswers', uselist=True, back_populates='attempts')


class Lessons(Base):
    __tablename__ = 'lessons'
    __table_args__ = (
        ForeignKeyConstraint(['unit_id'], ['units.id'], ondelete='SET NULL', name='FK_39961b42dac48e49c106e5fec24'),
        PrimaryKeyConstraint('id', name='PK_9b9a8d455cac672d262d7275730')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    name = mapped_column(String(255), nullable=False)
    order = mapped_column(Integer, nullable=False, server_default=text('0'))
    description = mapped_column(Text)
    level = mapped_column(String(32))
    unit_id = mapped_column(Uuid)

    unit: Mapped[Optional['Units']] = relationship('Units', back_populates='lessons')
    question: Mapped['Questions'] = relationship('Questions', secondary='lessson_questions', back_populates='lesson')
    lesson_dependencies: Mapped[List['LessonDependencies']] = relationship('LessonDependencies', uselist=True, foreign_keys='[LessonDependencies.lesson_before_id]', back_populates='lesson_before')
    lesson_dependencies_: Mapped[List['LessonDependencies']] = relationship('LessonDependencies', uselist=True, foreign_keys='[LessonDependencies.lesson_id]', back_populates='lesson')
    lesson_skills: Mapped[List['LessonSkills']] = relationship('LessonSkills', uselist=True, back_populates='lesson')
    study_tasks: Mapped[List['StudyTasks']] = relationship('StudyTasks', uselist=True, back_populates='lesson')
    phase_lessons: Mapped[List['PhaseLessons']] = relationship('PhaseLessons', uselist=True, back_populates='lesson')


class Parts(Base):
    __tablename__ = 'parts'
    __table_args__ = (
        ForeignKeyConstraint(['testId'], ['tests.id'], name='FK_20b3cfd0df36d64268d0bb3d3e0'),
        PrimaryKeyConstraint('id', name='PK_daa5595bb8933f49ac00c9ebc79')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    part_number = mapped_column(Integer, nullable=False)
    direction = mapped_column(String, nullable=False, server_default=text("''::character varying"))
    testId = mapped_column(Uuid)

    attempt: Mapped['Attempts'] = relationship('Attempts', secondary='attempt_parts', back_populates='part')
    tests: Mapped[Optional['Tests']] = relationship('Tests', back_populates='parts')
    skills: Mapped[List['Skills']] = relationship(
        'Skills',
        secondary='skill_parts',
        back_populates='parts'
    )
    groups: Mapped[List['Groups']] = relationship('Groups', uselist=True, back_populates='parts')


class Plans(Base):
    __tablename__ = 'plans'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='FK_32f8c25a5ce0e33674e1253411e'),
        PrimaryKeyConstraint('id', name='PK_3720521a81c7c24fe9b7202ba61'),
        Index('IDX_32f8c25a5ce0e33674e1253411', 'user_id')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    target_score = mapped_column(Integer)
    start_date = mapped_column(Date, server_default=text("('now'::text)::date"))
    total_days = mapped_column(Integer)
    user_id = mapped_column(Uuid)

    user: Mapped[Optional['Users']] = relationship('Users', back_populates='plans')
    phases: Mapped[List['Phases']] = relationship('Phases', uselist=True, back_populates='plan')
    study_tasks: Mapped[List['StudyTasks']] = relationship('StudyTasks', uselist=True, back_populates='plan')
    target_skills: Mapped[List['TargetSkills']] = relationship('TargetSkills', uselist=True, back_populates='plan')


t_role_permissions = Table(
    'role_permissions', metadata,
    Column('role_id', Uuid, nullable=False),
    Column('permission_id', Uuid, nullable=False),
    ForeignKeyConstraint(['permission_id'], ['permissions.id'], name='FK_17022daf3f885f7d35423e9971e'),
    ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE', onupdate='CASCADE', name='FK_178199805b901ccd220ab7740ec'),
    PrimaryKeyConstraint('role_id', 'permission_id', name='PK_25d24010f53bb80b78e412c9656'),
    Index('IDX_17022daf3f885f7d35423e9971', 'permission_id'),
    Index('IDX_178199805b901ccd220ab7740e', 'role_id')
)


class UserProgress(Base):
    __tablename__ = 'user_progress'
    __table_args__ = (
        ForeignKeyConstraint(['skill_id'], ['skills.id'], ondelete='CASCADE', name='FK_52a31371d9484add98e9da94c1c'),
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='FK_c41601eeb8415a9eb15c8a4e557'),
        PrimaryKeyConstraint('id', name='PK_7b5eb2436efb0051fdf05cbe839'),
        UniqueConstraint('user_id', 'skill_id', name='UQ_user_skill'),
        Index('IDX_52a31371d9484add98e9da94c1', 'skill_id'),
        Index('IDX_c41601eeb8415a9eb15c8a4e55', 'user_id')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    proficiency = mapped_column(Double(53), nullable=False, server_default=text("'0'::double precision"))
    user_id = mapped_column(Uuid)
    skill_id = mapped_column(Uuid)

    skill: Mapped[Optional['Skills']] = relationship('Skills', back_populates='user_progress')
    user: Mapped[Optional['Users']] = relationship('Users', back_populates='user_progress')


t_user_roles = Table(
    'user_roles', metadata,
    Column('user_id', Uuid, nullable=False),
    Column('role_id', Uuid, nullable=False),
    ForeignKeyConstraint(['role_id'], ['roles.id'], name='FK_b23c65e50a758245a33ee35fda1'),
    ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', onupdate='CASCADE', name='FK_87b8888186ca9769c960e926870'),
    PrimaryKeyConstraint('user_id', 'role_id', name='PK_23ed6f04fe43066df08379fd034'),
    Index('IDX_87b8888186ca9769c960e92687', 'user_id'),
    Index('IDX_b23c65e50a758245a33ee35fda', 'role_id')
)


class UserVocabularies(Base):
    __tablename__ = 'user_vocabularies'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='FK_5474a333a7e03e2e4dffe04fa00'),
        ForeignKeyConstraint(['vocabulary_id'], ['vocabularies.id'], ondelete='CASCADE', name='FK_e68fa8c95984af76aead75bd8e0'),
        PrimaryKeyConstraint('id', name='PK_62d67475dd6d9ac5f77f2176cc2')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    wrong_count = mapped_column(Integer, nullable=False, server_default=text('0'))
    correct_count = mapped_column(Integer, nullable=False, server_default=text('0'))
    status = mapped_column(String, nullable=False, server_default=text("'active'::character varying"))
    user_id = mapped_column(Uuid)
    vocabulary_id = mapped_column(Uuid)

    user: Mapped[Optional['Users']] = relationship('Users', back_populates='user_vocabularies')
    vocabulary: Mapped[Optional['Vocabularies']] = relationship('Vocabularies', back_populates='user_vocabularies')


t_attempt_parts = Table(
    'attempt_parts', metadata,
    Column('attempt_id', Uuid, nullable=False),
    Column('part_id', Uuid, nullable=False),
    ForeignKeyConstraint(['attempt_id'], ['attempts.id'], ondelete='CASCADE', onupdate='CASCADE', name='FK_11c774713b458700279c21a0408'),
    ForeignKeyConstraint(['part_id'], ['parts.id'], name='FK_1c572cf1d43dd0676f377a1a222'),
    PrimaryKeyConstraint('attempt_id', 'part_id', name='PK_d69ca20bc3e802d3d6a72a28b96'),
    Index('IDX_11c774713b458700279c21a040', 'attempt_id'),
    Index('IDX_1c572cf1d43dd0676f377a1a22', 'part_id')
)


class Groups(Base):
    __tablename__ = 'groups'
    __table_args__ = (
        ForeignKeyConstraint(['partId'], ['parts.id'], name='FK_b0a83366e5aeac37e00e0179358'),
        PrimaryKeyConstraint('id', name='PK_659d1483316afb28afd3a90646e')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    order_index = mapped_column(Integer, nullable=False)
    parageraph_en = mapped_column(String, nullable=False)
    paragraph_vn = mapped_column(String, nullable=False)
    image_url = mapped_column(String)
    audio_url = mapped_column(String)
    partId = mapped_column(Uuid)

    parts: Mapped[Optional['Parts']] = relationship('Parts', back_populates='groups')
    questions: Mapped[List['Questions']] = relationship('Questions', uselist=True, back_populates='groups')


class LessonDependencies(Base):
    __tablename__ = 'lesson_dependencies'
    __table_args__ = (
        ForeignKeyConstraint(['lesson_before_id'], ['lessons.id'], ondelete='CASCADE', name='FK_a6db461d01acf2b5a6d800011be'),
        ForeignKeyConstraint(['lesson_id'], ['lessons.id'], ondelete='CASCADE', name='FK_0a25bce110e9e1c7732422e9858'),
        PrimaryKeyConstraint('id', name='PK_aea00fc487f1a3316996b509c17'),
        UniqueConstraint('lesson_id', 'lesson_before_id', name='UQ_lesson_vs_before')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    min_proficiency = mapped_column(Double(53), nullable=False, server_default=text("'0'::double precision"))
    lesson_id = mapped_column(Uuid)
    lesson_before_id = mapped_column(Uuid)

    lesson_before: Mapped[Optional['Lessons']] = relationship('Lessons', foreign_keys=[lesson_before_id], back_populates='lesson_dependencies')
    lesson: Mapped[Optional['Lessons']] = relationship('Lessons', foreign_keys=[lesson_id], back_populates='lesson_dependencies_')


class LessonSkills(Base):
    __tablename__ = 'lesson_skills'
    __table_args__ = (
        ForeignKeyConstraint(['lesson_id'], ['lessons.id'], name='FK_55d6f51dbd746c28a01f19c5c52'),
        ForeignKeyConstraint(['skill_id'], ['skills.id'], name='FK_37696ef41f13cde8b7d7f72283e'),
        PrimaryKeyConstraint('id', name='PK_f63869515ae08b8f14f257444c1')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    weight = mapped_column(Double(53), nullable=False, server_default=text("'0'::double precision"))
    lesson_id = mapped_column(Uuid)
    skill_id = mapped_column(Uuid)

    lesson: Mapped[Optional['Lessons']] = relationship('Lessons', back_populates='lesson_skills')
    skill: Mapped[Optional['Skills']] = relationship('Skills', back_populates='lesson_skills')


class Phases(Base):
    __tablename__ = 'phases'
    __table_args__ = (
        ForeignKeyConstraint(['plan_id'], ['plans.id'], ondelete='CASCADE', name='FK_570eadc85315a93a0b177323ead'),
        PrimaryKeyConstraint('id', name='PK_e93bb53460b28d4daf72735d5d3')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    title = mapped_column(String(255), nullable=False)
    status = mapped_column(String(16), nullable=False, server_default=text("'locked'::character varying"))
    order = mapped_column(Integer, nullable=False, server_default=text('0'))
    flag = mapped_column(String(32))
    start_at = mapped_column(DateTime(True))
    completed_at = mapped_column(DateTime(True))
    plan_id = mapped_column(Uuid)

    plan: Mapped[Optional['Plans']] = relationship('Plans', back_populates='phases')
    phase_lessons: Mapped[List['PhaseLessons']] = relationship('PhaseLessons', uselist=True, back_populates='phase')


t_skill_parts = Table(
    'skill_parts', metadata,
    Column('skill_id', Uuid, nullable=False),
    Column('part_id', Uuid, nullable=False),
    ForeignKeyConstraint(['part_id'], ['parts.id'], name='FK_3b47e98424c1a1b88627c1afc5f'),
    ForeignKeyConstraint(['skill_id'], ['skills.id'], ondelete='CASCADE', onupdate='CASCADE', name='FK_62bc1fa41dbd7302f15ce3c0fb6'),
    PrimaryKeyConstraint('skill_id', 'part_id', name='PK_20459a3d20358c6ef31af596c8e'),
    Index('IDX_3b47e98424c1a1b88627c1afc5', 'part_id'),
    Index('IDX_62bc1fa41dbd7302f15ce3c0fb', 'skill_id')
)


class StudyTasks(Base):
    __tablename__ = 'study_tasks'
    __table_args__ = (
        ForeignKeyConstraint(['lesson_id'], ['lessons.id'], ondelete='SET NULL', name='FK_eaa280d404bda6e6e0864cf5779'),
        ForeignKeyConstraint(['plan_id'], ['plans.id'], ondelete='CASCADE', name='FK_5ae0b13286d8c866b1a5a1612bd'),
        PrimaryKeyConstraint('id', name='PK_b86085a71305ee1cbb7f18fe5e2'),
        Index('IDX_5ae0b13286d8c866b1a5a1612b', 'plan_id')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    status = mapped_column(String(16), nullable=False, server_default=text("'pending'::character varying"))
    mode = mapped_column(String(16), nullable=False, server_default=text("'learn'::character varying"))
    content_url = mapped_column(String(1024))
    plan_id = mapped_column(Uuid)
    lesson_id = mapped_column(Uuid)

    lesson: Mapped[Optional['Lessons']] = relationship('Lessons', back_populates='study_tasks')
    plan: Mapped[Optional['Plans']] = relationship('Plans', back_populates='study_tasks')


class TargetSkills(Base):
    __tablename__ = 'target_skills'
    __table_args__ = (
        ForeignKeyConstraint(['plan_id'], ['plans.id'], ondelete='CASCADE', name='FK_49fa22f008c094274964baec9e3'),
        ForeignKeyConstraint(['skill_id'], ['skills.id'], ondelete='CASCADE', name='FK_ee1dfc801b68041eb6bcc13df76'),
        PrimaryKeyConstraint('id', name='PK_de847c4ee676bea27483abe1b7f'),
        UniqueConstraint('plan_id', 'skill_id', name='UQ_target_per_plan_skill'),
        Index('IDX_49fa22f008c094274964baec9e', 'plan_id'),
        Index('IDX_ee1dfc801b68041eb6bcc13df7', 'skill_id')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    proficiency = mapped_column(Double(53), nullable=False)
    plan_id = mapped_column(Uuid)
    skill_id = mapped_column(Uuid)

    plan: Mapped[Optional['Plans']] = relationship('Plans', back_populates='target_skills')
    skill: Mapped[Optional['Skills']] = relationship('Skills', back_populates='target_skills')


class PhaseLessons(Base):
    __tablename__ = 'phase_lessons'
    __table_args__ = (
        ForeignKeyConstraint(['lesson_id'], ['lessons.id'], ondelete='CASCADE', name='FK_67a941a0af046444f4b53afac08'),
        ForeignKeyConstraint(['phase_id'], ['phases.id'], ondelete='CASCADE', name='FK_4740101dabf0268a25c66d52d5d'),
        PrimaryKeyConstraint('id', name='PK_b470f7c2913763f0f2c28bbe37c'),
        UniqueConstraint('phase_id', 'lesson_id', name='UQ_phase_lesson'),
        Index('IDX_4740101dabf0268a25c66d52d5', 'phase_id'),
        Index('IDX_67a941a0af046444f4b53afac0', 'lesson_id')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    order = mapped_column(Integer, nullable=False, server_default=text('0'))
    phase_id = mapped_column(Uuid)
    lesson_id = mapped_column(Uuid)

    lesson: Mapped[Optional['Lessons']] = relationship('Lessons', back_populates='phase_lessons')
    phase: Mapped[Optional['Phases']] = relationship('Phases', back_populates='phase_lessons')


class Questions(Base):
    __tablename__ = 'questions'
    __table_args__ = (
        ForeignKeyConstraint(['groupId'], ['groups.id'], name='FK_09feeade34acdfb5d972a9fa9d6'),
        PrimaryKeyConstraint('id', name='PK_08a6d4b0f49ff300bf3a0ca60ac')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    number_label = mapped_column(Integer, nullable=False)
    content = mapped_column(String, nullable=False)
    explanation = mapped_column(String, nullable=False, server_default=text("''::character varying"))
    score = mapped_column(Integer, nullable=False, server_default=text('5'))
    groupId = mapped_column(Uuid)
    lemmas = mapped_column(ARRAY(Text()))
    phrases = mapped_column(ARRAY(Text()))

    grammar: Mapped['Grammars'] = relationship('Grammars', secondary='question_grammars', back_populates='question')
    lesson: Mapped['Lessons'] = relationship('Lessons', secondary='lessson_questions', back_populates='question')
    groups: Mapped[Optional['Groups']] = relationship('Groups', back_populates='questions')
    vocabulary: Mapped['Vocabularies'] = relationship('Vocabularies', secondary='question_vocabularies', back_populates='question')
    answers: Mapped[List['Answers']] = relationship('Answers', uselist=True, back_populates='questions')
    question_tags: Mapped[List['QuestionTags']] = relationship('QuestionTags', uselist=True, back_populates='question')
    attempt_answers: Mapped[List['AttemptAnswers']] = relationship('AttemptAnswers', uselist=True, back_populates='questions')


class Answers(Base):
    __tablename__ = 'answers'
    __table_args__ = (
        ForeignKeyConstraint(['questionId'], ['questions.id'], name='FK_c38697a57844f52584abdb878d7'),
        PrimaryKeyConstraint('id', name='PK_9c32cec6c71e06da0254f2226c6')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    content = mapped_column(String, nullable=False)
    is_correct = mapped_column(Boolean, nullable=False)
    answer_key = mapped_column(String, nullable=False)
    questionId = mapped_column(Uuid)

    questions: Mapped[Optional['Questions']] = relationship('Questions', back_populates='answers')
    attempt_answers: Mapped[List['AttemptAnswers']] = relationship('AttemptAnswers', uselist=True, back_populates='answers')


t_lessson_questions = Table(
    'lessson_questions', metadata,
    Column('lesson_id', Uuid, nullable=False),
    Column('question_id', Uuid, nullable=False),
    ForeignKeyConstraint(['lesson_id'], ['lessons.id'], ondelete='CASCADE', onupdate='CASCADE', name='FK_2c965fed13b23af62cbe7bf7235'),
    ForeignKeyConstraint(['question_id'], ['questions.id'], name='FK_8339328e604cacc7b2907fefded'),
    PrimaryKeyConstraint('lesson_id', 'question_id', name='PK_0b76701b2bf896754c20734800e'),
    Index('IDX_2c965fed13b23af62cbe7bf723', 'lesson_id'),
    Index('IDX_8339328e604cacc7b2907fefde', 'question_id')
)


t_question_grammars = Table(
    'question_grammars', metadata,
    Column('question_id', Uuid, nullable=False),
    Column('grammar_id', Uuid, nullable=False),
    ForeignKeyConstraint(['grammar_id'], ['grammars.id'], name='FK_80c52eb2021d8dff6f731a6fccb'),
    ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE', onupdate='CASCADE', name='FK_bf95cea3e1395dd8c03b275e8b5'),
    PrimaryKeyConstraint('question_id', 'grammar_id', name='PK_ba397120f27d3aa9608718dd8cc'),
    Index('IDX_80c52eb2021d8dff6f731a6fcc', 'grammar_id'),
    Index('IDX_bf95cea3e1395dd8c03b275e8b', 'question_id')
)


class QuestionTags(Base):
    __tablename__ = 'question_tags'
    __table_args__ = (
        ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE', name='FK_da3d79ee83f674d9f5fc9cc88d0'),
        ForeignKeyConstraint(['skill_id'], ['skills.id'], ondelete='CASCADE', name='FK_4151e7edb866f5f920db2d0f66b'),
        PrimaryKeyConstraint('id', name='PK_81ec68fd0657209c2013c16ad3d')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    difficulty = mapped_column(Numeric, nullable=False, server_default=text("'0'::numeric"))
    confidence = mapped_column(Numeric, nullable=False, server_default=text("'0'::numeric"))
    question_id = mapped_column(Uuid)
    skill_id = mapped_column(Uuid)

    question: Mapped[Optional['Questions']] = relationship('Questions', back_populates='question_tags')
    skill: Mapped[Optional['Skills']] = relationship('Skills', back_populates='question_tags')


t_question_vocabularies = Table(
    'question_vocabularies', metadata,
    Column('question_id', Uuid, nullable=False),
    Column('vocabulary_id', Uuid, nullable=False),
    ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE', onupdate='CASCADE', name='FK_7b342a932166cc4bd206857cbd6'),
    ForeignKeyConstraint(['vocabulary_id'], ['vocabularies.id'], name='FK_fd1de7c02904bfe97229f56bfc8'),
    PrimaryKeyConstraint('question_id', 'vocabulary_id', name='PK_25d85f8593a15e93db3287bb0ff'),
    Index('IDX_7b342a932166cc4bd206857cbd', 'question_id'),
    Index('IDX_fd1de7c02904bfe97229f56bfc', 'vocabulary_id')
)


class AttemptAnswers(Base):
    __tablename__ = 'attempt_answers'
    __table_args__ = (
        ForeignKeyConstraint(['answerId'], ['answers.id'], ondelete='SET NULL', name='FK_3d72f32e3beb36c5e3be25bf4f3'),
        ForeignKeyConstraint(['attemptId'], ['attempts.id'], ondelete='CASCADE', name='FK_76e6a7dc4c1894250800077e79b'),
        ForeignKeyConstraint(['questionId'], ['questions.id'], ondelete='CASCADE', name='FK_382ef7a450def2331b236e49268'),
        PrimaryKeyConstraint('id', name='PK_b5f6f0c32809f5b14da916e6f06'),
        Index('IDX_382ef7a450def2331b236e4926', 'questionId'),
        Index('IDX_76e6a7dc4c1894250800077e79', 'attemptId')
    )

    id = mapped_column(Uuid, server_default=text('uuid_generate_v4()'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    is_active = mapped_column(Boolean, nullable=False, server_default=text('true'))
    is_correct = mapped_column(Boolean)
    attemptId = mapped_column(Uuid)
    questionId = mapped_column(Uuid)
    answerId = mapped_column(Uuid)

    answers: Mapped[Optional['Answers']] = relationship('Answers', back_populates='attempt_answers')
    attempts: Mapped[Optional['Attempts']] = relationship('Attempts', back_populates='attempt_answers')
    questions: Mapped[Optional['Questions']] = relationship('Questions', back_populates='attempt_answers')
