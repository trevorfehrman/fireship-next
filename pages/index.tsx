import * as React from 'react';
import Loader from '../components/Loader';
import PostFeed from '../components/PostFeed';
import { IPost } from '../interfaces/post.interface';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: {
      posts,
    },
  };
}

const Home: React.FC<{ posts: IPost[] }> = (props: { posts: IPost[] }) => {
  const [posts, setPosts] = React.useState(props.posts);
  const [loading, setLoading] = React.useState(false);
  const [postsEnd, setPostsEnd] = React.useState(false);

  async function getMorePosts() {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map(doc => doc.data()) as IPost[];

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  return (
    <main>
      <PostFeed posts={posts} admin />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      <Loader show={loading} />
      {postsEnd && 'You have reached the end!'}
    </main>
  );
};

export default Home;
