"use client";

import { useEffect, useState, useRef } from "react";
import supabase from "@/utils/supabase";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  image_url: string;
  tag: string;
  date: string;
};

const CARD_WIDTH = 380 + 24; // card + gap
const CARDS_PER_PAGE = 3;

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  // useEffect(() => {
  //   const fetchNews = async () => {
  //     const { data, error } = await supabase
  //       .from("charity_blog")
  //       .select("*")
  //       .order("created_at", { ascending: false });

  //     if (error) {
  //       console.error("Error fetching news:", error);
  //     } else {
  //       setNews(data || []);
  //     }
  //   };

  //   fetchNews();
  // }, []);

  useEffect(() => {
    if (carouselRef.current && news.length) {
      const visibleWidth = carouselRef.current.offsetWidth;
      const totalScrollable = CARD_WIDTH * news.length;
      const pages = Math.ceil(totalScrollable / (CARD_WIDTH * CARDS_PER_PAGE));
      setTotalPages(pages);
    }
  }, [news]);

  const goToPage = (page: number) => {
    let targetPage = page;
    if (targetPage < 0) targetPage = totalPages - 1;
    if (targetPage >= totalPages) targetPage = 0;

    const offset = -targetPage * (CARD_WIDTH * CARDS_PER_PAGE);
    controls.start({
      x: offset,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    });
    setCurrentPage(targetPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-2 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
            >
              Stay Informed
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              News & Global Causes
            </h2>
          </motion.div>

          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next page</span>
            </Button>
          </motion.div>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left/Right fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none z-10" />

          <motion.div
            className="flex gap-6 pb-4"
            ref={carouselRef}
            animate={controls}
            drag="x"
            dragConstraints={{
              left: -CARD_WIDTH * (news.length - 1),
              right: 0,
            }}
            whileTap={{ cursor: "grabbing" }}
            style={{ cursor: "grab" }}
          >
            {news.concat(news).map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                className="min-w-[340px] md:min-w-[380px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100 group"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">{item.summary}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-blue-600 text-sm">
                      <Globe className="h-4 w-4 mr-1" />
                      <span>Global Impact</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentPage === i
                    ? "bg-blue-600 w-6"
                    : "bg-blue-200 hover:bg-blue-300"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
