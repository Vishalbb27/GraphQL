import { getJobs, getJob, getJobsByCompanyId } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: (_root, { id }) => getJob(id),
    company: (_root, { id }) => getCompany(id),
  },
  Company: {
    jobs: (company) => getJobsByCompanyId(company.id),
  },
  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsDate(job.createdAt),
  },
};

const toIsDate = (value) => {
  return value.slice(0, "yyyy-mm-dd".length);
};
