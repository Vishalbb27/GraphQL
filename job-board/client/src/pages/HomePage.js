import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";
import { useJobs } from "../lib/graphql/hooks";
import { Pagination } from "antd";
const JOBS_PER_PAGE = 5;

function HomePage() {
  // const [jobs, setJobs] = useState([]);
  // useEffect(() => {
  //   getJobs().then(setJobs);
  // }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } = useJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  );
  console.log(jobs);
  return (
    <div>
      {loading ? (
        <>Loading...</>
      ) : (
        <div>
          <h1 className="title">Job Board</h1>
          <div>
            <Pagination
              onChange={() => setCurrentPage(currentPage + 1)}
              defaultCurrent={currentPage}
              total={30}
            />
          </div>
          {!error && <JobList jobs={jobs} />}
        </div>
      )}
    </div>
  );
}

export default HomePage;
