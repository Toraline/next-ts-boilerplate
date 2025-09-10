import retry from "async-retry";

const waitForAllServices = async () => {
  const waitForWebServer = async () => {
    const fetchStatusPage = async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + "/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    };

    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });
  };

  await waitForWebServer();
};

const orchestrator = { waitForAllServices };

export default orchestrator;
