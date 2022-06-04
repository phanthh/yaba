import { useEffect, useState } from "react";
import { array } from "yup";
import { fetcher } from "../../../utils/fetcher";
import { Post, postSchema } from "../../../utils/schemas";
import Page from "../../layout/Page";
import PostCard from "./PostCard";

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [query, setQuery] = useState("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    fetcher("/api/post", {
      method: "GET",
      schema: array(postSchema).required(),
    }).then((data) => setPosts(data));
  }, []);

  const filteredPosts = posts
    .filter((post) => post.title.toLowerCase().includes(query.toLowerCase()))
    .sort((p1, p2) => p2.createdAt.getTime() - p1.createdAt.getTime());

  return (
    <Page title="Blog">
      <div className="post-searchbar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="50"
          height="50"
          viewBox="0 0 50 50"
        >
          <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
        </svg>
        <input
          type="text"
          onChange={handleChange}
          value={query}
          placeholder="Search ..."
          style={{ outline: "none", width: "90%" }}
        />
      </div>
      <ul className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <h4 className="empty-post-list-text">
            There aren't any post here :(
          </h4>
        )}
      </ul>
    </Page>
  );
};

export default Blog;
