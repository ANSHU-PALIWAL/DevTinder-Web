import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../utils/blogData";
import { Clock, ArrowRight, Sparkles } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.7, ease: "easeOut" },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true },
};

const categoryColorMap = {
  emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  violet: "bg-violet-50 text-violet-700 border border-violet-200",
  rose: "bg-rose-50 text-rose-700 border border-rose-200",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  teal: "bg-teal-50 text-teal-700 border border-teal-200",
};

const BlogsPage = () => {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog — Neighborhood Tips, Stories & Local Living | ConnectNeighbour</title>
        <meta
          name="description"
          content="Read expert tips on meeting neighbors, hyper-local social networking, privacy, skill-sharing, and building stronger communities. ConnectNeighbour Blog."
        />
        <meta name="keywords" content="neighborhood blog, local community tips, how to meet neighbors, hyperlocal networking india, neighbor app blog" />
        <link rel="canonical" href="https://connectneighbour.in/blogs" />
        <meta property="og:title" content="ConnectNeighbour Blog — Local Living Stories & Tips" />
        <meta property="og:description" content="Hyper-local insights, community building tips, and real neighbor stories." />
        <meta property="og:url" content="https://connectneighbour.in/blogs" />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <div className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 font-bold text-xs mb-8">
              <Sparkles size={14} className="animate-pulse" />
              THE NEIGHBOURHOOD BLOG
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
              Ideas for a
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Better Street.
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed max-w-xl">
              Community building tips, privacy guides, real neighbor stories, and the philosophy behind hyper-local living.
            </p>
          </motion.div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
          {/* Featured Post */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="mb-16"
          >
            <Link
              to={`/blogs/${featured.slug}`}
              id={`blog-featured-${featured.slug}`}
              className="group grid md:grid-cols-2 bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${categoryColorMap[featured.categoryColor]}`}>
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Featured</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6 text-[15px]">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Clock size={13} />
                    {featured.readTime} · {featured.date}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm group-hover:gap-2 transition-all">
                    Read <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Blog Grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7"
            initial="initial"
            whileInView="whileInView"
            variants={staggerContainer}
          >
            {rest.map((post) => (
              <motion.div key={post.slug} variants={fadeIn}>
                <Link
                  to={`/blogs/${post.slug}`}
                  id={`blog-card-${post.slug}`}
                  className="group flex flex-col bg-white rounded-[1.75rem] overflow-hidden border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full"
                >
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm ${categoryColorMap[post.categoryColor]}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug group-hover:text-emerald-700 transition-colors flex-1">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Clock size={12} />
                        {post.readTime}
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs group-hover:gap-2 transition-all">
                        Read more <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogsPage;
