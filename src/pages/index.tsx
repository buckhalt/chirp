import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

import { api, RouterOutputs } from "~/utils/api";

const CreatePostWizard = () => {
  const {user} = useUser();

  console.log(user);

  if (!user) return null;

  return <div className="flex gap-3 w-full">
    <img 
      src={user.profileImageUrl}
      alt="Profile image"
      className="w-14 h-14 rounded-full"
    />
    <input placeholder="Type some emojis!" className="grow bg-transparent outline-none"/>
  </div>
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div key={post.id} className="flex gap-3 p-4 border-b border-slate-400">
      <img src={author.profileImageUrl} className="w-14 h-14 rounded-full"/>
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <span>{`@${author.username}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
}

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>

  if (!data) return <div>Something went wrong</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />} 
          </div>
          <div className="flex flex-col">
            {data?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id}/>
            ))}
          </div>
        </div>
        
      </main>
    </>
  );
};

export default Home;
