"use client";

import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PracticeBreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function PracticeBreadcrumb({ items, className = "mb-6" }: PracticeBreadcrumbProps) {
    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Trang chủ</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    {items.length > 0 ? (
                        <BreadcrumbLink asChild>
                            <Link href="/practice">Ôn luyện</Link>
                        </BreadcrumbLink>
                    ) : (
                        <BreadcrumbPage>Ôn luyện</BreadcrumbPage>
                    )}
                </BreadcrumbItem>

                {items.map((item, index) => (
                    <div key={index} className="contents">
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export function getSkillName(skill: string): string {
    const skillNames: Record<string, string> = {
        listening: "Listening",
        reading: "Reading",
        speaking: "Speaking",
        writing: "Writing"
    };
    return skillNames[skill] || skill;
}

export function getExerciseName(slug: string): string {
    const exerciseNames: Record<string, string> = {
        mcq: "Trắc nghiệm",
        dictation: "Chính tả",
        cloze: "Điền từ",
    };
    return exerciseNames[slug] || slug;
}