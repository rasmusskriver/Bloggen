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
      .map((post) => `<h1>${post.title}</h1><p>${post.content}</p>`)
      .join("");
  } catch (error) {
    console.error("Fejl ved hentning af posts:", error);
  }
}

fetchPosts();
