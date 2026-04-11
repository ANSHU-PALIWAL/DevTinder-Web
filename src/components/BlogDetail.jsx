import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBlogBySlug, BLOG_POSTS } from "../utils/blogData";
import { Clock, ArrowLeft, ArrowRight, User, Calendar, ChevronRight } from "lucide-react";

const categoryColorMap = {
  emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  violet: "bg-violet-50 text-violet-700 border border-violet-200",
  rose: "bg-rose-50 text-rose-700 border border-rose-200",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  teal: "bg-teal-50 text-teal-700 border border-teal-200",
};

// Minimal markdown-like renderer (handles ##, **bold**, bullet lists, tables, ---)
const renderContent = (content) => {
  const lines = content.trim().split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">
          {line.slice(3)}
        </h2>
      );
    } else if (line === "---") {
      elements.push(<hr key={i} className="my-8 border-slate-200" />);
    } else if (line.startsWith("| ")) {
      // Table
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const headers = tableLines[0].split("|").filter(Boolean).map(h => h.trim());
      const rows = tableLines.slice(2).map(r => r.split("|").filter(Boolean).map(c => c.trim()));
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                {headers.map((h, j) => (
                  <th key={j} className="text-left px-4 py-3 font-bold text-slate-700 border border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="even:bg-slate-50">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-slate-600 border border-slate-200">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-slate-600 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\./.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-2 list-decimal list-inside">
          {items.map((item, j) => (
            <li key={j} className="text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          ))}
        </ol>
      );
      continue;
    } else {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      elements.push(
        <p key={i} className="text-slate-600 leading-relaxed text-[16.5px] mb-4"
          dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    i++;
  }
  return elements;
};

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getBlogBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 px-4 pt-24">
        <h1 className="text-3xl font-black text-slate-900">Article Not Found</h1>
        <p className="text-slate-500">That blog post doesn't exist or may have moved.</p>
        <Link to="/blogs" className="flex items-center gap-2 text-emerald-600 font-bold hover:underline">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{post.title} | ConnectNeighbour Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://connectneighbour.in/blogs/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:url" content={`https://connectneighbour.in/blogs/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="author" content={post.author} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.coverImage,
            "author": { "@type": "Person", "name": post.author },
            "datePublished": post.date,
            "publisher": {
              "@type": "Organization",
              "name": "ConnectNeighbour",
              "url": "https://connectneighbour.in"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Hero */}
        <div className="relative h-[70vh] min-h-[400px] max-h-[600px] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-8 left-4 sm:left-8"
            style={{ top: "7rem" }}
          >
            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={15} /> Blog
            </button>
          </motion.div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 ${categoryColorMap[post.categoryColor]}`}>
                {post.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm font-medium">
                <span className="flex items-center gap-1.5"><User size={13} /> {post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          {/* Excerpt / Lead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-light leading-relaxed border-l-4 border-emerald-500 pl-6 mb-10 italic"
          >
            {post.excerpt}
          </motion.p>

          {/* Rich content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {renderContent(post.content)}
          </motion.div>

          {/* Author card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xl flex-shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">{post.author}</div>
              <div className="text-emerald-600 text-sm font-medium">{post.authorRole}</div>
              <div className="text-slate-500 text-xs mt-1">Building better neighborhoods, one connection at a time.</div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-emerald-600 rounded-3xl p-8 text-center text-white"
          >
            <h3 className="text-xl font-bold mb-2">Ready to meet your neighbors?</h3>
            <p className="text-emerald-100 text-sm mb-5">Join ConnectNeighbour — free, safe, and takes 2 minutes.</p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-white text-emerald-700 font-black rounded-xl hover:bg-emerald-50 transition-all hover:scale-105"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>

        {/* Related Posts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">More from the Blog</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <Link
                key={p.slug}
                to={`/blogs/${p.slug}`}
                className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">{p.category}</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
                    Read <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
