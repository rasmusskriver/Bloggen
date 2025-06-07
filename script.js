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
      <article class="mb-8">
        <h1 class="text-2xl font-semibold mb-2 hover:underline cursor-pointer text-gray-900">${post.title}</h1>
        <p class="text-gray-700 leading-relaxed">${post.content}</p>
      </article>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Fejl ved hentning af posts:", error);
  }
}

fetchPosts();
