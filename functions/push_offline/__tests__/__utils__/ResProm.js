export const ResProm = async (promise) => {
    return await new Promise((resolve, reject) => {
      promise.then(
        (response) => resolve(response),
        (error) => reject(error),
      );
    });
  };