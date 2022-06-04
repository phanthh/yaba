type PageProps = {
  children: React.ReactNode;
  title: string;
};

const Page: React.FC<PageProps> = ({ children, title }) => {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      {children}
    </div>
  );
};

export default Page;
