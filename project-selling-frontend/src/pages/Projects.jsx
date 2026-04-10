import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://your-backend-url/api/projects";
const PER_PAGE = 6;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    axios.get(API).then(res => {
      setProjects(res.data || []);
      setLoading(false);
    });
  }, []);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading projects...
      </div>
    );
  }

  return (
    <section className="min-h-screen px-6 py-20 bg-gradient-to-b from-black via-slate-950 to-black text-white">

      {/* HEADING */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
        Our Projects
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search projects..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="block mx-auto mb-14 w-full max-w-md px-5 py-3
        rounded-xl bg-slate-900 border border-white/10
        focus:outline-none focus:border-purple-500"
      />

      {/* GRID */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(p => (
          <motion.div
            key={p.id}
            whileHover={{ y: -8 }}
            className="group bg-slate-900/70 backdrop-blur
            rounded-2xl overflow-hidden border border-white/10
            hover:border-purple-500/40 transition"
          >
            {/* HEADER */}
            <div className="h-44 flex items-center justify-center
              bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20
              relative">
              <div className="absolute inset-0 bg-black/40" />
              <h3 className="relative z-10 text-2xl font-bold text-center
                bg-gradient-to-r from-purple-400 to-pink-400
                bg-clip-text text-transparent px-4">
                {p.title}
              </h3>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-400 line-clamp-2">
                {p.shortDescription}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xl font-bold text-purple-400">
                  ₹{p.price}
                </span>

                <button
                  onClick={() => setActive(p)}
                  className="px-4 py-2 rounded-lg
                  bg-purple-600 hover:bg-purple-700 transition"
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-14">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg border
              ${page === i + 1
                ? "bg-purple-600 border-purple-600"
                : "border-white/10 hover:border-purple-500"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur
            flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="max-w-4xl w-full bg-slate-900
              rounded-2xl overflow-hidden border border-white/10"
            >
              {active.demoUrl && (
                <video
                  src={`https://your-backend-url${active.demoUrl}`}
                  controls
                  className="w-full aspect-video bg-black"
                />
              )}

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{active.title}</h2>
                  <span className="text-2xl font-bold text-purple-400">
                    ₹{active.price}
                  </span>
                </div>

                <p className="text-gray-300">{active.description}</p>

                <p className="text-sm text-gray-400">
                  <strong>Tech Stack:</strong> {active.techStack}
                </p>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowContact(true)}
                    className="flex-1 py-3 rounded-xl
                    bg-green-600 hover:bg-green-700 transition"
                  >
                    Buy / Contact
                  </button>

                  <button
                    onClick={() => setActive(null)}
                    className="flex-1 py-3 rounded-xl
                    bg-red-600 hover:bg-red-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT POPUP */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContact(false)}
            className="fixed inset-0 z-[60] bg-black/80
            backdrop-blur flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl
              bg-gradient-to-br from-slate-900 via-black to-slate-900
              border border-white/10 p-6 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">
                Contact Details
              </h3>

              <p className="text-lg font-semibold">
                K. Ajithkumar
              </p>

              <p className="text-gray-400 mb-6">
                📞 6374383135
              </p>

              <a
                href="https://wa.me/916374383135"
                target="_blank"
                rel="noreferrer"
                className="block py-3 rounded-xl
                bg-green-600 hover:bg-green-700 transition"
              >
                Chat on WhatsApp
              </a>

              <button
                onClick={() => setShowContact(false)}
                className="mt-3 w-full py-2 rounded-xl
                bg-white/10 hover:bg-white/20 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
