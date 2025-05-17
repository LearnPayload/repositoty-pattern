import { db } from '@/repositories'
import { revalidatePath } from 'next/cache'

export default async function PostsPage() {
  const posts = await db.posts.getMany()

  const post = await db.posts.getOne(posts[0].id)

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}

      <pre>{JSON.stringify(post, null, 2)}</pre>

      <button
        onClick={async () => {
          'use server'
          const post = await db.posts.create({
            title: `Test ${new Date().toISOString()}`,
            content: 'Test',
          })

          revalidatePath('/posts')

          console.log(post)
        }}
      >
        Create Post
      </button>
    </div>
  )
}
