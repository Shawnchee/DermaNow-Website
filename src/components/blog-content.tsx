"use client";
import styles from "./blog-content.module.css";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div
      className={styles.blogContent}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
