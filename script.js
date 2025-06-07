const postFileNames = ["post1.json", "post2.json", "post3.json"];
let allPosts = [];

// Funktion til at konvertere titel til URL-venlig slug (stadig nyttig som unik ID)
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
}

// Funktion til at finde post baseret på slug
function findPostBySlug(slug) {
  return allPosts.find((post) => createSlug(post.title) === slug);
}

// *** NY FUNKTION ***
// En simpel handler til at vise en enkelt post baseret på dens slug
function showPostBySlug(slug) {
  const post = findPostBySlug(slug);
  if (post) {
    showSinglePost(post);
  }
}

// Funktion til at vise alle posts
function showAllPosts() {
  document.title = "Bloggen"; // Sæt sidetitlen
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = `
    <div class="max-w-2xl mx-auto px-6 py-12">
      <header class="text-center mb-16">
        <h1 class="text-4xl font-light text-gray-100 mb-4 tracking-wide">Blog</h1>
        <div class="w-16 h-px bg-gray-600 mx-auto"></div>
      </header>
      <div class="space-y-12">
        ${allPosts
          .map(
            (post) => `
          <article class="group cursor-pointer transition-all duration-300 hover:transform hover:translate-y-[-2px]"
                   onclick="showPostBySlug('${createSlug(post.title)}')">
            <div class="border-l-2 border-gray-700 hover:border-gray-500 pl-6 py-4 transition-colors duration-300">
              <h2 class="text-xl font-light text-gray-200 mb-3 group-hover:text-white transition-colors duration-300">
                ${post.title}
              </h2>
              <div class="text-sm text-gray-500 mb-4 font-light">
                <span>${post.author}</span>
                <span class="mx-2">·</span>
                <time datetime="${post.date}">${new Date(
                  post.date,
                ).toLocaleDateString("da-DK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}</time>
              </div>
              <p class="text-gray-400 leading-relaxed font-light line-clamp-3">
                ${post.content.length > 150 ? post.content.substring(0, 150) + "..." : post.content}
              </p>
            </div>
          </article>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

// Funktion til at vise enkelt post
function showSinglePost(post) {
  document.title = `${post.title} - Bloggen`; // Sæt sidetitlen
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = `
    <div class="min-h-screen">
      <nav class="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-10">
        <div class="max-w-4xl mx-auto px-6 py-4">
          <button onclick="showAllPosts()"
                  class="text-gray-400 hover:text-white transition-colors duration-300 font-light text-sm tracking-wide">
            ← Tilbage til blog
          </button>
        </div>
      </nav>

      <main class="pt-20 pb-16">
        <article class="max-w-4xl mx-auto px-6">
          <header class="text-center mb-16 py-12">
            <h1 class="text-4xl md:text-5xl font-light text-gray-100 mb-8 leading-tight tracking-wide">
              ${post.title}
            </h1>
            <div class="text-gray-500 font-light">
              <span>${post.author}</span>
              <span class="mx-3">·</span>
              <time datetime="${post.date}" class="text-gray-500">
                ${new Date(post.date).toLocaleDateString("da-DK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
            <div class="w-24 h-px bg-gray-700 mx-auto mt-8"></div>
          </header>

          <div class="prose prose-lg prose-invert max-w-none">
            <div class="text-gray-300 leading-relaxed text-lg font-light space-y-6">
              ${post.content
                .split("\n")
                .map((paragraph) =>
                  paragraph.trim() ? `<p>${paragraph}</p>` : "",
                )
                .join("")}
            </div>
          </div>
        </article>
      </main>
    </div>
  `;
}

// *** FJERNET ***: Alt routing-logik er væk (navigateToPost, navigateToHome, handleRoute, popstate listener)

// Hent posts og initialiser
async function fetchPosts() {
  try {
    allPosts = await Promise.all(
      postFileNames.map((fileName) =>
        fetch(`./posts/${fileName}`).then((res) => res.json()),
      ),
    );

    // *** ÆNDRING HER ***: Kald showAllPosts() direkte i stedet for handleRoute()
    showAllPosts();
  } catch (error) {
    console.error("Fejl ved hentning af posts:", error);
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = `
      <div class="min-h-screen flex items-center justify-center px-6">
        <div class="text-center">
          <h1 class="text-2xl font-light text-gray-200 mb-6">Fejl ved indlæsning</h1>
          <p class="text-gray-500 font-light">Der opstod en fejl ved hentning af posts.</p>
        </div>
      </div>
    `;
  }
}

fetchPosts();
