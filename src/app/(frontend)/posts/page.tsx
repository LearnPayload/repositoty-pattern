import { db } from '@/repositories'

export default async function PostsPage() {
  const posts = await db.posts.getMany()

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>By {post.authorEmail}</p>
          </div>
        ))}
      </div>

      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  )
}
