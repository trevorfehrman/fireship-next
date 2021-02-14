import PostFeed from '../../components/PostFeed';
import UserProfile from '../../components/UserProfile';
import { IPost } from '../../interfaces/post.interface';
import { IUser } from '../../interfaces/user.interface';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';

type UserProfilePageProps = {
  user: IUser;
  posts: IPost[];
};

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);

    posts = (await postsQuery.get()).docs.map(postToJSON);
  }
  return {
    props: { user, posts },
  };
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin />
    </main>
  );
};
export default UserProfilePage;
