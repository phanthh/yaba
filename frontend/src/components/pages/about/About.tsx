import Page from "../../layout/Page";

const About: React.FC = () => {
  return (
    <Page title="About">
      <div className="post-card">
        <p>
          A simple multi-user blog site using the PERN stack.
          <br />
          Submission for Slush recruitment.
          <br />
          Source: <a href="https://github.com/phanthh/yaba">github</a>
          <br />
          Author: <a href="https://github.com/phanthh">phanthh</a>
        </p>
      </div>
    </Page>
  );
};

export default About;
