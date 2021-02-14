import { GetStaticPropsResult } from 'next';
import { IPost } from '../../interfaces/post.interface';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

type Params = {
  params: {
    slug: string;
    username: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post: IPost;
  let path: string;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return {};
}

const Post: React.FC = () => {
  return <main></main>;
};
export default Post;
