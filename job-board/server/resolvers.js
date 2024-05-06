import {
  getJobs,
  getJob,
  getJobsByCompanyId,
  createJob,
  deleteJob,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";
export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);

      if (!company) {
        throw notFoundError("No Company found with id " + id);
      }
      return company;
    },
    jobs: (_root, { limit, offset }) => getJobs(limit, offset),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("No job found with id " + id);
      }
      return job;
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const { companyId } = user;
      return createJob({ companyId, title, description });
    },

    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError("No job found with id " + id);
      }
      return job;
    },

    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const job = await updateJob({ id, title, description }, user.companyId);
      if (!job) {
        throw notFoundError("No job found with id " + id);
      }
      return job;
    },
  },
  Company: {
    jobs: (company) => getJobsByCompanyId(company.id),
  },
  Job: {
    company: (job, _args, { companyLoader }) => {
      return companyLoader.load(job.companyId);
    },
    date: (job) => toIsDate(job.createdAt),
  },
};

const notFoundError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
};

const unauthorizedError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
};

const toIsDate = (value) => {
  return value.slice(0, "yyyy-mm-dd".length);
};
