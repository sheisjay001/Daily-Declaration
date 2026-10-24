import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiUrl } from "../api";
import {
  ArrowLeft,
  Check,
  FileText,
  LoaderCircle,
  LogOut,
  Plus,
  Search,
  Trash2,
  Heart,
} from "lucide-react";

interface CmsAffirmation {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string | { name: string };
  date: string;
  readTime: string;
  coverImage?: string;
  image?: string;
  tags?: string[];
  isPublished?: boolean;
}

interface CmsCategory {
  id: number;
  slug: string;
  name: string;
}

interface CmsAuthor {
  id: string;
  name: string;
  role?: string;
  bio?: string;
}

interface EditorForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  tags: string;
}

const emptyForm: EditorForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  author: "",
  date: new Date().toISOString().slice(0, 10),
  readTime: "2",
  coverImage: "",
  tags: "",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getAuthorName = (author: CmsAffirmation["author"]) =>
  typeof author === "string" ? author : (author?.name ?? "");

export const CmsPage = () => {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("daily-declarations-cms-token"),
  );
  const [email, setEmail] = useState(
    () => sessionStorage.getItem("daily-declarations-cms-email") ?? "",
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const [affirmations, setAffirmations] = useState<CmsAffirmation[]>([]);
  const [authors, setAuthors] = useState<CmsAuthor[]>([]);
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [editingAffirmation, setEditingAffirmation] = useState<CmsAffirmation | null>(null);
  const [form, setForm] = useState<EditorForm>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [section, setSection] = useState<"stories" | "categories" | "team">("stories");

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const visibleAffirmations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return affirmations.filter((affirmation) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "published" ? affirmation.isPublished : !affirmation.isPublished);
      const matchesSearch =
        !normalizedSearch ||
        `${affirmation.title} ${affirmation.category} ${getAuthorName(affirmation.author)}`
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [filter, affirmations, search]);

  const publishedCount = affirmations.filter((affirmation) => affirmation.isPublished).length;
  const draftCount = affirmations.length - publishedCount;

  const resetEditor = () => {
    setEditingAffirmation(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setSlugTouched(false);
    setImagePreview("");
    setFormError("");
  };

  const startNewAffirmation = () => {
    setEditingAffirmation(null); // Clear any existing editing
    setForm({ 
      ...emptyForm, 
      date: new Date().toISOString().slice(0, 10),
      category: categories[0]?.slug ?? "",
      author: authors[0]?.name ?? "",
    });
    setSlugTouched(false);
    setImagePreview("");
    setFormError("");
    setNotice("");
    // Set editingAffirmation to a marker object to show the editor
    setEditingAffirmation({} as CmsAffirmation);
  };

  const openAffirmation = (affirmation: CmsAffirmation) => {
    setEditingAffirmation(affirmation);
    setForm({
      title: affirmation.title,
      slug: affirmation.slug,
      excerpt: affirmation.excerpt,
      content: affirmation.content,
      category: typeof affirmation.category === "string" ? affirmation.category : "",
      author: getAuthorName(affirmation.author),
      date: affirmation.date,
      readTime: affirmation.readTime,
      coverImage: affirmation.coverImage || affirmation.image || "",
      tags: affirmation.tags?.join(", ") || "",
    });
    setSlugTouched(true);
    setImagePreview(affirmation.coverImage || affirmation.image || "");
    setFormError("");
    setNotice("");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginPending(true);
    setLoginError("");
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      sessionStorage.setItem("daily-declarations-cms-token", data.token);
      sessionStorage.setItem("daily-declarations-cms-email", email);
      setToken(data.token);
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoginPending(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("daily-declarations-cms-token");
    sessionStorage.removeItem("daily-declarations-cms-email");
    setToken(null);
    setEmail("");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setFormError("");
    try {
      const isEditing = editingAffirmation && editingAffirmation.id;
      const url = isEditing 
        ? apiUrl(`/api/affirmations/${editingAffirmation.id}`)
        : apiUrl('/api/affirmations');
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Find category and author IDs from their names/slugs
      const category = categories.find(c => c.slug === form.category);
      const author = authors.find(a => a.name === form.author);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          category_id: category?.id ?? null,
          author_id: author?.id || 1,
          cover_image: form.coverImage,
          is_published: editingAffirmation?.isPublished ?? false,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
      
      setNotice("Affirmation saved successfully!");
      resetEditor();
      
      // Reload affirmations
      loadAffirmations();
    } catch (error: any) {
      setFormError(error.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const loadAffirmations = async () => {
    try {
      const response = await fetch(apiUrl('/api/affirmations'), {
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      const data = await response.json();
      setAffirmations(data.affirmations);
    } catch (error) {
      console.error('Failed to load affirmations');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(apiUrl('/api/categories'));
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const loadAuthors = async () => {
    try {
      const response = await fetch(apiUrl('/api/authors'));
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Failed to load authors');
    }
  };

  // Load data on mount
  useEffect(() => {
    if (token) {
      loadAffirmations();
      loadCategories();
      loadAuthors();
    }
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this affirmation?")) return;
    try {
      const response = await fetch(apiUrl(`/api/affirmations/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }
      
      setNotice("Affirmation deleted.");
      loadAffirmations();
    } catch (error: any) {
      setNotice(error.message || "Failed to delete. Please try again.");
    }
  };

  const handlePublishToggle = async (id: string) => {
    if (!token) return;
    try {
      const affirmation = affirmations.find(a => a.id === id);
      if (!affirmation) return;
      
      const response = await fetch(apiUrl(`/api/affirmations/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...affirmation,
          is_published: !affirmation.isPublished,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update');
      }
      
      loadAffirmations();
    } catch (error: any) {
      setNotice(error.message || "Failed to update. Please try again.");
    }
  };

  // Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-[#f1f2ed] px-5 py-12 text-[#18211e] sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full max-w-4xl overflow-hidden border border-[#d9ddd5] bg-white md:grid-cols-[1fr_0.9fr]">
            <div className="flex flex-col justify-between bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] p-8 text-white sm:p-12">
              <div className="flex items-center gap-3 text-sm font-semibold tracking-wide">
                <Heart className="w-6 h-6" />
                <span className="grid h-9 w-9 place-items-center bg-white/20 font-display text-lg">
                  DD
                </span>
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Daily Declarations</h1>
                <p className="text-white/80 text-sm">CMS for managing affirmations</p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#18211e] mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#18211e] mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-red-600">{loginError}</p>
                )}
                <button
                  type="submit"
                  disabled={loginPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-semibold rounded-lg hover:from-[#7C3AED] hover:to-[#DB2777] transition-all disabled:opacity-50"
                >
                  {loginPending ? <LoaderCircle className="w-5 h-5 mx-auto animate-spin" /> : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CMS Dashboard
  return (
    <div className="min-h-screen bg-[#f1f2ed] text-[#18211e]">
      {/* Header */}
      <header className="bg-white border-b border-[#d9ddd5] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-[#8B5CF6]" />
          <span className="font-display font-bold text-lg">Daily Declarations CMS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-600">{email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#18211e] bg-[#f1f2ed] hover:bg-[#e5e6e1] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Section Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#d9ddd5] pb-4">
          <button
            onClick={() => setSection("stories")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === "stories"
                ? "bg-[#8B5CF6] text-white"
                : "bg-white text-[#18211e] hover:bg-[#f1f2ed]"
            }`}
          >
            Affirmations
          </button>
          <button
            onClick={() => setSection("categories")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === "categories"
                ? "bg-[#8B5CF6] text-white"
                : "bg-white text-[#18211e] hover:bg-[#f1f2ed]"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setSection("team")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === "team"
                ? "bg-[#8B5CF6] text-white"
                : "bg-white text-[#18211e] hover:bg-[#f1f2ed]"
            }`}
          >
            Authors
          </button>
        </div>

        {/* Stories Section */}
        {section === "stories" && (
          <>
            {!editingAffirmation ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-[#d9ddd5]">
                    <p className="text-sm text-neutral-600 mb-1">Total</p>
                    <p className="text-3xl font-display font-bold text-[#18211e]">{affirmations.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-[#d9ddd5]">
                    <p className="text-sm text-neutral-600 mb-1">Published</p>
                    <p className="text-3xl font-display font-bold text-green-600">{publishedCount}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-[#d9ddd5]">
                    <p className="text-sm text-neutral-600 mb-1">Drafts</p>
                    <p className="text-3xl font-display font-bold text-amber-600">{draftCount}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === "all" ? "bg-[#8B5CF6] text-white" : "bg-white"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("published")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === "published" ? "bg-[#8B5CF6] text-white" : "bg-white"
                      }`}
                    >
                      Published
                    </button>
                    <button
                      onClick={() => setFilter("drafts")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === "drafts" ? "bg-[#8B5CF6] text-white" : "bg-white"
                      }`}
                    >
                      Drafts
                    </button>
                  </div>
                  <button
                    onClick={startNewAffirmation}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-semibold rounded-lg hover:from-[#7C3AED] hover:to-[#DB2777] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Affirmation
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search affirmations..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#d9ddd5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  />
                </div>

                {/* Affirmations List */}
                {loading ? (
                  <div className="text-center py-12">
                    <LoaderCircle className="w-8 h-8 mx-auto animate-spin text-[#8B5CF6]" />
                  </div>
                ) : loadError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {loadError}
                  </div>
                ) : visibleAffirmations.length === 0 ? (
                  <div className="text-center py-12 text-neutral-600">
                    No affirmations found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleAffirmations.map((affirmation) => (
                      <div
                        key={affirmation.id}
                        className="bg-white p-4 rounded-xl border border-[#d9ddd5] hover:border-[#8B5CF6] transition-colors flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#18211e] mb-1">{affirmation.title}</h3>
                          <p className="text-sm text-neutral-600">
                            {affirmation.category} · {getAuthorName(affirmation.author)} · {affirmation.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePublishToggle(affirmation.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              affirmation.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {affirmation.isPublished ? "Published" : "Draft"}
                          </button>
                          <button
                            onClick={() => openAffirmation(affirmation)}
                            className="p-2 hover:bg-[#f1f2ed] rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(affirmation.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Editor */
              <div className="bg-white rounded-xl border border-[#d9ddd5] p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={resetEditor}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#18211e]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <h2 className="font-display text-xl font-bold">
                    {editingAffirmation ? "Edit Affirmation" : "New Affirmation"}
                  </h2>
                </div>

                {notice && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {notice}
                  </div>
                )}

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#18211e] mb-2">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => {
                        setForm({ ...form, title: e.target.value });
                        if (!slugTouched) {
                          setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                        }
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18211e] mb-2">Slug</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => {
                        setForm({ ...form, slug: e.target.value });
                        setSlugTouched(true);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18211e] mb-2">Excerpt</label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18211e] mb-2">Content</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] min-h-[300px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#18211e] mb-2">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#18211e] mb-2">Author</label>
                      <select
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        required
                      >
                        {authors.map((author) => (
                          <option key={author.id} value={author.name}>
                            {author.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#18211e] mb-2">Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#18211e] mb-2">Read Time</label>
                      <input
                        type="text"
                        value={form.readTime}
                        onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18211e] mb-2">Cover Image URL</label>
                    <input
                      type="url"
                      value={form.coverImage}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18211e] mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9ddd5] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetEditor}
                      className="px-6 py-3 text-sm font-medium text-[#18211e] bg-[#f1f2ed] hover:bg-[#e5e6e1] rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* Categories Section */}
        {section === "categories" && (
          <div className="bg-white rounded-xl border border-[#d9ddd5] p-6">
            <h2 className="font-display text-xl font-bold mb-6">Categories</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.slug}
                  className="flex items-center justify-between p-4 bg-[#f1f2ed] rounded-lg"
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-neutral-600">{category.slug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Authors Section */}
        {section === "team" && (
          <div className="bg-white rounded-xl border border-[#d9ddd5] p-6">
            <h2 className="font-display text-xl font-bold mb-6">Authors</h2>
            <div className="space-y-3">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between p-4 bg-[#f1f2ed] rounded-lg"
                >
                  <div>
                    <p className="font-medium">{author.name}</p>
                    <p className="text-sm text-neutral-600">{author.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
