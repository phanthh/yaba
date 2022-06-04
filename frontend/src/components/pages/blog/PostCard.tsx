import { Post } from "../../../utils/schemas";
import timeSince from "../../../utils/timeSince";

type PostCardProps = {
  post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { title, content, createdAt, author } = post;
  return (
    <div className="post-card">
      <h2 className="post-title">{title}</h2>
      <p className="post-subtitle">
        <span>{`@${author.username} - ${timeSince(createdAt)} ago`}</span>
      </p>
      <p className="post-content">{content}</p>
    </div>
  );
};

export default PostCard;
