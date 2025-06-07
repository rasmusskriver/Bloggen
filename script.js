const postFileNames = ["post1.json", "post2.json", "post3.json"];

async function fetchPosts() {
  try {
    const posts = await Promise.all(
      postFileNames.map((fileName) =>
        fetch(`./posts/${fileName}`).then((res) => res.json()),
      ),
    );

    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = posts
      .map(
        (post) => `
    <article class="mb-10 border-b border-gray-200 pb-6 last:border-0">
      <h2 class="text-2xl font-semibold mb-2 text-gray-900 hover:underline cursor-pointer">${post.title}</h2>
      <div class="text-sm text-gray-500 mb-4">
        <span>Af <strong>${post.author}</strong></span> &bull;
        <time datetime="${post.date}">${new Date(post.date).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" })}</time>
      </div>
      <p class="text-gray-700 leading-relaxed mb-4">${post.content}</p>
      <div class="flex flex-wrap gap-2">
      </div>
    </article>
  `,
      )
      .join("");
  } catch (error) {
    console.error("Fejl ved hentning af posts:", error);
  }
}

fetchPosts();
