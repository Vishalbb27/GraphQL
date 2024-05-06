import { useQuery, useMutation } from "@apollo/client";
import {
  JobByIdQuery,
  companyByIdQuery,
  jobQuery,
  createJobMutation,
} from "./queries";

export function useCompanyId(id) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJobById(id) {
  const { data, loading, error } = useQuery(JobByIdQuery, {
    variables: { id },
  });

  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs(limit, offset) {
  const { data, loading, error } = useQuery(jobQuery, {
    variables: { limit, offset },
    fetchPolicy: "network-only",
  });

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation();

  const createJob = async (title, description) => {
    const {
      data: { job },
    } = mutate(createJobMutation, {
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: JobByIdQuery,
          variables: { id: data?.job.id },
          data,
        });
      },
    });
    return job;
  };

  return {
    createJob,
    loading,
  };
}
