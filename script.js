const postFileNames = ["post1.json", "post2.json", "post3.json"];
let allPosts = [];

// Funktion til at konvertere titel til URL-venlig slug
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Fjern accenter
    .replace(/[^a-z0-9\s-]/g, "") // Fjern specielle tegn
    .replace(/\s+/g, "-") // Erstat mellemrum med bindestreger
    .replace(/-+/g, "-") // Fjern flere bindestreger i træk
    .trim("-"); // Fjern bindestreger fra start og slut
}

// Funktion til at finde post baseret på slug
function findPostBySlug(slug) {
  return allPosts.find((post) => createSlug(post.title) === slug);
}

// Funktion til at vise alle posts
function showAllPosts() {
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
                   onclick="navigateToPost('${createSlug(post.title)}')">
            <div class="border-l-2 border-gray-700 hover:border-gray-500 pl-6 py-4 transition-colors duration-300">
              <h2 class="text-xl font-light text-gray-200 mb-3 group-hover:text-white transition-colors duration-300">
                ${post.title}
              </h2>
              <div class="text-sm text-gray-500 mb-4 font-light">
                <span>${post.author}</span>
                <span class="mx-2">·</span>
                <time datetime="${post.date}">${new Date(post.date).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" })}</time>
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
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = `
    <div class="min-h-screen">
      <!-- Navigation -->
      <nav class="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-10">
        <div class="max-w-4xl mx-auto px-6 py-4">
          <button onclick="navigateToHome()"
                  class="text-gray-400 hover:text-white transition-colors duration-300 font-light text-sm tracking-wide">
            ← Tilbage til blog
          </button>
        </div>
      </nav>

      <!-- Content -->
      <main class="pt-20 pb-16">
        <article class="max-w-4xl mx-auto px-6">
          <!-- Header -->
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

          <!-- Content -->
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

// Navigation funktioner
function navigateToPost(slug) {
  const url = `/${slug}`;
  history.pushState({ type: "post", slug }, "", url);
  handleRoute();
}

function navigateToHome() {
  history.pushState({ type: "home" }, "", "/");
  handleRoute();
}

// Route handler
function handleRoute() {
  const path = window.location.pathname;

  if (path === "/" || path === "/index.html") {
    // Vis alle posts
    document.title = "Bloggen";
    showAllPosts();
  } else {
    // Fjern leading slash og find post
    const slug = path.replace("/", "");
    const post = findPostBySlug(slug);

    if (post) {
      document.title = `${post.title} - Bloggen`;
      showSinglePost(post);
    } else {
      // 404 - post ikke fundet
      document.title = "Post ikke fundet - Bloggen";
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = `
        <div class="min-h-screen flex items-center justify-center px-6">
          <div class="text-center">
            <h1 class="text-3xl font-light text-gray-200 mb-6">Post ikke fundet</h1>
            <p class="text-gray-500 mb-8 font-light">Den post du leder efter findes ikke.</p>
            <button onclick="navigateToHome()"
                    class="bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-3 rounded-sm transition-colors duration-300 font-light tracking-wide">
              Gå til blog
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Håndter browser tilbage/frem knapper
window.addEventListener("popstate", handleRoute);

// Hent posts og initialiser
async function fetchPosts() {
  try {
    allPosts = await Promise.all(
      postFileNames.map((fileName) =>
        fetch(`./posts/${fileName}`).then((res) => res.json()),
      ),
    );

    // Initialiser routing baseret på nuværende URL
    handleRoute();
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
