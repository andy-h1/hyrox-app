-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exercises" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "optimization" TEXT NOT NULL DEFAULT 'MIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workouts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "total_duration" INTEGER,
    "rounds_completed" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workout_exercises" (
    "id" SERIAL NOT NULL,
    "workout_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "time_taken" INTEGER,
    "order_in_workout" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."personal_records" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "time_taken" INTEGER,
    "achieved_date" TIMESTAMP(3) NOT NULL,
    "workout_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."challenges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "challenge_type" TEXT NOT NULL,
    "target_exercise_id" INTEGER,
    "target_value" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."challenge_results" (
    "id" SERIAL NOT NULL,
    "challenge_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "result_value" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_name_key" ON "public"."exercises"("name");

-- CreateIndex
CREATE INDEX "workouts_user_id_date_idx" ON "public"."workouts"("user_id", "date" DESC);

-- CreateIndex
CREATE INDEX "workout_exercises_workout_id_idx" ON "public"."workout_exercises"("workout_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_records_user_id_exercise_id_value_key" ON "public"."personal_records"("user_id", "exercise_id", "value");

-- CreateIndex
CREATE INDEX "challenge_results_challenge_id_rank_idx" ON "public"."challenge_results"("challenge_id", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_results_challenge_id_user_id_key" ON "public"."challenge_results"("challenge_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."workouts" ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personal_records" ADD CONSTRAINT "personal_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personal_records" ADD CONSTRAINT "personal_records_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personal_records" ADD CONSTRAINT "personal_records_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenges" ADD CONSTRAINT "challenges_target_exercise_id_fkey" FOREIGN KEY ("target_exercise_id") REFERENCES "public"."exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_results" ADD CONSTRAINT "challenge_results_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_results" ADD CONSTRAINT "challenge_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
